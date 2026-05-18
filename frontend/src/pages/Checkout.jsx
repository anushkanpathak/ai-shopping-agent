import React from 'react';
import { useCheckout } from '../context/CheckoutContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm.jsx';
import OrderReview from '../components/OrderReview.jsx';
import OrderSuccess from '../components/OrderSuccess.jsx';
import CartItem from '../components/CartItem.jsx';
import { ArrowLeft, Check, ArrowRight } from 'lucide-react';
import './Checkout.css';

const STEPS = ['Cart', 'Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const { step, nextStep } = useCheckout();
  const { items, total } = useCart();
  const navigate = useNavigate();
  const isINR = items.some(i => i.currency === 'INR');
  const sym = isINR ? '₹' : '$';

  if (step === 5) return <OrderSuccess />;

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button className="back-btn" onClick={() => navigate('/cart')}><ArrowLeft size={16} /> Back</button>
        <h1 className="checkout-title">Checkout</h1>
      </div>

      <div className="checkout-steps">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className={`step ${step > i + 1 ? 'done' : step === i + 1 ? 'active' : ''}`}>
              <div className="step-circle">{step > i + 1 ? <Check size={12} /> : i + 1}</div>
              <span>{s}</span>
            </div>
            {i < 3 && <div className={`step-line ${step > i + 2 ? 'done' : ''}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="checkout-body">
        <div className="checkout-main">
          {step === 1 && (
            <div>
              <h2 className="section-title">Review Your Cart</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {items.map(item => <CartItem key={item.variantId} item={item} />)}
              </div>
              <div className="form-actions">
                <button className="form-btn" onClick={nextStep}>
                  Continue to Shipping <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
          {(step === 2 || step === 3) && <CheckoutForm />}
          {step === 4 && <OrderReview />}
        </div>

        <div className="checkout-summary-panel">
          <h3 className="section-title">Order Summary</h3>
          {items.map(item => (
            <div key={item.variantId} className="checkout-summary-item">
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.title} × {item.quantity}</span>
              <span>{item.currency === 'INR' ? '₹' : '$'}{(parseFloat(item.price) * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="checkout-summary-item total">
            <span>Total</span>
            <span>{sym}{parseFloat(total).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
