const express = require('express');
const router = express.Router();
const { getAllProducts, searchProducts } = require('../services/shopifyService');

// GET all products
router.get('/', async (req, res, next) => {
  try {
    const { limit = 8 } = req.query;
    const products = await getAllProducts(parseInt(limit));
    res.json({ products });
  } catch (err) {
    next(err);
  }
});

// GET search products
router.get('/search', async (req, res, next) => {
  try {
    const { q = '', budget, category } = req.query;
    const products = await searchProducts({
      keywords: q.split(' ').filter(Boolean),
      category: category || null,
      budget: budget ? parseFloat(budget) : null,
    });
    res.json({ products });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
