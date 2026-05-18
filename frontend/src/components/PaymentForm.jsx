import React from 'react';
import { ArrowLeft, ArrowRight, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { useCheckout } from '../context/CheckoutContext';
import '../styles/checkout.css';

const PaymentForm = () => {
  const { paymentInfo, setPaymentInfo, nextStep, prevStep } = useCheckout();

  const handleChange = (e) => {
    setPaymentInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="checkout-section">
      <h2><CreditCard size={20} /> Payment</h2>
      <form onSubmit={handleSubmit}>
        <div className="payment-methods">
          {[
            { value: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={16} /> },
            { value: 'upi', label: 'UPI', icon: <Smartphone size={16} /> },
            { value: 'wallet', label: 'Digital Wallet', icon: <Wallet size={16} /> },
          ].map(m => (
            <label
              key={m.value}
              className={`payment-method ${paymentInfo.method === m.value ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="method"
                value={m.value}
                checked={paymentInfo.method === m.value}
                onChange={handleChange}
              />
              {m.icon}
              <span className="payment-method-label">{m.label}</span>
            </label>
          ))}
        </div>

        {paymentInfo.method === 'card' && (
          <div className="card-details">
            <div className="form-grid">
              <div className="checkout-form-group full-width">
                <label>Card Number</label>
                <input
                  name="cardNumber"
                  value={paymentInfo.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              <div className="checkout-form-group full-width">
                <label>Name on Card</label>
                <input
                  name="cardName"
                  value={paymentInfo.cardName}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                  required
                />
              </div>
              <div className="checkout-form-group">
                <label>Expiry</label>
                <input
                  name="expiry"
                  value={paymentInfo.expiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div className="checkout-form-group">
                <label>CVV</label>
                <input
                  name="cvv"
                  value={paymentInfo.cvv}
                  onChange={handleChange}
                  placeholder="•••"
                  type="password"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {paymentInfo.method === 'upi' && (
          <div className="checkout-form-group" style={{ marginTop: 12 }}>
            <label>UPI ID</label>
            <input placeholder="yourname@upi" required />
          </div>
        )}

        <div className="checkout-nav-btns">
          <button type="button" className="btn-prev" onClick={prevStep}>
            <ArrowLeft size={16} /> Back
          </button>
          <button type="submit" className="btn-next">
            Review Order <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
