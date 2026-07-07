import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/credits/packages', (req, res) => {
  res.json({
    packages: {
      starter: { name: 'Starter', credits: 1000, piez_cost: 10 },
      pro: { name: 'Pro', credits: 10000, piez_cost: 75 },
      enterprise: { name: 'Enterprise', credits: 100000, piez_cost: 500 }
    }
  });
});

app.post('/api/credits/buy', (req, res) => {
  const { packageName, txHash, chain } = req.body;
  const userId = req.headers['x-user-id'];

  if (!userId || !packageName || !txHash || !chain) {
    return res.status(400).json({ error: 'Missing required fields: packageName, txHash, chain, x-user-id header' });
  }

  const packages = {
    starter: { name: 'Starter', credits: 1000, piez_cost: 10 },
    pro: { name: 'Pro', credits: 10000, piez_cost: 75 },
    enterprise: { name: 'Enterprise', credits: 100000, piez_cost: 500 }
  };

  const pkg = packages[packageName];
  if (!pkg) {
    return res.status(404).json({ error: 'Package not found. Use: starter, pro, or enterprise' });
  }

  res.json({
    status: 'success',
    transaction: {
      transactionId: `txn_${Date.now()}`,
      userId,
      packageName,
      credits: pkg.credits,
      piez_paid: pkg.piez_cost,
      txHash,
      chain,
      timestamp: new Date().toISOString(),
      status: 'confirmed'
    },
    message: `Successfully purchased ${packageName} package with ${pkg.credits} credits`
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server on port ${PORT}`));
