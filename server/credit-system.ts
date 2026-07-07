// ============================================================
// UUON Credit System - Token/Limit Reset Service
// Monetizable: Users pay PIEZ → get service credits
// Cross-System: Credits work across MOS, C Bot, and APIs
// ============================================================

export interface CreditAccount {
  userId: string;
  walletAddress: string;
  creditsBalance: number; // 1 credit = 1,000 API calls OR 1GB bandwidth
  tier: "free" | "pro" | "enterprise";
  expiresAt: number | null; // null = no expiry
  lastRefill: number;
  refillHistory: RefillTransaction[];
  linkedAccounts: string[]; // Cross-system user IDs
}

export interface RefillTransaction {
  transactionId: string;
  amount: number; // credits
  piez_paid: number; // PIEZ tokens
  txHash: string;
  chain: string; // base | arbitrum | optimism
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
}

export interface CreditPackage {
  name: string;
  credits: number;
  piez_cost: number;
  monthly_refund_percent: number; // unused credits refund %
  tier: string;
  features: string[];
}

// ============================================================
// Credit Packages (User-Facing)
// ============================================================

export const CREDIT_PACKAGES: Record<string, CreditPackage> = {
  starter: {
    name: "Starter Pack",
    credits: 1000, // 1M API calls
    piez_cost: 10, // $0.05 USD equivalent
    monthly_refund_percent: 50, // 50% refund on unused
    tier: "pro",
    features: [
      "1M API calls/month",
      "10GB bandwidth",
      "Shape queries (up to 100/day)",
      "Basic lattice proofs",
    ],
  },
  pro: {
    name: "Pro Pack",
    credits: 10000,
    piez_cost: 75,
    monthly_refund_percent: 25,
    tier: "pro",
    features: [
      "10M API calls/month",
      "100GB bandwidth",
      "Unlimited shape queries",
      "Priority lattice proofs",
      "Custom domains",
      "API rate limit bypass",
    ],
  },
  enterprise: {
    name: "Enterprise Pack",
    credits: 100000,
    piez_cost: 500,
    monthly_refund_percent: 10,
    tier: "enterprise",
    features: [
      "100M API calls/month",
      "1TB bandwidth",
      "White-label deployment",
      "Dedicated endpoint",
      "Custom SLA",
      "Account manager",
      "No rate limits",
    ],
  },
};

// ============================================================
// Credit Consumption Rules
// ============================================================

export const CREDIT_COSTS = {
  // API operations
  api_shape_query: 1, // 1 credit = 1 query
  api_multimodal_upload: 50, // 50 credits = 1 upload
  api_lattice_compute: 5, // 5 credits = 1 computation
  api_proof_generation: 10, // 10 credits = 1 proof
  
  // Bandwidth (per GB)
  bandwidth_per_gb: 0.1, // 0.1 credit per GB
  
  // Premium features
  custom_domain_monthly: 100,
  white_label_monthly: 5000,
  dedicated_endpoint: 200,
  
  // Recovery/Resets
  api_rate_limit_reset: 25,
  account_recovery: 50,
  priority_support: 100,
};

// ============================================================
// Smart Contract Interface (PIEZ ↔ Credits)
// ============================================================

export const CREDIT_SMART_CONTRACT = {
  address: "0xUUON_CREDIT_SYSTEM",
  interface: {
    // User buys credits with PIEZ
    buyCredits: {
      inputs: ["userAddress", "piez_amount", "credit_package"],
      outputs: ["transaction_id", "credits_issued"],
      description: "Convert PIEZ tokens to credits",
    },
    
    // Refund unused credits
    refundUnusedCredits: {
      inputs: ["userAddress", "cycle_id"],
      outputs: ["piez_refunded"],
      description: "Monthly refund for unused credits",
    },
    
    // Transfer credits between wallets
    transferCredits: {
      inputs: ["from_address", "to_address", "credits"],
      outputs: ["transaction_id"],
      description: "Send credits to another user",
    },
    
    // Claim referral bonus
    claimReferralBonus: {
      inputs: ["referrer_address", "referee_address"],
      outputs: ["bonus_credits"],
      description: "Earn 10% commission on referred user's purchases",
    },
  },
};

// ============================================================
// Cross-System Account Linking
// ============================================================

