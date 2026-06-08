/**
 * Stripe Configuration
 *
 * IMPORTANT: Replace the placeholder API keys below with your real Stripe keys.
 *
 * How to get your Stripe keys:
 * 1. Go to https://dashboard.stripe.com/register and create an account (or log in).
 * 2. Navigate to Dashboard → Developers → API keys.
 * 3. Copy your Publishable key (pk_live_...) and Secret key (sk_live_...).
 * 4. Update the values below.
 *
 * For testing: use pk_test_... keys and test card number 4242 4242 4242 4242.
 *
 * NEVER commit real secret keys to version control. Use environment variables:
 *   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
 *   STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE (server-side only)
 */

// Placeholder publishable key — replace with your real key
const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder_replace_me';

export { STRIPE_PUBLISHABLE_KEY };

/**
 * Backend API base URL.
 * In development the server runs on port 3001.
 * In production, replace with your deployed backend URL.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Product price IDs (required for Stripe subscriptions).
 *
 * These are created in your Stripe Dashboard → Products.
 * After creating products and prices in Stripe, update the IDs below.
 *
 * Format: price_XXXXXXX
 */
export const PRICE_IDS = {
  // One-time purchases
  bakuchiolSerum: import.meta.env.VITE_STRIPE_PRICE_SERUM || 'price_placeholder_serum',
  bakuchiolSerumRefill: import.meta.env.VITE_STRIPE_PRICE_REFILL || 'price_placeholder_refill',
  filteredShowerhead: import.meta.env.VITE_STRIPE_PRICE_SHOWER || 'price_placeholder_shower',
  showerFilterReplacement: import.meta.env.VITE_STRIPE_PRICE_FILTER || 'price_placeholder_filter',
  japandiLamp: import.meta.env.VITE_STRIPE_PRICE_LAMP || 'price_placeholder_lamp',

  // Subscriptions (recurring prices)
  serumSubscription: import.meta.env.VITE_STRIPE_PRICE_SERUM_SUB || 'price_placeholder_serum_sub',
  filterSubscription: import.meta.env.VITE_STRIPE_PRICE_FILTER_SUB || 'price_placeholder_filter_sub',
};

/**
 * Product catalog for frontend display and checkout links.
 */
export const PRODUCTS = {
  'bakuchiol-serum': {
    id: 'bakuchiol-serum',
    name: 'Bakuchiol Serum',
    price: 22.00,
    description: '30ml plant-based bakuchiol serum — glass bottle with dropper',
    image: null,
    stripePriceId: PRICE_IDS.bakuchiolSerum,
    type: 'one-time',
  },
  'bakuchiol-serum-refill': {
    id: 'bakuchiol-serum-refill',
    name: 'Bakuchiol Serum Refill',
    price: 18.00,
    description: '30ml aluminum refill tube — same premium serum',
    image: null,
    stripePriceId: PRICE_IDS.bakuchiolSerumRefill,
    type: 'one-time',
  },
  'filtered-showerhead': {
    id: 'filtered-showerhead',
    name: 'Filtered Showerhead',
    price: 49.00,
    description: 'Multi-stage filtered showerhead with 1 filter cartridge',
    image: null,
    stripePriceId: PRICE_IDS.filteredShowerhead,
    type: 'one-time',
  },
  'shower-filter-replacement': {
    id: 'shower-filter-replacement',
    name: 'Filter Replacement Cartridge',
    price: 28.00,
    description: 'Vitamin C + mineral bead filter — 90-day lifespan',
    image: null,
    stripePriceId: PRICE_IDS.showerFilterReplacement,
    type: 'one-time',
  },
  'japandi-lamp': {
    id: 'japandi-lamp',
    name: 'Japandi Table Lamp',
    price: 65.00,
    description: 'Solid wood base with pleated rice paper shade',
    image: null,
    stripePriceId: PRICE_IDS.japandiLamp,
    type: 'one-time',
  },
};

export const SUBSCRIPTION_PLANS = {
  'serum-sub': {
    id: 'serum-sub',
    name: 'Bakuchiol Serum — Monthly Refill',
    price: 18.00,
    description: 'Automatic refill every 30-60 days (flexible)',
    stripePriceId: PRICE_IDS.serumSubscription,
  },
  'shower-sub': {
    id: 'shower-sub',
    name: 'Filter Replacements — Quarterly',
    price: 22.00,
    description: 'Automatic filter every 90 days',
    stripePriceId: PRICE_IDS.filterSubscription,
  },
};