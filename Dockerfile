# Ultra-minimal Node server
# No build, no tsx, just node + JavaScript

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies (no devDependencies)
RUN npm ci --omit=dev

# Create a simple JavaScript entry point (no TypeScript)
RUN cat > index.js << 'EOF'
const express = require('express');
const cors = require('cors');

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

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server on port ${PORT}`));
EOF

ENV PORT=5001
EXPOSE 5001

CMD ["node", "index.js"]
