# UUON MOS — Optimized for Railway
# Simplified: Skip build, run server directly with tsx

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev for tsx)
RUN npm ci

# Copy source code
COPY . .

# Environment
ENV NODE_ENV=production
ENV PORT=5001

# Expose port
EXPOSE 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5001/api/credits/packages', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start server directly with tsx (no build step)
CMD ["npx", "tsx", "server/index.ts"]
