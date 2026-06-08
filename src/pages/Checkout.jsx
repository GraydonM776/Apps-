import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { STRIPE_PUBLISHABLE_KEY, API_BASE_URL, PRODUCTS, SUBSCRIPTION_PLANS } from '../stripeConfig';

// Initialize Stripe
let stripePromise;
try {
  stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
} catch (e) {
  console.warn('Stripe init failed — using placeholder key. Set VITE_STRIPE_PUBLISHABLE_KEY.');
}

function CheckoutForm({ product, subscription }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const item = product || subscription;
  const isSubscription = !!subscription;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      // ── Step 1: Call backend to create PaymentIntent or SetupIntent ──
      let endpoint;
      let body;

      if (isSubscription) {
        endpoint = `${API_BASE_URL}/api/create-setup-intent`;
        body = { subscriptionId: item.id };
      } else {
        endpoint = `${API_BASE_URL}/api/create-payment-intent`;
        body = { productId: item.id, quantity: 1 };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      // ── Step 2: Handle demo mode (backend has placeholder keys) ──
      if (data.demo) {
        setDemoMode(true);
        // Simulate a short delay then show success
        await new Promise((r) => setTimeout(r, 1200));
        setSuccess(true);
        setLoading(false);
        return;
      }

      // ── Step 3: Confirm the payment/setup with Stripe.js ──
      const { error: confirmError } = isSubscription
        ? await stripe.confirmCardSetup(data.clientSecret, {
            payment_method: { card: cardElement },
          })
        : await stripe.confirmCardPayment(data.clientSecret, {
            payment_method: { card: cardElement },
          });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      setSuccess(true);

      // ── Step 4: For subscriptions, notify backend to create the subscription ──
      if (isSubscription) {
        try {
          // In a full implementation, the SetupIntent success webhook
          // would create the subscription server-side. For now we log it.
          console.log('SetupIntent confirmed — subscription will be created via webhook.');
        } catch (subErr) {
          console.warn('Subscription creation note:', subErr);
        }
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl text-sage">✓</span>
        </div>
        <h2 className="font-serif text-2xl text-navy mb-2">
          {isSubscription ? 'Subscription Confirmed!' : 'Order Placed!'}
        </h2>
        <p className="text-charcoal/60 mb-2">
          {isSubscription
            ? 'Welcome to Live well. Your first delivery is on its way.'
            : 'Thank you for your order. You will receive a confirmation email shortly.'}
        </p>
        {demoMode && (
          <div className="bg-oat/20 border border-oat/30 text-charcoal text-sm rounded-md p-3 mb-4 max-w-sm mx-auto">
            <strong>🔧 Demo Mode:</strong> This was a simulated order. To process real payments,
            set your Stripe keys in the backend <code className="bg-white px-1 rounded text-xs">.env</code> file
            and restart the server.
          </div>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
          <Link to="/" className="btn-secondary">
            Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="font-sans font-semibold text-navy mb-4">Order Summary</h3>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="font-medium text-navy">{item.name}</p>
            <p className="text-xs text-charcoal/50">{item.description}</p>
            {isSubscription && (
              <span className="inline-block mt-1 bg-sage/10 text-sage text-xs font-medium px-2 py-0.5 rounded">
                Recurring subscription
              </span>
            )}
          </div>
          <span className="font-semibold text-navy">${item.price.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
          <span className="font-sans font-semibold text-navy">Total</span>
          <span className="font-sans font-bold text-xl text-navy">
            ${item.price.toFixed(2)}
            {isSubscription && (
              <span className="text-xs text-charcoal/50 font-normal">
                /{subscription?.id === 'shower-sub' ? 'quarter' : 'mo'}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="font-sans font-semibold text-navy mb-4">Payment Details</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-charcoal mb-2">Card Information</label>
          <div className="border border-gray-300 rounded-md p-3 focus-within:border-navy transition-colors">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#333333',
                    fontFamily: 'Montserrat, sans-serif',
                    '::placeholder': { color: '#999999' },
                  },
                },
              }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3 mb-4">
            {error}
          </div>
        )}

        {!stripe && STRIPE_PUBLISHABLE_KEY.includes('placeholder') && (
          <div className="bg-oat/20 border border-oat/30 text-charcoal text-sm rounded-md p-3 mb-4">
            <strong>🔧 Demo Mode:</strong> Stripe publishable key not configured. Set{' '}
            <code className="bg-white px-1 rounded text-xs">VITE_STRIPE_PUBLISHABLE_KEY</code> and
            run the backend server to process real payments.
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !stripe}
          className={`btn-primary w-full text-center ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading
            ? 'Processing...'
            : isSubscription
              ? `Subscribe — $${item.price.toFixed(2)}/${subscription?.id === 'shower-sub' ? 'quarter' : 'mo'}`
              : `Pay $${item.price.toFixed(2)}`}
        </button>

        <p className="text-xs text-charcoal/40 text-center mt-4">
          Your payment is securely processed by Stripe. We never store your card details.
        </p>
      </div>
    </form>
  );
}

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  const subscriptionId = searchParams.get('subscription');

  const product = productId ? PRODUCTS[productId] : null;
  const subscription = subscriptionId ? SUBSCRIPTION_PLANS[subscriptionId] : null;

  const item = product || subscription;

  return (
    <section className="bg-gradient-to-b from-sage/5 to-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl text-navy mb-2">
            {subscription ? 'Start Your Subscription' : 'Checkout'}
          </h1>
          <p className="text-charcoal/60 text-sm mb-8">
            {subscription
              ? 'Set up your recurring delivery below.'
              : 'Complete your purchase securely.'}
          </p>

          {!item ? (
            <div className="text-center py-12">
              <p className="text-charcoal/60 mb-4">No product selected.</p>
              <Link to="/shop" className="btn-primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <Elements stripe={stripePromise}>
              <CheckoutForm product={product} subscription={subscription} />
            </Elements>
          )}
        </div>
      </div>
    </section>
  );
}