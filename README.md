# 🛍️ AI Shopping Agent

**AI-powered shopping assistant with conversational product discovery, smart recommendations, and seamless Shopify integration.**

Built with React, Node.js/Express, Groq (Llama 3.1), Shopify Storefront API, and Firebase Auth.

---

## 🗂️ Project Structure

```
ai-shopping-agent/
├── frontend/          # React (Vite) frontend
├── backend/           # Node.js / Express backend
└── README.md
```

---

## 🔑 Environment Variables

### Backend — create `backend/.env`

```env
PORT=5000
FRONTEND_URL=http://localhost:5173

# Get from https://console.groq.com (free)
GROQ_API_KEY=your_groq_api_key_here

# From Shopify Admin → Apps → Develop Apps → Storefront API
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
```

### Frontend — create `frontend/.env`

```env
# From Firebase Console → Project Settings → Your Apps → Web App
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_API_URL=http://localhost:5000
```

---

## 🚀 Getting Started

### 1. Install Backend
```bash
cd backend
npm install
```

### 2. Install Frontend
```bash
cd frontend
npm install
```

### 3. Add `.env` files (see above)

### 4. Run both servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Running at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Running at http://localhost:5173
```

Open http://localhost:5173 in your browser.

---

## 🔧 Where to Get Your Keys

### Groq API Key (FREE)
1. Go to https://console.groq.com
2. Sign up / log in
3. Click **API Keys** → **Create API Key**
4. Copy and paste into `backend/.env`

### Shopify Storefront API
1. Go to your **Shopify Admin** → **Apps** → **Develop apps**
2. Click **Create an app**, give it a name
3. Click **Configure Storefront API scopes** → enable `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`
4. Click **Install app**
5. Under **API credentials**, copy the **Storefront API access token**
6. Your domain is `your-store-name.myshopify.com`

### Firebase Auth
1. Go to https://console.firebase.google.com
2. Create a new project (or use existing)
3. Go to **Authentication** → **Sign-in method** → Enable **Email/Password**
4. Go to **Project Settings** → **Your apps** → Click **</>** (Web)
5. Register app and copy the `firebaseConfig` object values

---

## ✨ Features

- 🔐 Firebase Auth (email/password login & signup)
- 🤖 AI chat powered by Groq Llama 3.1
- 🛒 Real-time Shopify product search
- 🎙️ Voice input (Web Speech API)
- 🛍️ Cart with add/remove/quantity management
- 💳 Multi-step checkout (Cart → Shipping → Payment → Review → Success)
- 🌙 Dark responsive UI

## Contribution
Anshumaan led backend API integration and deployment setup.
Anushka led frontend UI development, testing, and project integration.
Both contributors collaborated on architecture, debugging, and overall implementation.
