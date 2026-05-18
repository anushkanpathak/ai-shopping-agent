const express = require('express');
const router = express.Router();
const { getChatResponse, extractIntent } = require('../services/groqService');
const { searchProducts } = require('../services/shopifyService');

router.post('/', async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Extract intent to know if we need to search products
    const intent = await extractIntent(message);

    let products = [];
    if (intent.isProductSearch) {
      products = await searchProducts({
        keywords: intent.keywords,
        category: intent.category,
        budget: intent.budget,
      });
    }

    // Build context with products if found
    let enrichedMessage = message;
    if (products.length > 0) {
      const productList = products
        .slice(0, 5)
        .map(p => `- ${p.title} (${p.currency} ${p.price})`)
        .join('\n');
      enrichedMessage = `${message}\n\n[Available products matching your query:\n${productList}]`;
    }

    const aiResponse = await getChatResponse(history, enrichedMessage);

    res.json({
      response: aiResponse,
      products: products.slice(0, 6),
      intent,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
