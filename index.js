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

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server on port ${PORT}`));
