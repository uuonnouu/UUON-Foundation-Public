# Node.js ES Module server for credit system

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

# Create ES module entry point
RUN cat > index.js << 'EOF'
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
EOF

ENV PORT=8080
EXPOSE 8080

CMD ["node", "index.js"]
