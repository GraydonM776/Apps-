import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

// ─── Configuration ──────────────────────────────────────────────
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = process.env.PORT || 3001;

// CORS — allow the frontend origin
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim());

app.use(cors({ origin: allowedOrigins, credentials: true }));

// Stripe webhook route must come BEFORE the global json parser
// because Stripe expects the raw body for signature verification
app.post(
  '/api/stripe-webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret || webhookSecret.includes('placeholder')) {
      // In dev mode without a webhook secret, just acknowledge
      console.log('⚠️  Webhook received but no whsec configured. Acknowledging.');
      return res.json({ received: true });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('⚠️  Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log(`✅ PaymentIntent ${paymentIntent.id} succeeded — $${(paymentIntent.amount / 100).toFixed(2)}`);
        // TODO: Update order status in your database
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.error(`❌ PaymentIntent ${paymentIntent.id} failed:`, paymentIntent.last_payment_error?.message);
        break;
      }
      case 'setup_intent.succeeded': {
        const setupIntent = event.data.object;
        console.log(`✅ SetupIntent ${setupIntent.id} succeeded — payment method saved`);
        // TODO: Create a subscription in Stripe Billing using the payment method
        break;
      }
      case 'setup_intent.setup_failed': {
        const setupIntent = event.data.object;
        console.error(`❌ SetupIntent ${setupIntent.id} failed`);
        break;
      }
      case 'customer.subscription.created': {
        const subscription = event.data.object;
        console.log(`✅ Subscription ${subscription.id} created for customer ${subscription.customer}`);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log(`💰 Invoice ${invoice.id} paid — ${invoice.amount_paid / 100} ${invoice.currency}`);
        break;
      }
      default:
        console.log(`ℹ️  Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

// ─── Global middleware ──────────────────────────────────────────
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────────

/**
 * Health check
 */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    mode: process.env.STRIPE_SECRET_KEY?.includes('placeholder')
      ? 'demo'
      : 'live',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Price catalog — mirrors the frontend config so the backend
 * is the single source of truth for price IDs
 */
app.get('/api/prices', (_req, res) => {
  res.json({
    products: {
      'bakuchiol-serum': {
        name: 'Bakuchiol Serum',
        price: 2200, // cents
        stripePriceId: process.env.VITE_STRIPE_PRICE_SERUM || 'price_placeholder_serum',
      },
      'bakuchiol-serum-refill': {
        name: 'Bakuchiol Serum Refill',
        price: 1800,
        stripePriceId: process.env.VITE_STRIPE_PRICE_REFILL || 'price_placeholder_refill',
      },
      'filtered-showerhead': {
        name: 'Filtered Showerhead',
        price: 4900,
        stripePriceId: process.env.VITE_STRIPE_PRICE_SHOWER || 'price_placeholder_shower',
      },
      'shower-filter-replacement': {
        name: 'Filter Replacement Cartridge',
        price: 2800,
        stripePriceId: process.env.VITE_STRIPE_PRICE_FILTER || 'price_placeholder_filter',
      },
      'japandi-lamp': {
        name: 'Japandi Table Lamp',
        price: 6500,
        stripePriceId: process.env.VITE_STRIPE_PRICE_LAMP || 'price_placeholder_lamp',
      },
    },
    subscriptions: {
      'serum-sub': {
        name: 'Bakuchiol Serum — Monthly Refill',
        price: 1800,
        stripePriceId: process.env.VITE_STRIPE_PRICE_SERUM_SUB || 'price_placeholder_serum_sub',
      },
      'shower-sub': {
        name: 'Filter Replacements — Quarterly',
        price: 2200,
        stripePriceId: process.env.VITE_STRIPE_PRICE_FILTER_SUB || 'price_placeholder_filter_sub',
      },
    },
  });
});

/**
 * Create a PaymentIntent for one-time purchases
 *
 * POST /api/create-payment-intent
 * Body: { productId: string, quantity?: number }
 */
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }

    // Look up the product configuration from environment variables
    const priceEnvMap = {
      'bakuchiol-serum': 'VITE_STRIPE_PRICE_SERUM',
      'bakuchiol-serum-refill': 'VITE_STRIPE_PRICE_REFILL',
      'filtered-showerhead': 'VITE_STRIPE_PRICE_SHOWER',
      'shower-filter-replacement': 'VITE_STRIPE_PRICE_FILTER',
      'jandi-lamp': 'VITE_STRIPE_PRICE_LAMP',
    };

    const priceId = process.env[priceEnvMap[productId]];
    const amountMap = {
      'bakuchiol-serum': 2200,
      'bakuchiol-serum-refill': 1800,
      'filtered-showerhead': 4900,
      'shower-filter-replacement': 2800,
      'jandi-lamp': 6500,
    };
    const amount = (amountMap[productId] || 0) * quantity;

    if (!amount) {
      return res.status(400).json({ error: `Unknown product: ${productId}` });
    }

    // If we have a real Stripe price ID, create via price.
    // Otherwise fall back to creating with raw amount (useful for testing without Stripe products).
    let paymentIntent;
    if (priceId && !priceId.includes('placeholder')) {
      paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        metadata: { productId, quantity: String(quantity) },
      });
    } else {
      // Demo mode — return a simulated response
      console.log(`ℹ️  Demo mode: would create PaymentIntent for ${productId} ($${(amount / 100).toFixed(2)})`);
      return res.json({
        clientSecret: null,
        demo: true,
        message: 'Demo mode — set STRIPE_SECRET_KEY and price env vars to process live payments.',
        productId,
        amount,
        amountFormatted: `$${(amount / 100).toFixed(2)}`,
      });
    }

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Error creating PaymentIntent:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Create a SetupIntent for saving a payment method (subscriptions)
 *
 * POST /api/create-setup-intent
 * Body: { subscriptionId: string }
 */
app.post('/api/create-setup-intent', async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'subscriptionId is required' });
    }

    // If we have a real Stripe key, create a SetupIntent
    if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
      const setupIntent = await stripe.setupIntents.create({
        automatic_payment_methods: { enabled: true },
        metadata: { subscriptionId },
        usage: 'off_session',
      });

      return res.json({ clientSecret: setupIntent.client_secret });
    }

    // Demo mode
    console.log(`ℹ️  Demo mode: would create SetupIntent for ${subscriptionId}`);
    res.json({
      clientSecret: null,
      demo: true,
      message: 'Demo mode — set STRIPE_SECRET_KEY to process live subscriptions.',
      subscriptionId,
    });
  } catch (err) {
    console.error('Error creating SetupIntent:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Create a subscription after a SetupIntent succeeds
 *
 * POST /api/create-subscription
 * Body: { customerId: string, paymentMethodId: string, priceId: string }
 */
app.post('/api/create-subscription', async (req, res) => {
  try {
    const { customerId, paymentMethodId, priceId } = req.body;

    if (!customerId || !paymentMethodId || !priceId) {
      return res.status(400).json({
        error: 'customerId, paymentMethodId, and priceId are required',
      });
    }

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // Create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      status: subscription.status,
    });
  } catch (err) {
    console.error('Error creating subscription:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── Start server ───────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  const sk = process.env.STRIPE_SECRET_KEY;
  const mode = !sk || sk.includes('placeholder') ? '🔧 DEMO' : '✅ LIVE';
  console.log(`\n  🏪  Live well API server`);
  console.log(`  ${mode} mode`);
  console.log(`  🌍  http://0.0.0.0:${PORT}`);
  console.log(`  ❤️  /api/health\n`);
});
