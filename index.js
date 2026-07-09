import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

// ─── DB ────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false, sslmode: 'verify-full' },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// ─── APP ───────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// ─── CREDIT PACKAGES ──────────────────────────────────────────
const PACKAGES = {
  starter:    { credits: 1000,   piez_cost: 10  },
  pro:        { credits: 10000,  piez_cost: 75  },
  enterprise: { credits: 100000, piez_cost: 500 },
};

// ─── HEALTH ───────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  let dbStatus = 'unknown';
  try {
    await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'disconnected';
  }
  res.json({ status: 'ok', db: dbStatus, ts: new Date().toISOString() });
});

// ─── 1. GET /api/credits/packages ─────────────────────────────
app.get('/api/credits/packages', (req, res) => {
  res.json({ packages: PACKAGES });
});

// ─── 2. POST /api/credits/init ────────────────────────────────
// Create account for a new user
app.post('/api/credits/init', async (req, res) => {
  const userId = req.headers['x-user-id'];
  const { wallet_address } = req.body;

  if (!userId || !wallet_address) {
    return res.status(400).json({ error: 'x-user-id header and wallet_address required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO credit_accounts (user_id, wallet_address, credits_balance, tier)
       VALUES ($1, $2, 100, 'free')
       ON CONFLICT (user_id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, wallet_address]
    );
    res.json({ status: 'success', account: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── 3. GET /api/credits/balance ──────────────────────────────
app.get('/api/credits/balance', async (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(400).json({ error: 'x-user-id header required' });

  try {
    const result = await pool.query(
      'SELECT user_id, credits_balance, tier, updated_at FROM credit_accounts WHERE user_id = $1',
      [userId]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Account not found. Call /api/credits/init first.' });
    res.json({ status: 'success', ...result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── 4. POST /api/credits/buy ─────────────────────────────────
app.post('/api/credits/buy', async (req, res) => {
  const userId = req.headers['x-user-id'];
  const { packageName, txHash, chain } = req.body;

  if (!userId || !packageName || !txHash || !chain) {
    return res.status(400).json({ error: 'packageName, txHash, chain + x-user-id header required' });
  }

  const pkg = PACKAGES[packageName];
  if (!pkg) return res.status(404).json({ error: 'Package not found. Use: starter, pro, enterprise' });

  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Ensure account exists
    await client.query(
      `INSERT INTO credit_accounts (user_id, wallet_address, credits_balance, tier)
       VALUES ($1, 'unknown', 100, 'free')
       ON CONFLICT (user_id) DO NOTHING`,
      [userId]
    );

    // Record transaction
    await client.query(
      `INSERT INTO credit_transactions (user_id, transaction_id, credits, piez_paid, tx_hash, chain, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'confirmed')`,
      [userId, transactionId, pkg.credits, pkg.piez_cost, txHash, chain]
    );

    // Add credits + upgrade tier if applicable
    const newTier = packageName === 'enterprise' ? 'enterprise' : packageName === 'pro' ? 'pro' : 'free';
    const result = await client.query(
      `UPDATE credit_accounts
       SET credits_balance = credits_balance + $1,
           tier = CASE WHEN $2 != 'free' THEN $2 ELSE tier END,
           last_refill = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $3
       RETURNING credits_balance, tier`,
      [pkg.credits, newTier, userId]
    );

    await client.query('COMMIT');

    res.json({
      status: 'success',
      transactionId,
      userId,
      packageName,
      creditsAdded: pkg.credits,
      newBalance: result.rows[0].credits_balance,
      tier: result.rows[0].tier,
      txHash,
      chain,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    await client.query('ROLLBACK');
    // Handle duplicate tx
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Transaction already processed', txHash });
    }
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ─── 5. POST /api/credits/consume ─────────────────────────────
app.post('/api/credits/consume', async (req, res) => {
  const userId = req.headers['x-user-id'];
  const { cost_type, quantity = 1, credits } = req.body;

  if (!userId || !cost_type || !credits) {
    return res.status(400).json({ error: 'cost_type, credits + x-user-id header required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check balance
    const account = await client.query(
      'SELECT credits_balance FROM credit_accounts WHERE user_id = $1 FOR UPDATE',
      [userId]
    );
    if (!account.rows.length) return res.status(404).json({ error: 'Account not found' });
    if (parseFloat(account.rows[0].credits_balance) < parseFloat(credits)) {
      await client.query('ROLLBACK');
      return res.status(402).json({ error: 'Insufficient credits', balance: account.rows[0].credits_balance });
    }

    // Deduct
    const result = await client.query(
      `UPDATE credit_accounts
       SET credits_balance = credits_balance - $1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2
       RETURNING credits_balance`,
      [credits, userId]
    );

    // Log usage
    await client.query(
      `INSERT INTO credit_usage (user_id, cost_type, quantity, credits_deducted)
       VALUES ($1, $2, $3, $4)`,
      [userId, cost_type, quantity, credits]
    );

    await client.query('COMMIT');
    res.json({ status: 'success', creditsUsed: credits, newBalance: result.rows[0].credits_balance });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ─── 6. POST /api/credits/transfer ────────────────────────────
app.post('/api/credits/transfer', async (req, res) => {
  const fromUserId = req.headers['x-user-id'];
  const { to_user_id, credits } = req.body;

  if (!fromUserId || !to_user_id || !credits) {
    return res.status(400).json({ error: 'to_user_id, credits + x-user-id header required' });
  }
  if (fromUserId === to_user_id) {
    return res.status(400).json({ error: 'Cannot transfer to yourself' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const from = await client.query(
      'SELECT credits_balance FROM credit_accounts WHERE user_id = $1 FOR UPDATE',
      [fromUserId]
    );
    if (!from.rows.length) return res.status(404).json({ error: 'Sender account not found' });
    if (parseFloat(from.rows[0].credits_balance) < parseFloat(credits)) {
      await client.query('ROLLBACK');
      return res.status(402).json({ error: 'Insufficient credits' });
    }

    const to = await client.query(
      'SELECT user_id FROM credit_accounts WHERE user_id = $1',
      [to_user_id]
    );
    if (!to.rows.length) return res.status(404).json({ error: 'Recipient account not found' });

    // Deduct from sender, add to recipient
    await client.query(
      `UPDATE credit_accounts SET credits_balance = credits_balance - $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2`,
      [credits, fromUserId]
    );
    await client.query(
      `UPDATE credit_accounts SET credits_balance = credits_balance + $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2`,
      [credits, to_user_id]
    );

    // Log transfer
    await client.query(
      `INSERT INTO credit_transfers (from_user_id, to_user_id, credits) VALUES ($1, $2, $3)`,
      [fromUserId, to_user_id, credits]
    );

    await client.query('COMMIT');
    res.json({ status: 'success', transferred: credits, from: fromUserId, to: to_user_id });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ─── 7. POST /api/credits/refund-unused ───────────────────────
app.post('/api/credits/refund-unused', async (req, res) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(400).json({ error: 'x-user-id header required' });

  try {
    // Calculate unused credits this cycle (balance above free tier floor)
    const account = await pool.query(
      'SELECT credits_balance, tier FROM credit_accounts WHERE user_id = $1',
      [userId]
    );
    if (!account.rows.length) return res.status(404).json({ error: 'Account not found' });

    const balance = parseFloat(account.rows[0].credits_balance);
    const floor = 100; // free tier floor
    const refundable = Math.max(0, balance - floor);
    const refundRate = account.rows[0].tier === 'pro' ? 0.40 : account.rows[0].tier === 'enterprise' ? 0.50 : 0.25;
    const creditsRefunded = refundable * refundRate;
    const piezRefunded = creditsRefunded * 0.0001; // rough rate

    if (creditsRefunded < 1) {
      return res.json({ status: 'nothing_to_refund', balance, refundable });
    }

    await pool.query(
      `INSERT INTO credit_refunds (user_id, credits_refunded, piez_refunded) VALUES ($1, $2, $3)`,
      [userId, creditsRefunded, piezRefunded]
    );

    res.json({ status: 'success', creditsRefunded, piezRefunded, refundRate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── 8. POST /api/credits/reset-limit ─────────────────────────
app.post('/api/credits/reset-limit', async (req, res) => {
  const userId = req.headers['x-user-id'];
  const { credits } = req.body;
  const RESET_COST = 50;

  if (!userId) return res.status(400).json({ error: 'x-user-id header required' });

  try {
    const result = await pool.query(
      `UPDATE credit_accounts
       SET credits_balance = credits_balance - $1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2 AND credits_balance >= $1
       RETURNING credits_balance`,
      [RESET_COST, userId]
    );
    if (!result.rows.length) return res.status(402).json({ error: `Insufficient credits. Reset costs ${RESET_COST} credits.` });
    res.json({ status: 'success', costPaid: RESET_COST, newBalance: result.rows[0].credits_balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── 9. POST /api/credits/link-account ────────────────────────
app.post('/api/credits/link-account', async (req, res) => {
  const primaryUserId = req.headers['x-user-id'];
  const { linked_user_id, platform } = req.body;

  if (!primaryUserId || !linked_user_id || !platform) {
    return res.status(400).json({ error: 'linked_user_id, platform + x-user-id header required' });
  }

  try {
    await pool.query(
      `INSERT INTO account_links (primary_user_id, linked_user_id, platform)
       VALUES ($1, $2, $3)
       ON CONFLICT (primary_user_id, linked_user_id) DO NOTHING`,
      [primaryUserId, linked_user_id, platform]
    );
    res.json({ status: 'success', linked: { primary: primaryUserId, linked: linked_user_id, platform } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── 10. POST /api/credits/create-pool ────────────────────────
app.post('/api/credits/create-pool', async (req, res) => {
  const ownerId = req.headers['x-user-id'];
  const { pool_name, credits } = req.body;

  if (!ownerId || !pool_name || !credits) {
    return res.status(400).json({ error: 'pool_name, credits + x-user-id header required' });
  }

  const poolId = `pool_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Deduct from owner
    const result = await client.query(
      `UPDATE credit_accounts
       SET credits_balance = credits_balance - $1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2 AND credits_balance >= $1
       RETURNING credits_balance`,
      [credits, ownerId]
    );
    if (!result.rows.length) {
      await client.query('ROLLBACK');
      return res.status(402).json({ error: 'Insufficient credits to fund pool' });
    }

    await client.query(
      `INSERT INTO credit_pools (pool_id, owner_id, pool_name, credits) VALUES ($1, $2, $3, $4)`,
      [poolId, ownerId, pool_name, credits]
    );

    await client.query('COMMIT');
    res.json({ status: 'success', poolId, pool_name, credits, ownerBalance: result.rows[0].credits_balance });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// ─── START ────────────────────────────────────────────────────
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ UUON MOS running on port ${PORT}`);
  console.log(`📦 DB: ${process.env.DATABASE_URL ? 'connected' : 'NO DATABASE_URL SET'}`);
});
