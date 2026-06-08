#!/usr/bin/env node

/**
 * Stripe Product & Price Automation Script
 * ===========================================
 *
 * Run this script ONCE after adding your real Stripe Secret Key to the .env file.
 * It will create all products and prices in your Stripe account automatically.
 *
 * Usage:
 *   1. Set STRIPE_SECRET_KEY in server/.env (sk_live_... or sk_test_...)
 *   2. cd server
 *   3. node scripts/automate-stripe.js
 *
 * The script prints the Price IDs which you should copy into:
 *   - Frontend: root .env (VITE_STRIPE_PRICE_* variables)
 *   - Backend:  server/.env (if you want the /api/prices endpoint to work)
 */

import 'dotenv/config';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ─── Product Definitions ────────────────────────────────────────
// Each product can have one or more prices (one-time and/or recurring).
const products = [
  {
    name: 'Bakuchiol Serum',
    description: '30ml plant-based bakuchiol serum — gentle anti-aging alternative to retinol. Glass bottle with dropper.',
    prices: [
      { nickname: 'One-time', currency: 'usd', unit_amount: 2200 },          // $22.00
      { nickname: 'Monthly Refill', currency: 'usd', unit_amount: 1800, recurring: { interval: 'month' } },  // $18.00/mo
    ],
  },
  {
    name: 'Bakuchiol Serum Refill',
    description: '30ml aluminum refill tube — same premium serum, less packaging waste.',
    prices: [
      { nickname: 'One-time', currency: 'usd', unit_amount: 1800 },          // $18.00
    ],
  },
  {
    name: 'Filtered Showerhead',
    description: 'Multi-stage filtered showerhead with Vitamin C + activated carbon. Includes 1 filter. Matte white finish.',
    prices: [
      { nickname: 'One-time', currency: 'usd', unit_amount: 4900 },          // $49.00
    ],
  },
  {
    name: 'Filter Replacement Cartridge',
    description: 'Vitamin C + mineral bead filter cartridge. 90-day lifespan. Easy pop-in replacement.',
    prices: [
      { nickname: 'One-time', currency: 'usd', unit_amount: 2800 },          // $28.00
      { nickname: 'Quarterly Subscription', currency: 'usd', unit_amount: 2200, recurring: { interval: 'month', interval_count: 3 } },  // $22.00/quarter
    ],
  },
  {
    name: 'Japandi Table Lamp',
    description: 'Solid oak/ash base with pleated off-white rice paper shade. Warm ambient light. Minimalist Japandi design.',
    prices: [
      { nickname: 'One-time', currency: 'usd', unit_amount: 6500 },          // $65.00
    ],
  },
];

// ─── Env variable name mapping ──────────────────────────────────
const envVarMap = {
  'Bakuchiol Serum_One-time': 'VITE_STRIPE_PRICE_SERUM',
  'Bakuchiol Serum_Monthly Refill': 'VITE_STRIPE_PRICE_SERUM_SUB',
  'Bakuchiol Serum Refill_One-time': 'VITE_STRIPE_PRICE_REFILL',
  'Filtered Showerhead_One-time': 'VITE_STRIPE_PRICE_SHOWER',
  'Filter Replacement Cartridge_One-time': 'VITE_STRIPE_PRICE_FILTER',
  'Filter Replacement Cartridge_Quarterly Subscription': 'VITE_STRIPE_PRICE_FILTER_SUB',
  'Japandi Table Lamp_One-time': 'VITE_STRIPE_PRICE_LAMP',
};

// ─── Main ───────────────────────────────────────────────────────
async function run() {
  console.log('\n🚀  Live well — Stripe Product Automation\n');

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
    console.error('❌  ERROR: Set a real STRIPE_SECRET_KEY in server/.env first.');
    console.error('   Get one at: https://dashboard.stripe.com/apikeys\n');
    process.exit(1);
  }

  const mode = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_') ? '🔧 TEST MODE' : '✅ LIVE MODE';
  console.log(`   Mode: ${mode}\n`);

  const results = {};

  for (const productDef of products) {
    console.log(`   Creating product: ${productDef.name}...`);

    // Create the product
    const product = await stripe.products.create({
      name: productDef.name,
      description: productDef.description,
      metadata: { source: 'live-well-automation' },
    });

    console.log(`   ✅  Product created: ${product.id}`);

    // Create prices for this product
    for (const priceDef of productDef.prices) {
      const price = await stripe.prices.create({
        product: product.id,
        currency: priceDef.currency,
        unit_amount: priceDef.unit_amount,
        nickname: priceDef.nickname,
        recurring: priceDef.recurring || undefined,
      });

      const key = `${productDef.name}_${priceDef.nickname}`;
      results[key] = price.id;

      const typeLabel = priceDef.recurring ? `🔄 ${priceDef.recurring.interval}ly` : '💳 One-time';
      console.log(`   ${typeLabel} price: ${price.id} ($${(priceDef.unit_amount / 100).toFixed(2)})`);
    }
    console.log('');
  }

  // ─── Output ──────────────────────────────────────────────────
  console.log('═'.repeat(60));
  console.log('✅  All products and prices created successfully!\n');
  console.log('📋  Copy these values into your .env files:\n');

  for (const [key, priceId] of Object.entries(results)) {
    const envVar = envVarMap[key];
    if (envVar) {
      console.log(`   ${envVar}=${priceId}`);
    }
  }

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  IMPORTANT: Set VITE_STRIPE_PUBLISHABLE_KEY in root     ║');
  console.log('║  .env to match your Stripe account mode (test/live).    ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
}

run().catch((err) => {
  console.error('\n❌  Automation failed:', err.message, '\n');
  process.exit(1);
});