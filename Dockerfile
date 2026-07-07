# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build the app
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./
RUN npm ci

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/migrations ./migrations 2>/dev/null || true
COPY server ./server
COPY shared ./shared
COPY tsconfig.json ./

EXPOSE 5000

# Run database migration and start dev server
CMD ["sh", "-c", "DATABASE_URL='postgres://postgres:[REDACTED]@uuon-clouud-db:5432/clouud' npm run dev"]
