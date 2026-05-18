import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Bot, Loader2, Check } from 'lucide-react';
import MessageBubble from './MessageBubble.jsx';
import ProductCard from './ProductCard.jsx';
import { sendMessage } from '../services/api.js';
import { addSearchToHistory } from '../utils/userSession.js';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import './ChatWindow.css';

const QUICK_PROMPTS = [
  "Trendy sneakers for men",
  "Gift under ₹2000",
  "Best wireless earbuds",
  "Fitness equipment deals",
];

function cleanAIResponse(text) {
  if (!text) return '';
  return text
    .replace(/<\/?PRODUCT_QUERY>/gi, '')
    .replace(/\{[\s\S]*?"query"[\s\S]*?\}/gs, '')
    .replace(/\{[\s\S]*?"category"[\s\S]*?\}/gs, '')
    .replace(/\{[\s\S]*?"keywords"[\s\S]*?\}/gs, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function detectAddToCart(msg) {
  const l = msg.toLowerCase();
  return l.includes('add to cart') || l.includes('add this') ||
    l.includes('i want this') || l.includes('buy this') ||
    l.includes('yes i want') || l.includes('add it') ||
    l.includes('purchase this') || l.includes('order this') || l.includes('yes buy');
}

export default function ChatWindow() {
  const { addItem, items } = useCart();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hi! I'm your AI Shopping Assistant 🛍️ Tell me what you're looking for and I'll find perfect products for you!",
    timestamp: Date.now(),
  }]);
  const [productBlocks, setProductBlocks] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [lastProducts, setLastProducts] = useState([]);
  const [toast, setToast] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, productBlocks]);

  function showToast(product) {
    setToast(product);
    setTimeout(() => setToast(null), 3000);
  }

  // THE FIX: This is the single place addItem is called. ProductCard never calls addItem itself.
  function handleAddToCart(product) {
    addItem({
      id: product.id,
      variantId: product.variantId || product.id,
      title: product.title,
      price: product.price,
      currency: product.currency,
      image: product.image,
    });
    showToast(product);
  }

  async function handleSend(text) {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    addSearchToHistory(msg);

    const userMsg = { role: 'user', content: msg, timestamp: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    // Handle add-to-cart via text
    if (detectAddToCart(msg) && lastProducts.length > 0) {
      const product = lastProducts[0];
      handleAddToCart(product);
      const sym = product.currency === 'INR' ? '₹' : '$';
      const cartMsg = {
        role: 'assistant',
        content: `✅ Added **${product.title}** (${sym}${parseFloat(product.price).toLocaleString('en-IN')}) to your cart!\n\nYou now have ${items.length + 1} item(s). Would you like to checkout or keep shopping?`,
        timestamp: Date.now(),
        isCartConfirm: true,
        product,
      };
      setMessages(prev => [...prev, cartMsg]);
      setLoading(false);
      return;
    }

    try {
      const history = newMessages.slice(-12).map(m => ({ role: m.role, content: m.content }));
      const data = await sendMessage(msg, history);
      const cleanedResponse = cleanAIResponse(data.response);

      setMessages(prev => {
        const aiMsg = { role: 'assistant', content: cleanedResponse, timestamp: Date.now() };
        const updated = [...prev, aiMsg];
        if (data.products?.length > 0) {
          setProductBlocks(pb => [...pb, { products: data.products, afterIndex: updated.length - 1 }]);
          setLastProducts(data.products);
        }
        return updated;
      });
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please make sure your backend is running!",
        timestamp: Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  function toggleVoice() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input is not supported. Try Chrome!'); return;
    }
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = 'en-IN'; r.interimResults = false;
    r.onresult = e => { setInput(e.results[0][0].transcript); setListening(false); };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    recognitionRef.current = r; r.start(); setListening(true);
  }

  function renderMessages() {
    return messages.map((m, i) => {
      const block = productBlocks.find(pb => pb.afterIndex === i);
      return (
        <React.Fragment key={i}>
          <MessageBubble message={m} />
          {m.isCartConfirm && (
            <div className="chat-cart-btns">
              <button className="chat-cta-btn primary" onClick={() => navigate('/checkout')}>🛒 Go to Checkout</button>
              <button className="chat-cta-btn" onClick={() => messagesEndRef.current?.scrollIntoView()}>Continue Shopping</button>
            </div>
          )}
          {block && (
            <div className="chat-products fade-in">
              <p className="chat-products-label">🛍️ {block.products.length} products found</p>
              <div className="chat-products-scroll">
                {block.products.map((p, pi) => (
                  <ProductCard
                    key={p.id || pi}
                    product={p}
                    onAdd={(product) => {
                      // Update lastProducts so "add to cart" text works
                      setLastProducts(prev => [product, ...prev.filter(x => x.id !== product.id)]);
                      // Call handleAddToCart — this is the ONLY place addItem is called
                      handleAddToCart(product);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </React.Fragment>
      );
    });
  }

  return (
    <div className="chat-container">
      {toast && (
        <div className="cart-toast fade-in">
          <div className="cart-toast-icon"><Check size={14} /></div>
          <div className="cart-toast-text">
            <strong>{toast.title}</strong>
            <span>Added to cart!</span>
          </div>
          <button className="cart-toast-cta" onClick={() => { setToast(null); navigate('/checkout'); }}>
            Checkout →
          </button>
        </div>
      )}

      <div className="chat-messages">
        {renderMessages()}
        {loading && (
          <div className="chat-typing">
            <div className="chat-typing-avatar"><Bot size={14} /></div>
            <div className="chat-typing-dots"><span /><span /><span /></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-footer">
        {messages.length <= 1 && (
          <div className="chat-quick-prompts">
            {QUICK_PROMPTS.map(q => (
              <button key={q} className="quick-prompt-btn" onClick={() => handleSend(q)}>{q}</button>
            ))}
          </div>
        )}
        <div className="chat-input-row">
          <button className={`chat-voice-btn ${listening ? 'active' : ''}`} onClick={toggleVoice}>
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <textarea
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={listening ? "Listening..." : "Ask about products, budget, gifting ideas..."}
            rows={1}
            disabled={loading}
          />
          <button className="chat-send-btn" onClick={() => handleSend()} disabled={!input.trim() || loading}>
            {loading ? <Loader2 size={18} className="spin-icon" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
