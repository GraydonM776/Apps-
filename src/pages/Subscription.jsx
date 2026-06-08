import React from 'react';
import { Link } from 'react-router-dom';

const subscriptionPlans = [
  {
    id: 'serum-sub',
    name: 'Bakuchiol Serum',
    description: 'Never run out of your favorite serum. Receive a refill every 30 or 60 days.',
    oneTimePrice: '$22.00',
    subPrice: '$18.00',
    discount: 'Save 18%',
    frequency: 'Every 30-60 days',
    features: [
      'Flexible delivery schedule',
      'Pause or cancel anytime',
      'Free mystery sample every 4th order',
      'Recyclable aluminum refill packaging',
    ],
    color: 'bg-sage/10',
    borderColor: 'border-sage/30',
  },
  {
    id: 'shower-sub',
    name: 'Filter Replacements',
    description: 'Quarterly filter replacements delivered automatically so you never forget.',
    oneTimePrice: '$28.00',
    subPrice: '$22.00',
    discount: 'Save 21%',
    frequency: 'Every 90 days',
    features: [
      'Automatic quarterly delivery',
      'SMS reminder before each shipment',
      'Reply SKIP to delay anytime',
      'Includes "Filter Change" tracker sticker',
    ],
    color: 'bg-oat/20',
    borderColor: 'border-oat/30',
  },
];

const vipTiers = [
  {
    tier: 'New Subscriber',
    benefits: ['18-21% discount on subscriptions', 'Flexible scheduling'],
  },
  {
    tier: 'L2 — 6+ Months',
    benefits: ['Free shipping on all orders', 'Early access to new products', 'VIP support'],
  },
];

export default function Subscription() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-sage/10 to-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white shadow-sm text-sage text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            <span className="w-2 h-2 rounded-full bg-sage" />
            Subscribe & Save
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-navy mb-4">
            Never run out. Always save.
          </h1>
          <p className="text-charcoal/60 text-lg max-w-2xl mx-auto">
            Set up automatic deliveries for the products you use most. Save up to 21%,
            and skip, pause, or cancel anytime — no strings attached.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-xl border-2 ${plan.borderColor} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className={`${plan.color} p-6 text-center border-b border-gray-100`}>
                  <h3 className="font-serif text-2xl text-navy mb-2">{plan.name}</h3>
                  <p className="text-charcoal/60 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-3xl font-sans font-bold text-navy">
                      {plan.subPrice}
                    </span>
                    <span className="text-sm text-charcoal/40 line-through">
                      {plan.oneTimePrice}
                    </span>
                  </div>
                  <span className="inline-block bg-sage/10 text-sage text-xs font-semibold px-3 py-1 rounded-full">
                    {plan.discount}
                  </span>
                  <p className="text-xs text-charcoal/50 mt-3">{plan.frequency}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="text-sm text-charcoal/70 flex items-start gap-2">
                        <span className="text-sage mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/checkout?subscription=${plan.id}`}
                    className="btn-sage w-full text-center block"
                  >
                    Subscribe Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading">How Subscriptions Work</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-sage text-white flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="font-sans font-semibold text-navy mb-2">Choose Your Plan</h3>
              <p className="text-sm text-charcoal/60">
                Pick the product and delivery frequency that works for you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-sage text-white flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="font-sans font-semibold text-navy mb-2">We Deliver</h3>
              <p className="text-sm text-charcoal/60">
                Your order ships on schedule. You get a reminder before each delivery.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-sage text-white flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="font-sans font-semibold text-navy mb-2">Stay in Control</h3>
              <p className="text-sm text-charcoal/60">
                Skip, delay, or cancel anytime from your account or by replying to an SMS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Tiers */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading">VIP Rewards</h2>
            <p className="section-subheading">
              The longer you subscribe, the more you save.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {vipTiers.map((tier) => (
              <div key={tier.tier} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-sans font-semibold text-navy text-lg mb-3">{tier.tier}</h3>
                <ul className="space-y-2">
                  {tier.benefits.map((b, i) => (
                    <li key={i} className="text-sm text-charcoal/70 flex items-start gap-2">
                      <span className="text-sage">✦</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}