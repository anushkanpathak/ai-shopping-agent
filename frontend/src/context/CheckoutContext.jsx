import React, { createContext, useContext, useState } from 'react';

const CheckoutContext = createContext(null);

export function CheckoutProvider({ children }) {
  const [step, setStep] = useState(1); // 1=Cart, 2=Shipping, 3=Payment, 4=Review, 5=Success
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '', email: '', address: '', city: '', state: '', zip: '', phone: '',
  });
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'card', cardNumber: '', expiry: '', cvv: '', cardName: '',
  });
  const [orderId, setOrderId] = useState(null);

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const goToStep = (n) => setStep(n);
  const resetCheckout = () => { setStep(1); setOrderId(null); };

  return (
    <CheckoutContext.Provider value={{
      step, nextStep, prevStep, goToStep, resetCheckout,
      shippingInfo, setShippingInfo,
      paymentInfo, setPaymentInfo,
      orderId, setOrderId,
    }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used inside CheckoutProvider');
  return ctx;
}
