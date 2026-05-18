import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import CartItem from '../components/CartItem.jsx';
import { ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import './CartPage.css';

export default function CartPage() {
  const { items, total, itemCount } = useCart();
  const navigate = useNavigate();
  // Use INR formatting if any item is INR
  const isINR = items.some(i => i.currency === 'INR');
  const sym = isINR ? '₹' : '$';
  const fmt = (n) => parseFloat(n).toLocaleString('en-IN');

  return (
    <div className="cartpage">
      <div className="cartpage-header">
        <button className="back-btn" onClick={() => navigate('/chat')}><ArrowLeft size={16} /> Back to Chat</button>
        <h1 className="cartpage-title">Your Cart</h1>
        <span className="cartpage-count">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
      </div>
      <div className="cartpage-body">
        {items.length === 0 ? (
          <div className="cartpage-empty">
            <ShoppingBag size={48} strokeWidth={1} />
            <h2>Your cart is empty</h2>
            <p>Go chat with the AI to find products!</p>
            <button className="cartpage-shop-btn" onClick={() => navigate('/chat')}>Start Shopping</button>
          </div>
        ) : (
          <div className="cartpage-content">
            <div className="cartpage-items">
              {items.map(item => <CartItem key={item.variantId} item={item} />)}
            </div>
            <div className="cartpage-summary">
              <h3>Order Summary</h3>
              {items.map(item => (
                <div key={item.variantId} className="summary-row">
                  <span>{item.title} × {item.quantity}</span>
                  <span>{item.currency === 'INR' ? '₹' : '$'}{(parseFloat(item.price) * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="summary-row"><span>Shipping</span><span className="free">Free</span></div>
              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>{sym}{fmt(total)}</span>
              </div>
              <button className="cartpage-checkout-btn" onClick={() => navigate('/checkout')}>
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
