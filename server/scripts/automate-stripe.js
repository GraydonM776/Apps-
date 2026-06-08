const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const products = [
  {
    id: 'bakuchiol-serum',
    name: 'Bakuchiol Serum',
    description: '30ml plant-based bakuchiol serum — glass bottle with dropper',
    amount: 2200,
    interval: null,
    envVar: 'VITE_STRIPE_PRICE_SERUM'
  },
  {
    id: 'bakuchiol-serum-refill',
    name: 'Bakuchiol Serum Refill',
    description: '30ml aluminum refill tube — same premium serum',
    amount: 1800,
    interval: null,
    envVar: 'VITE_STRIPE_PRICE_REFILL'
  },
  {
    id: 'filtered-showerhead',
    name: 'Filtered Showerhead',
    description: 'Multi-stage filtered showerhead with 1 filter cartridge',
    amount: 4900,
    interval: null,
    envVar: 'VITE_STRIPE_PRICE_SHOWER'
  },
  {
    id: 'shower-filter-replacement',
    name: 'Filter Replacement Cartridge',
    description: 'Vitamin C + mineral bead filter — 90-day lifespan',
    amount: 2800,
    interval: null,
    envVar: 'VITE_STRIPE_PRICE_FILTER'
  },
  {
    id: 'japandi-lamp',
    name: 'Japandi Table Lamp',
    description: 'Solid wood base with pleated rice paper shade',
    amount: 6500,
    interval: null,
    envVar: 'VITE_STRIPE_PRICE_LAMP'
  },
  {
    id: 'serum-sub',
    name: 'Bakuchiol Serum — Monthly Refill',
    description: 'Automatic refill every 30 days',
    amount: 1800,
    interval: 'month',
    envVar: 'VITE_STRIPE_PRICE_SERUM_SUB'
  },
  {
    id: 'shower-sub',
    name: 'Filter Replacements — Quarterly',
    description: 'Automatic filter every 3 months',
    amount: 2200,
    interval: 'month',
    interval_count: 3,
    envVar: 'VITE_STRIPE_PRICE_FILTER_SUB'
  }
];

async function init() {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
    console.error('❌ Error: STRIPE_SECRET_KEY not set in server/.env');
    process.exit(1);
  }

  console.log('🚀 Starting Stripe automation...');
  const results = {};

  for (const p of products) {
    try {
      console.log(`Creating product: ${p.name}...`);
      const product = await stripe.products.create({
        name: p.name,
        description: p.description,
        metadata: { internal_id: p.id }
      });

      const priceData = {
        unit_amount: p.amount,
        currency: 'usd',
        product: product.id,
      };

      if (p.interval) {
        priceData.recurring = {
          interval: p.interval,
          interval_count: p.interval_count || 1
        };
      }

      const price = await stripe.prices.create(priceData);
      results[p.envVar] = price.id;
      console.log(`✅ Created: ${price.id}`);
    } catch (err) {
      console.error(`❌ Failed to create ${p.name}:`, err.message);
    }
  }

  console.log('\n✨ Stripe Setup Complete!');
  console.log('---------------------------');
  for (const [key, value] of Object.entries(results)) {
    console.log(`${key}=${value}`);
  }
  console.log('---------------------------');
  console.log('Copy these values into your .env files (root and server).');
}

init();
