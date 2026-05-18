import React from 'react';
import { useCheckout } from '../context/CheckoutContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { ArrowLeft, Check } from 'lucide-react';

export default function OrderReview() {
  const { prevStep, nextStep, shippingInfo, paymentInfo, setOrderId } = useCheckout();
  const { items, total, clearCart } = useCart();
  const isINR = items.some(i => i.currency === 'INR');
  const sym = isINR ? '₹' : '$';

  function handlePlaceOrder() {
    const id = 'ORD-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    setOrderId(id);
    clearCart();
    nextStep();
  }

  const maskCard = (num) => num ? '•••• •••• •••• ' + num.replace(/\s/g, '').slice(-4) : 'N/A';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="form-section">
        <p className="form-section-title">📦 Shipping To</p>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <strong style={{ color: 'var(--text-primary)' }}>{shippingInfo.fullName}</strong><br />
          {shippingInfo.address}<br />
          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}<br />
          {shippingInfo.phone}
        </div>
      </div>

      <div className="form-section">
        <p className="form-section-title">💳 Payment</p>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          {paymentInfo.method === 'card' && <span>Card · {maskCard(paymentInfo.cardNumber)}</span>}
          {paymentInfo.method === 'upi' && <span>UPI · {paymentInfo.upiId}</span>}
          {paymentInfo.method === 'gpay' && <span>Google Pay</span>}
        </div>
      </div>

      <div className="form-section">
        <p className="form-section-title">🛒 Items ({items.length})</p>
        {items.map(item => (
          <div key={item.variantId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <span>{item.title} × {item.quantity}</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {item.currency === 'INR' ? '₹' : '$'}{(parseFloat(item.price) * item.quantity).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>
          <span>Total</span>
          <span>{sym}{parseFloat(total).toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="form-btn-secondary" onClick={prevStep}><ArrowLeft size={15} /> Back</button>
        <button className="form-btn" onClick={handlePlaceOrder}><Check size={15} /> Place Order</button>
      </div>
    </div>
  );
}