export class CreditSystemManager {
  private creditAccounts: Map<string, CreditAccount> = new Map();
  private db: any;
  private redisClient: any;

  constructor(db: any, redis: any) {
    this.db = db;
    this.redisClient = redis;
  }

  /**
   * CREATE ACCOUNT: Link wallet to credit system
   */
  async createCreditAccount(
    userId: string,
    walletAddress: string
  ): Promise<CreditAccount> {
    const account: CreditAccount = {
      userId,
      walletAddress,
      creditsBalance: 0,
      tier: "free",
      expiresAt: null,
      lastRefill: 0,
      refillHistory: [],
      linkedAccounts: [],
    };

    // Give free tier 100 credits as intro
    account.creditsBalance = 100;

    // Persist to database
    await this.db.query(
      `
      INSERT INTO credit_accounts (user_id, wallet_address, credits_balance, tier, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (wallet_address) DO UPDATE SET credits_balance = $3
    `,
      [userId, walletAddress, account.creditsBalance, account.tier]
    );

    // Cache in Redis
    await this.redisClient.setex(
      `credits:${userId}`,
      86400 * 7, // 7 days
      JSON.stringify(account)
    );

    this.creditAccounts.set(userId, account);
    return account;
  }

  /**
   * BUY CREDITS: User sends PIEZ, receives credits
   */
  async buyCredits(
    userId: string,
    packageName: string,
    txHash: string,
    chain: string
  ): Promise<RefillTransaction> {
    const pkg = CREDIT_PACKAGES[packageName];
    if (!pkg) throw new Error("Invalid package");

    const transaction: RefillTransaction = {
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      amount: pkg.credits,
      piez_paid: pkg.piez_cost,
      txHash,
      chain,
      timestamp: Date.now(),
      status: "pending",
    };

    const account = this.creditAccounts.get(userId) || 
      (await this.getAccount(userId));
    
    if (!account) throw new Error("Account not found");

    // Add transaction to history
    account.refillHistory.push(transaction);
    account.creditsBalance += pkg.credits;
    account.tier = pkg.tier;
    account.lastRefill = Date.now();

    // Mark transaction as confirmed (in production: verify on-chain)
    transaction.status = "confirmed";

    // Persist
    await this.db.query(
      `
      UPDATE credit_accounts
      SET credits_balance = credits_balance + $1,
          tier = $2,
          last_refill = NOW()
      WHERE user_id = $3
    `,
      [pkg.credits, pkg.tier, userId]
    );

    // Log transaction
    await this.db.query(
      `
      INSERT INTO credit_transactions (user_id, transaction_id, credits, piez_paid, tx_hash, chain, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
      [userId, transaction.transactionId, pkg.credits, pkg.piez_cost, txHash, chain, "confirmed"]
    );

    // Invalidate cache
    await this.redisClient.del(`credits:${userId}`);

    return transaction;
  }

  /**
   * CONSUME CREDITS: Deduct usage
   */
  async consumeCredits(
    userId: string,
    costType: keyof typeof CREDIT_COSTS,
    quantity: number = 1
  ): Promise<{ success: boolean; creditsRemaining: number }> {
    const cost = CREDIT_COSTS[costType] * quantity;

    const account = this.creditAccounts.get(userId) || 
      (await this.getAccount(userId));
    
    if (!account) throw new Error("Account not found");

    if (account.creditsBalance < cost) {
      return { success: false, creditsRemaining: account.creditsBalance };
    }

    account.creditsBalance -= cost;

    // Persist
    await this.db.query(
      `
      UPDATE credit_accounts
      SET credits_balance = credits_balance - $1
      WHERE user_id = $2
    `,
      [cost, userId]
    );

    // Log usage
    await this.db.query(
      `
      INSERT INTO credit_usage (user_id, cost_type, quantity, credits_deducted, timestamp)
      VALUES ($1, $2, $3, $4, NOW())
    `,
      [userId, costType, quantity, cost]
    );

    // Invalidate cache
    await this.redisClient.del(`credits:${userId}`);

    return { success: true, creditsRemaining: account.creditsBalance };
  }

  /**
   * REFUND UNUSED: Monthly refund program
   */
  async refundUnusedCredits(userId: string): Promise<number> {
    const account = this.creditAccounts.get(userId) || 
      (await this.getAccount(userId));
    
    if (!account) throw new Error("Account not found");

    // Find which package user is on
    const pkg = Object.values(CREDIT_PACKAGES).find(p => p.tier === account.tier);
    if (!pkg) return 0;

    // Calculate refund
    const unusedCredits = account.creditsBalance;
    const refundPercent = pkg.monthly_refund_percent / 100;
    const refundCredits = Math.floor(unusedCredits * refundPercent);

    // Convert back to PIEZ (reverse calculation)
    const piez_refunded = (refundCredits / pkg.credits) * pkg.piez_cost;

    // Process refund
    account.creditsBalance -= refundCredits;

    await this.db.query(
      `
      INSERT INTO credit_refunds (user_id, credits_refunded, piez_refunded, cycle_date)
      VALUES ($1, $2, $3, NOW())
    `,
      [userId, refundCredits, piez_refunded]
    );

    // Invalidate cache
    await this.redisClient.del(`credits:${userId}`);

    return piez_refunded;
  }

  /**
   * TRANSFER CREDITS: User-to-user transfer
   */
  async transferCredits(
    fromUserId: string,
    toUserId: string,
    credits: number
  ): Promise<boolean> {
    const fromAccount = this.creditAccounts.get(fromUserId) || 
      (await this.getAccount(fromUserId));
    
    const toAccount = this.creditAccounts.get(toUserId) || 
      (await this.getAccount(toUserId));

    if (!fromAccount || !toAccount) throw new Error("Account not found");

    if (fromAccount.creditsBalance < credits) {
      throw new Error("Insufficient credits");
    }

    // Atomic transfer
    fromAccount.creditsBalance -= credits;
    toAccount.creditsBalance += credits;

    await this.db.query(
      `
      UPDATE credit_accounts
      SET credits_balance = credits_balance - $1
      WHERE user_id = $2
    `,
      [credits, fromUserId]
    );

    await this.db.query(
      `
      UPDATE credit_accounts
      SET credits_balance = credits_balance + $1
      WHERE user_id = $2
    `,
      [credits, toUserId]
    );

    // Log transfer
    await this.db.query(
      `
      INSERT INTO credit_transfers (from_user_id, to_user_id, credits, timestamp)
      VALUES ($1, $2, $3, NOW())
    `,
      [fromUserId, toUserId, credits]
    );

    // Invalidate caches
    await this.redisClient.del(`credits:${fromUserId}`);
    await this.redisClient.del(`credits:${toUserId}`);

    return true;
  }

  /**
   * RESET API LIMITS: Pay credits to get fresh rate limit
   */
  async resetApiLimit(userId: string): Promise<boolean> {
    const result = await this.consumeCredits(userId, "api_rate_limit_reset");
    if (!result.success) throw new Error("Insufficient credits for reset");

    // Clear rate limit counter
    await this.redisClient.del(`ratelimit:${userId}`);

    return true;
  }

  /**
   * GET ACCOUNT: Retrieve or load from DB
   */
  async getAccount(userId: string): Promise<CreditAccount | null> {
    // Try cache
    const cached = await this.redisClient.get(`credits:${userId}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // Try database
    const row = await this.db.query(
      "SELECT * FROM credit_accounts WHERE user_id = $1",
      [userId]
    );

    if (row.length === 0) return null;

    const account: CreditAccount = {
      userId: row[0].user_id,
      walletAddress: row[0].wallet_address,
      creditsBalance: row[0].credits_balance,
      tier: row[0].tier,
      expiresAt: row[0].expires_at,
      lastRefill: row[0].last_refill?.getTime() || 0,
      refillHistory: row[0].refill_history || [],
      linkedAccounts: row[0].linked_accounts || [],
    };

    // Cache it
    await this.redisClient.setex(
      `credits:${userId}`,
      86400 * 7,
      JSON.stringify(account)
    );

    return account;
  }

  /**
   * LINK ACCOUNTS: Cross-system (Telegram, Discord, GitHub, etc.)
   */
  async linkAccount(
    primaryUserId: string,
    linkedUserId: string,
    platform: string
  ): Promise<void> {
    const account = this.creditAccounts.get(primaryUserId) || 
      (await this.getAccount(primaryUserId));
    
    if (!account) throw new Error("Account not found");

    if (!account.linkedAccounts.includes(linkedUserId)) {
      account.linkedAccounts.push(linkedUserId);
    }

    await this.db.query(
      `
      INSERT INTO account_links (primary_user_id, linked_user_id, platform)
      VALUES ($1, $2, $3)
      ON CONFLICT (primary_user_id, linked_user_id) DO NOTHING
    `,
      [primaryUserId, linkedUserId, platform]
    );

    // Invalidate cache
    await this.redisClient.del(`credits:${primaryUserId}`);
  }

  /**
   * SHARE CREDITS: User creates a pool for team/friends
   */
  async createCreditPool(
    ownerUserId: string,
    poolName: string,
    poolCredits: number
  ): Promise<string> {
    const account = this.creditAccounts.get(ownerUserId) || 
      (await this.getAccount(ownerUserId));
    
    if (!account) throw new Error("Account not found");
    if (account.creditsBalance < poolCredits) throw new Error("Insufficient credits");

    const poolId = `pool_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    // Deduct from owner
    account.creditsBalance -= poolCredits;

    // Create pool
    await this.db.query(
      `
      INSERT INTO credit_pools (pool_id, owner_id, pool_name, credits, created_at)
      VALUES ($1, $2, $3, $4, NOW())
    `,
      [poolId, ownerUserId, poolName, poolCredits]
    );

    await this.db.query(
      `UPDATE credit_accounts SET credits_balance = credits_balance - $1 WHERE user_id = $2`,
      [poolCredits, ownerUserId]
    );

    return poolId;
  }
};

// ============================================================
// Database Schema
// ============================================================

export const CREDIT_SYSTEM_SCHEMA = `

CREATE TABLE IF NOT EXISTS credit_accounts (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  wallet_address VARCHAR(42) NOT NULL,
  credits_balance NUMERIC(20, 8) DEFAULT 100,
  tier VARCHAR(50) DEFAULT 'free',
  expires_at TIMESTAMP,
  last_refill TIMESTAMP,
  refill_history JSONB DEFAULT '[]',
  linked_accounts JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_wallet (wallet_address),
  INDEX idx_tier (tier)
);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  credits NUMERIC(20, 8) NOT NULL,
  piez_paid NUMERIC(20, 8) NOT NULL,
  tx_hash VARCHAR(66),
  chain VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES credit_accounts(user_id),
  INDEX idx_user_tx (user_id, created_at DESC)
);

CREATE TABLE IF NOT EXISTS credit_usage (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  cost_type VARCHAR(100) NOT NULL,
  quantity INTEGER DEFAULT 1,
  credits_deducted NUMERIC(20, 8) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES credit_accounts(user_id),
  INDEX idx_user_usage (user_id, timestamp DESC),
  INDEX idx_cost_type (cost_type)
);

CREATE TABLE IF NOT EXISTS credit_refunds (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  credits_refunded NUMERIC(20, 8) NOT NULL,
  piez_refunded NUMERIC(20, 8) NOT NULL,
  cycle_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES credit_accounts(user_id)
);

CREATE TABLE IF NOT EXISTS credit_transfers (
  id SERIAL PRIMARY KEY,
  from_user_id VARCHAR(255) NOT NULL,
  to_user_id VARCHAR(255) NOT NULL,
  credits NUMERIC(20, 8) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (from_user_id) REFERENCES credit_accounts(user_id),
  FOREIGN KEY (to_user_id) REFERENCES credit_accounts(user_id),
  INDEX idx_from_to (from_user_id, to_user_id)
);

CREATE TABLE IF NOT EXISTS account_links (
  id SERIAL PRIMARY KEY,
  primary_user_id VARCHAR(255) NOT NULL,
  linked_user_id VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (primary_user_id) REFERENCES credit_accounts(user_id),
  UNIQUE(primary_user_id, linked_user_id)
);

CREATE TABLE IF NOT EXISTS credit_pools (
  id SERIAL PRIMARY KEY,
  pool_id VARCHAR(255) UNIQUE NOT NULL,
  owner_id VARCHAR(255) NOT NULL,
  pool_name VARCHAR(255) NOT NULL,
  credits NUMERIC(20, 8) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES credit_accounts(user_id)
);

`;

export default CreditSystemManager;
