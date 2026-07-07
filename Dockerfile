FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY index.js ./

RUN npm ci --omit=dev

ENV PORT=8080
EXPOSE 8080

CMD ["node", "index.js"]
