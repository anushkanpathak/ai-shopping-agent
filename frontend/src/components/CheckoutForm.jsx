import React from 'react';
import { useCheckout } from '../context/CheckoutContext';
import { ArrowRight, ArrowLeft, CreditCard, Smartphone } from 'lucide-react';
import '../pages/Checkout.css';

export default function CheckoutForm() {
  const { step, nextStep, prevStep, shippingInfo, setShippingInfo, paymentInfo, setPaymentInfo } = useCheckout();

  function handleShipping(e) {
    e.preventDefault();
    nextStep();
  }

  function handlePayment(e) {
    e.preventDefault();
    nextStep();
  }

  if (step === 2) {
    return (
      <form onSubmit={handleShipping}>
        <div className="form-section">
          <p className="form-section-title">📦 Shipping Information</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-row">
              <div className="form-field">
                <label>Full Name</label>
                <input required placeholder="John Doe"
                  value={shippingInfo.fullName}
                  onChange={e => setShippingInfo(p => ({ ...p, fullName: e.target.value }))} />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input type="email" required placeholder="john@example.com"
                  value={shippingInfo.email}
                  onChange={e => setShippingInfo(p => ({ ...p, email: e.target.value }))} />
              </div>
            </div>
            <div className="form-field">
              <label>Address</label>
              <input required placeholder="123 Main Street, Apt 4B"
                value={shippingInfo.address}
                onChange={e => setShippingInfo(p => ({ ...p, address: e.target.value }))} />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>City</label>
                <input required placeholder="Mumbai"
                  value={shippingInfo.city}
                  onChange={e => setShippingInfo(p => ({ ...p, city: e.target.value }))} />
              </div>
              <div className="form-field">
                <label>State</label>
                <input required placeholder="Maharashtra"
                  value={shippingInfo.state}
                  onChange={e => setShippingInfo(p => ({ ...p, state: e.target.value }))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Postal Code</label>
                <input required placeholder="400001"
                  value={shippingInfo.zip}
                  onChange={e => setShippingInfo(p => ({ ...p, zip: e.target.value }))} />
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input required placeholder="+91 98765 43210"
                  value={shippingInfo.phone}
                  onChange={e => setShippingInfo(p => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="form-btn-secondary" onClick={prevStep}>
            <ArrowLeft size={15} /> Back
          </button>
          <button type="submit" className="form-btn">
            Continue to Payment <ArrowRight size={15} />
          </button>
        </div>
      </form>
    );
  }

  // Step 3: Payment
  return (
    <form onSubmit={handlePayment}>
      <div className="form-section">
        <p className="form-section-title">💳 Payment Method</p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {['card', 'upi', 'gpay'].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setPaymentInfo(p => ({ ...p, method: m }))}
              className={`payment-method-btn ${paymentInfo.method === m ? 'selected' : ''}`}
              style={{
                flex: 1,
                padding: '10px',
                background: paymentInfo.method === m ? 'var(--accent-dim)' : 'var(--bg-input)',
                border: paymentInfo.method === m ? '1px solid var(--accent)' : '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: paymentInfo.method === m ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all var(--transition)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              {m === 'card' && <CreditCard size={14} />}
              {m === 'upi' && <Smartphone size={14} />}
              {m === 'gpay' && '🔵'}
              {m === 'card' ? 'Card' : m === 'upi' ? 'UPI' : 'GPay'}
            </button>
          ))}
        </div>

        {paymentInfo.method === 'card' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-field">
              <label>Cardholder Name</label>
              <input required placeholder="Name on card"
                value={paymentInfo.cardName}
                onChange={e => setPaymentInfo(p => ({ ...p, cardName: e.target.value }))} />
            </div>
            <div className="form-field">
              <label>Card Number</label>
              <input required placeholder="1234 5678 9012 3456" maxLength={19}
                value={paymentInfo.cardNumber}
                onChange={e => {
                  const v = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                  setPaymentInfo(p => ({ ...p, cardNumber: v }));
                }} />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Expiry</label>
                <input required placeholder="MM/YY" maxLength={5}
                  value={paymentInfo.expiry}
                  onChange={e => setPaymentInfo(p => ({ ...p, expiry: e.target.value }))} />
              </div>
              <div className="form-field">
                <label>CVV</label>
                <input required placeholder="123" type="password" maxLength={4}
                  value={paymentInfo.cvv}
                  onChange={e => setPaymentInfo(p => ({ ...p, cvv: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {paymentInfo.method === 'upi' && (
          <div className="form-field">
            <label>UPI ID</label>
            <input required placeholder="yourname@upi"
              value={paymentInfo.upiId || ''}
              onChange={e => setPaymentInfo(p => ({ ...p, upiId: e.target.value }))} />
          </div>
        )}

        {paymentInfo.method === 'gpay' && (
          <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
            You'll be redirected to Google Pay on order confirmation.
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="form-btn-secondary" onClick={prevStep}>
          <ArrowLeft size={15} /> Back
        </button>
        <button type="submit" className="form-btn">
          Review Order <ArrowRight size={15} />
        </button>
      </div>
    </form>
  );
}
