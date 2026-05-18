import React, { useState } from 'react';
import { ShoppingCart, Check, ImageOff } from 'lucide-react';
import './ProductCard.css';

// ProductCard does NOT call addItem internally.
// The parent (ChatWindow or CartSidebar) passes onAdd and handles cart logic.
export default function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  function handleClick() {
    if (added) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    if (onAdd) onAdd(product);
  }

  const sym = product.currency === 'INR' ? '₹' : '$';

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.imageAlt || product.title}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="product-img-placeholder"><ImageOff size={28} /></div>
        )}
        {product.vendor && <span className="product-vendor-badge">{product.vendor}</span>}
      </div>
      <div className="product-info">
        <h4 className="product-title">{product.title}</h4>
        {product.description && (
          <p className="product-desc">
            {product.description.length > 70 ? product.description.substring(0, 70) + '...' : product.description}
          </p>
        )}
        <div className="product-footer">
          <span className="product-price">{sym}{parseFloat(product.price).toLocaleString('en-IN')}</span>
          <button className={`product-add-btn ${added ? 'added' : ''}`} onClick={handleClick} disabled={!product.available}>
            {added ? <><Check size={13} /> Added!</> : <><ShoppingCart size={13} /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}
