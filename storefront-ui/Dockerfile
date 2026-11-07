FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the Next.js application for production
RUN npm run build

EXPOSE 3000

# Start the optimized production server
CMD ["npm", "start"]