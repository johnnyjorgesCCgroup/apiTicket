// productRoutes.js
import express from 'express';
import fs from 'fs';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const data = fs.readFileSync('dbProducts.json', 'utf8');
    const products = JSON.parse(data);
    res.json(products);
    
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
