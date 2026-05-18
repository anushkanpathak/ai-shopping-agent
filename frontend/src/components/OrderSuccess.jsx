import React from 'react';
import { useCheckout } from '../context/CheckoutContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, MessageCircle } from 'lucide-react';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const { orderId, resetCheckout, shippingInfo } = useCheckout();
  const navigate = useNavigate();

  function handleContinue() {
    resetCheckout();
    navigate('/chat');
  }

  return (
    <div className="success-page">
      <div className="success-card slide-up">
        <div className="success-icon">
          <CheckCircle size={48} />
        </div>
        <h1 className="success-title">Order Placed!</h1>
        <p className="success-subtitle">
          Thank you{shippingInfo.fullName ? `, ${shippingInfo.fullName.split(' ')[0]}` : ''}! Your order is confirmed.
        </p>

        {orderId && (
          <div className="success-order-id">
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>
        )}

        <p className="success-note">
          A confirmation will be sent to {shippingInfo.email || 'your email'}. <br />
          Estimated delivery: 3–5 business days.
        </p>

        <div className="success-actions">
          <button className="success-btn-primary" onClick={handleContinue}>
            <MessageCircle size={16} /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
