import axios from 'axios';
import { searchMockProducts, MOCK_PRODUCTS } from '../utils/mockProducts.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

let backendAvailable = null;
async function checkBackend() {
  if (backendAvailable !== null) return backendAvailable;
  try {
    await api.get('/health', { timeout: 3000 });
    backendAvailable = true;
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

function extractKeywords(msg) {
  const stopwords = new Set(['show', 'find', 'need', 'want', 'get', 'buy', 'looking', 'for', 'me', 'some', 'the', 'a', 'an', 'give', 'best', 'please', 'can', 'you', 'i']);
  return msg.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !stopwords.has(w));
}

const MOCK_RESPONSES = {
  greeting: "Hi! I'm your AI Shopping Assistant 🛍️ Tell me what you're looking for — I'll find the perfect products for you!",
  cart: "Done! I've added that to your cart. Would you like to proceed to checkout or keep shopping?",
  budget: "Found some great picks within your budget! All available for immediate delivery.",
  gift: "Perfect for gifting! Here are some crowd-favourite picks — all beautifully packaged.",
  default: "Here are some great products for you! Hit **Add to Cart** on anything you like, or tell me more about what you need.",
};

function mockChatResponse(message) {
  const lower = message.toLowerCase();
  const keywords = extractKeywords(message);

  let response = MOCK_RESPONSES.default;
  if (/hi|hello|hey|start/i.test(lower)) response = MOCK_RESPONSES.greeting;
  else if (/budget|under|below|cheap|affordable|₹|\$/i.test(lower)) response = MOCK_RESPONSES.budget;
  else if (/gift|present|birthday|anniversary/i.test(lower)) response = MOCK_RESPONSES.gift;
  else if (/add|cart|buy|purchase|want this|i want/i.test(lower)) response = MOCK_RESPONSES.cart;

  const budgetMatch = lower.match(/(\d[\d,]+)/);
  const budget = budgetMatch ? parseInt(budgetMatch[1].replace(',', '')) : null;

  const products = searchMockProducts({ keywords, budget, count: 6 });

  return {
    response,
    products: products.length > 0 ? products : MOCK_PRODUCTS.slice(0, 6),
    intent: { isProductSearch: true, keywords, budget },
  };
}

export async function sendMessage(message, history = []) {
  const available = await checkBackend();
  if (!available) return mockChatResponse(message);

  try {
    const { data } = await api.post('/api/chat', { message, history });
    if (!data.products || data.products.length === 0) {
      const intent = data.intent || {};
      const products = searchMockProducts({
        keywords: intent.keywords || extractKeywords(message),
        category: intent.category,
        budget: intent.budget,
      });
      if (products.length > 0) data.products = products;
    }
    return data;
  } catch {
    return mockChatResponse(message);
  }
}

export async function fetchProducts(limit = 8) {
  try {
    const available = await checkBackend();
    if (!available) return MOCK_PRODUCTS.slice(0, limit);
    const { data } = await api.get('/api/products', { params: { limit } });
    return data.products?.length ? data.products : MOCK_PRODUCTS.slice(0, limit);
  } catch {
    return MOCK_PRODUCTS.slice(0, limit);
  }
}

export async function searchProducts(query, budget, category) {
  try {
    const available = await checkBackend();
    if (!available) return searchMockProducts({ keywords: query?.split(' ') || [], budget, category });
    const { data } = await api.get('/api/products/search', { params: { q: query, budget, category } });
    return data.products?.length ? data.products : searchMockProducts({ keywords: query?.split(' ') || [], budget, category });
  } catch {
    return searchMockProducts({ keywords: query?.split(' ') || [], budget, category });
  }
}

export default api;
