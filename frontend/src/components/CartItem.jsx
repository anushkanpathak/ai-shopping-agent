import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import './CartItem.css';

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart();
  // Always show ₹ for INR products
  const sym = item.currency === 'INR' ? '₹' : '$';
  const total = (parseFloat(item.price) * item.quantity).toLocaleString('en-IN');

  return (
    <div className="cart-item">
      {item.image && (
        <img src={item.image} alt={item.title} className="cart-item-img" onError={e => e.target.style.display='none'} />
      )}
      <div className="cart-item-info">
        <p className="cart-item-title">{item.title}</p>
        <p className="cart-item-price">{sym}{total}</p>
        <div className="cart-item-qty">
          <button onClick={() => updateQty(item.variantId, item.quantity - 1)}><Minus size={12} /></button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQty(item.variantId, item.quantity + 1)}><Plus size={12} /></button>
        </div>
      </div>
      <button className="cart-item-remove" onClick={() => removeItem(item.variantId)}><Trash2 size={14} /></button>
    </div>
  );
}
