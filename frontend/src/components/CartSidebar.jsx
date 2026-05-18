import React from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';

export default function CartSidebar({ open, onClose }) {
  const { items, total, itemCount } = useCart();
  const navigate = useNavigate();

  function handleCheckout() {
    onClose();
    navigate('/checkout');
  }

  return (
    <>
      {open && <div className="cart-overlay" onClick={onClose} />}
      <div className={`cart-sidebar ${open ? 'open' : ''}`}>
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={18} />
            <span>Cart</span>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </div>
          <button className="cart-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={36} strokeWidth={1} />
              <p>Your cart is empty</p>
              <span>Ask the AI to find something for you!</span>
            </div>
          ) : (
            <div className="cart-items">
              {items.map(item => (
                <CartItem key={item.variantId} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span className="cart-total-amount">${total.toFixed(2)}</span>
            </div>
            <button className="cart-checkout-btn" onClick={handleCheckout}>
              Checkout <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
