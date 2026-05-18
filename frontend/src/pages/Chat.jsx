import React, { useState } from 'react';
import { ShoppingBag, LogOut, Sparkles, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ChatWindow from '../components/ChatWindow';
import CartSidebar from '../components/CartSidebar';
import './Chat.css';

export default function Chat() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="chat-page">
      <nav className="chat-nav">
        <div className="nav-logo">
          <div className="nav-logo-icon"><ShoppingBag size={18} /></div>
          <span className="nav-logo-text">ShopMind</span>
          <span className="nav-logo-badge"><Sparkles size={10} />AI</span>
        </div>

        <div className="nav-actions">
          <span className="nav-user">{user?.email?.split('@')[0]}</span>
          <button className="nav-cart-btn" onClick={() => setCartOpen(true)}>
            <ShoppingCart size={18} />
            {itemCount > 0 && <span className="nav-cart-badge">{itemCount}</span>}
          </button>
          <button className="nav-logout-btn" onClick={logout} title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      <main className="chat-main">
        <ChatWindow />
      </main>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
