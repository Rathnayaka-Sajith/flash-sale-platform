const express = require('express');
const { createClient } = require('redis');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Redis using the Kubernetes environment variable, fallback to localhost for local dev
const redisClient = createClient({ 
  url: process.env.REDIS_URL || 'redis://localhost:6379' 
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect().then(() => {
  console.log('✅ Redis connected successfully');
});

// Endpoint to check current stock
app.get('/api/inventory/:productId', async (req, res) => {
  const stock = await redisClient.get(`product_${req.params.productId}_stock`);
  res.json({ productId: req.params.productId, stock: parseInt(stock) || 0 });
});

// Endpoint to securely deduct stock
app.post('/api/inventory/buy/:productId', async (req, res) => {
  const productId = req.params.productId;
  const stockKey = `product_${productId}_stock`;

  console.log(`\n🛒 Incoming purchase request for Product ID: ${productId}`);

  // For the demo: Auto-initialize stock to 50 if the Next.js frontend uses a new ID
  const exists = await redisClient.exists(stockKey);
  if (!exists) {
    await redisClient.set(stockKey, 50);
    console.log(`📦 Initialized new stock for ${productId} to 50`);
  }

  // DECR is an atomic Redis operation - it prevents double-selling
  const remainingStock = await redisClient.decr(stockKey);

  if (remainingStock < 0) {
    await redisClient.incr(stockKey);
    console.log(`❌ Order failed: ${productId} is out of stock`);
    return res.status(400).json({ success: false, message: 'Out of stock!' });
  }

  console.log(`✅ Order success! ${remainingStock} units left for ${productId}`);
  res.json({ success: true, message: 'Item secured!', remainingStock });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Inventory Microservice running on port ${PORT}`);
});