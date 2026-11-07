FROM node:18-bookworm-slim

# Install OpenSSL using the active Debian 12 repositories
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
COPY . .

RUN npx prisma generate

EXPOSE 3002

CMD ["node", "index.js"]