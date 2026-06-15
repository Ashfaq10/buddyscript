FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

ENV PORT=5000
EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
