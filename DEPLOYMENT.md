# Live well — Deployment Guide

This guide explains how to deploy the Live well website to production.

---

## 1. Architecture Overview

```
Frontend (Vercel)         Backend (Render/Railway)
   │                            │
   │  Stripe Publishable Key    │  Stripe Secret Key
   │  (pk_live_...)             │  (sk_live_...)
   │                            │
   └────── API calls ──────────>│
        /api/create-payment-intent
        /api/create-setup-intent
                                │
                                └────── Stripe API ──────> Stripe
```

- **Frontend**: Static site (Vite build) → deploy to **Vercel** (free)
- **Backend**: Node.js/Express server → deploy to **Render** or **Railway** (free tier available)
- **Both** need Stripe keys from Stripe Dashboard

---

## 2. Deploy the Frontend (Vercel)

### Prerequisites
- [Vercel account](https://vercel.com/signup) (free, sign in with GitHub)

### Steps

1. **Push code to GitHub** (already done in previous step)

2. **Go to [vercel.com/new](https://vercel.com/new)** and import the repo

3. **Configure settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

4. **Add Environment Variables** in Vercel dashboard → Settings → Environment Variables:

   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY
   VITE_API_URL=https://your-backend-url.com
   VITE_STRIPE_PRICE_SERUM=price_xxx
   VITE_STRIPE_PRICE_SERUM_SUB=price_xxx
   VITE_STRIPE_PRICE_REFILL=price_xxx
   VITE_STRIPE_PRICE_SHOWER=price_xxx
   VITE_STRIPE_PRICE_FILTER=price_xxx
   VITE_STRIPE_PRICE_FILTER_SUB=price_xxx
   VITE_STRIPE_PRICE_LAMP=price_xxx
   ```

5. **Deploy** — Vercel will auto-deploy on every git push.

---

## 3. Deploy the Backend (Render)

### Prerequisites
- [Render account](https://render.com/register) (free)
- GitHub repo connected

### Steps

1. **In Render Dashboard** → **New** → **Web Service**

2. **Connect your repo** → Select the same repo

3. **Configure**:
   - **Name**: `live-well-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Plan**: Free

4. **Add Environment Variables** in Render dashboard → Environment:

   ```
   STRIPE_SECRET_KEY=sk_live_YOUR_KEY
   STRIPE_WEBHOOK_SECRET=whsec_xxx  (optional, for webhooks)
   PORT=3001
   CLIENT_ORIGIN=https://your-vercel-app.vercel.app
   VITE_STRIPE_PRICE_SERUM=price_xxx
   VITE_STRIPE_PRICE_SERUM_SUB=price_xxx
   VITE_STRIPE_PRICE_REFILL=price_xxx
   VITE_STRIPE_PRICE_SHOWER=price_xxx
   VITE_STRIPE_PRICE_FILTER=price_xxx
   VITE_STRIPE_PRICE_FILTER_SUB=price_xxx
   VITE_STRIPE_PRICE_LAMP=price_xxx
   ```

5. **Deploy** → Render will build and start.

6. **Update frontend env**: Set `VITE_API_URL` to your Render URL (e.g., `https://live-well-api.onrender.com`).

---

## 4. Stripe Webhook Setup (Optional but Recommended)

1. In **Stripe Dashboard** → **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL**: `https://your-render-app.onrender.com/api/stripe-webhook`
3. **Events to listen to**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `setup_intent.succeeded`
   - `setup_intent.setup_failed`
   - `customer.subscription.created`
   - `invoice.payment_succeeded`
4. **Copy the Webhook Secret** (`whsec_...`) and add it as `STRIPE_WEBHOOK_SECRET` in your Render env vars.

---

## 5. Stripe Automation Script

After deploying, run the automation script to create all products and prices in your Stripe account:

```bash
cd server
cp .env.example .env
# Edit .env and add your real STRIPE_SECRET_KEY
node scripts/automate-stripe.js
```

This creates all 5 products with their prices and prints the Price IDs you need for your environment variables.

---

## 6. Custom Domain

### Vercel (Frontend)
- Go to your Vercel project → **Settings** → **Domains**
- Add your custom domain (e.g., `livewell.com`)
- Update your DNS with Vercel's nameservers

### Render (Backend)
- Go to your Render service → **Settings** → **Custom Domain**
- Add your API subdomain (e.g., `api.livewell.com`)

### Stripe Webhook
- Update the webhook URL to use your custom domain

---

## 7. Important Security Notes

⚠️ **Never commit `.env` files** to version control. All secrets go in the hosting platform's environment variable settings.

⚠️ **Environment variable naming**:
- Frontend (Vite): `VITE_*` prefix (exposed to browser)
- Backend (Node): No prefix (server-side only)

⚠️ **CORS**: Ensure `CLIENT_ORIGIN` in the backend matches your exact frontend URL.

---

## 8. Testing After Deployment

1. Visit your deployed frontend URL
2. Add a product to cart and go through checkout
3. Use Stripe test card: `4242 4242 4242 4242` (exp: any future date, CVC: any 3 digits)
4. Verify you see "Order Placed!" success message
5. Check Stripe Dashboard → Payments for the successful payment

---

## 9. Going Live

1. Switch Stripe keys from `sk_test_*` / `pk_test_*` to `sk_live_*` / `pk_live_*`
2. Re-run `node scripts/automate-stripe.js` to create live-mode prices
3. Update env vars with live Price IDs
4. Redeploy both frontend and backend
5. Do a test purchase with a real card (or your own)
