# Live well — Website

A premium e-commerce landing page for **Live well**, a wellness brand that brings quality and affordability together.

Built with **React + Vite + Tailwind CSS** and integrated with **Stripe** for payments and subscriptions.

## Features

- 🏠 **Landing Page** — Brand showcase with "Accessible Wellness" identity
- 🛍️ **Shop** — Product catalog with Bakuchiol Serum, Filtered Showerhead, and Japandi Table Lamp
- 💳 **Stripe Checkout** — Secure one-time purchases and recurring subscriptions
- 📦 **Subscribe & Save** — Flexible subscription plans with discounts up to 21%
- 📱 **Responsive Design** — Works on mobile, tablet, and desktop
- ♻️ **Sustainability Focus** — Refill options and recyclable packaging messaging

## Tech Stack

- **Frontend**: React 18 + React Router 6
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Payments**: Stripe (react-stripe-js)
- **Fonts**: Montserrat (headings/UI), Playfair Display (editorial)

## Brand Identity

| Element | Detail |
|---|---|
| **Primary Color** | Deep Navy `#1A2B3C` |
| **Accent 1** | Sage Green `#8DAA91` |
| **Accent 2** | Warm Oat `#D2B48C` |
| **Background** | Pure White `#FFFFFF` |
| **Body Text** | Soft Charcoal `#333333` |

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Stripe (Optional for Development)

Copy the example env file and add your Stripe keys:

```bash
cp .env.example .env
```

Edit `.env` with your real Stripe API keys and Price IDs. For development, placeholders will trigger a demo mode message.

### 3. Run Dev Server

```bash
npm run dev
```

The site will be available at `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
```

Output goes to the `dist/` directory.

## Project Structure

```
live-well-web/
├── public/
│   └── favicon.svg
├── server/                  # Express backend for Stripe
│   ├── index.js             # API routes (PaymentIntent, SetupIntent, webhooks)
│   ├── package.json
│   ├── .env.example
│   └── .env                 # (create from .env.example)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Responsive navigation
│   │   └── Footer.jsx        # Site footer with links
│   ├── pages/
│   │   ├── Home.jsx          # Landing page
│   │   ├── Shop.jsx          # Product catalog
│   │   ├── Checkout.jsx      # Stripe checkout form (calls backend API)
│   │   └── Subscription.jsx  # Subscription plans page
│   ├── App.jsx               # Router setup
│   ├── main.jsx              # Entry point
│   ├── index.css             # Tailwind + custom styles
│   └── stripeConfig.js       # Stripe keys & product config
├── .env.example              # Environment variable template
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Stripe Integration

The site uses **Stripe Elements** for secure card input and **react-stripe-js** for the React integration.

### One-time Purchases
Products like the Bakuchiol Serum and Japandi Lamp use `PaymentIntent` for single payments.

### Subscriptions
Refill plans use `SetupIntent` + Stripe Billing for recurring payments. Customers are charged automatically based on their selected frequency.

### Backend Server (Included)

A minimal **Node.js/Express** backend is included in the `server/` directory. It handles:

1. **POST /api/create-payment-intent** — Creates a Stripe PaymentIntent for one-time purchases
2. **POST /api/create-setup-intent** — Creates a SetupIntent for saving subscription payment methods
3. **POST /api/create-subscription** — Creates a recurring subscription after setup
4. **POST /api/stripe-webhook** — Handles Stripe webhook events (payment success, failure, subscription created)
5. **GET /api/health** — Health check endpoint
6. **GET /api/prices** — Returns the product/price catalog

#### Running the Backend

```bash
cd server
cp .env.example .env      # Add your real Stripe keys
npm install
npm start                 # Starts on port 3001
```

The frontend dev server proxies API calls to `http://localhost:3001` via the `VITE_API_URL` env variable.

#### Demo Mode

When `STRIPE_SECRET_KEY` contains a placeholder value or is not set, the server runs in **demo mode** — it returns simulated responses instead of contacting Stripe. This lets you test the full checkout flow without real keys.

### Full Production Setup

1. Create Stripe products & prices in Stripe Dashboard
2. Copy Price IDs to `server/.env` and `client/.env`
3. Set `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLISHABLE_KEY`
4. (Optional) Set up a Stripe webhook in the dashboard pointing to `/api/stripe-webhook`
5. Run the backend: `cd server && npm start`
6. Run the frontend: `npm run dev`
7. Build for production: `npm run build` — deploys `dist/`

See `server/.env.example` and `.env.example` for all required variables.

## Credits

- Brand identity and product concepts by the Live well design team
- Market research by the Live well research team
- Built with ❤️ by the Live well development team