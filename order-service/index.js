const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Endpoint to permanently save a completed order
app.post('/api/orders', async (req, res) => {
  const { orderId, totalPaid, timestamp, items } = req.body;

  try {
    console.log(`\n📝 Saving Order ${orderId} to PostgreSQL...`);
    
    // Prisma transaction: Create the order and its linked items simultaneously
    const newOrder = await prisma.order.create({
      data: {
        id: orderId,
        totalPaid: totalPaid,
        timestamp: timestamp,
        items: {
          create: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.salePrice
          }))
        }
      },
      include: { items: true } // Return the saved items in the response
    });

    console.log(`✅ Order ${orderId} permanently saved!`);
    res.json({ success: true, order: newOrder });
  } catch (error) {
    console.error('❌ Failed to save order:', error);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// Endpoint to view all saved orders
app.get('/api/orders', async (req, res) => {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { timestamp: 'desc' }
  });
  res.json(orders);
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🚀 Order Microservice running on http://localhost:${PORT}`);
});