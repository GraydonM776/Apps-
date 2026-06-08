import React from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 'bakuchiol-serum',
    name: 'Bakuchiol Serum',
    tagline: 'Plant-powered. Skin-renewing.',
    description: 'A gentle, plant-based alternative to retinol. Reduces fine lines and evens skin tone without irritation.',
    price: '$22.00',
    subPrice: '$18.00/mo',
    image: null,
    color: 'bg-sage/10',
    accent: 'sage',
  },
  {
    id: 'filtered-showerhead',
    name: 'Filtered Showerhead',
    tagline: 'Your skin deserves clean water.',
    description: 'Transform your daily shower into a spa ritual. Removes chlorine, heavy metals, and impurities.',
    price: '$49.00',
    subPrice: '$22.00/quarter',
    image: null,
    color: 'bg-oat/20',
    accent: 'oat',
  },
  {
    id: 'japandi-lamp',
    name: 'Japandi Table Lamp',
    tagline: 'Calm. Light. Space.',
    description: 'Minimalist design meets natural materials. Solid wood base with pleated rice paper shade.',
    price: '$65.00',
    image: null,
    color: 'bg-navy/5',
    accent: 'navy',
  },
];

const benefits = [
  {
    title: 'Premium Quality',
    description: 'We partner with top manufacturers to bring you products that rival luxury brands.',
    icon: '✦',
  },
  {
    title: 'Fair Pricing',
    description: 'No inflated markups. We believe quality wellness should be accessible to everyone.',
    icon: '♢',
  },
  {
    title: 'Sustainably Made',
    description: 'Minimal packaging, recyclable materials, and refill options to reduce waste.',
    icon: '♻',
  },
  {
    title: 'Subscribe & Save',
    description: 'Set it and forget it. Save up to 21% on recurring orders with flexible scheduling.',
    icon: '◈',
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-sage/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-sage/10 text-sage text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-sage" />
              Accessible Wellness
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-navy leading-tight mb-6">
              Quality you can feel.
              <br />
              <span className="text-sage">Price you can love.</span>
            </h1>
            <p className="text-lg md:text-xl text-charcoal/60 max-w-xl mx-auto mb-10">
              Premium wellness products — from clean beauty to home essentials — designed for
              real life and real budgets.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/shop" className="btn-primary text-base">
                Shop Collection
              </Link>
              <Link to="/subscriptions" className="btn-secondary text-base">
                Subscribe & Save
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Brand Promise */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">Why Live well?</h2>
            <p className="section-subheading">
              We believe that living well should never be a luxury. Every product we make is
              built on three principles.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="text-3xl mb-4 text-sage">{benefit.icon}</div>
                <h3 className="font-sans font-semibold text-navy text-lg mb-2">{benefit.title}</h3>
                <p className="text-charcoal/60 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-sage/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-heading">Our Collection</h2>
            <p className="section-subheading">
              Curated essentials that elevate your daily rituals — without the premium price tag.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Product image placeholder */}
                <div className={`aspect-square ${product.color} flex items-center justify-center p-12`}>
                  <div className="w-full h-full rounded-full bg-white/60 flex items-center justify-center">
                    <div className={`w-16 h-16 rounded-full bg-${product.accent}/20 flex items-center justify-center`}>
                      <span className={`text-3xl text-${product.accent}`}>◉</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif text-xl text-navy mb-1">{product.name}</h3>
                  <p className="text-sm text-sage font-medium mb-2">{product.tagline}</p>
                  <p className="text-charcoal/60 text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-sans font-semibold text-lg text-navy">{product.price}</span>
                      {product.subPrice && (
                        <span className="text-xs text-charcoal/50 block">{product.subPrice}</span>
                      )}
                    </div>
                    <Link
                      to={`/checkout?product=${product.id}`}
                      className="btn-primary text-sm !px-4 !py-2"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop" className="btn-secondary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Subscribe & Save CTA */}
      <section className="py-16 md:py-24 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
            Never run out of what you love
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto mb-8">
            Subscribe to your essentials and save up to 21%. Skip, pause, or cancel anytime —
            no commitment, just convenience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
            <div className="bg-white/10 rounded-lg p-4 text-left">
              <p className="font-semibold text-sage">Bakuchiol Serum</p>
              <p className="text-white/60 text-sm">$18.00/mo (save 18%)</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-left">
              <p className="font-semibold text-sage">Filter Replacements</p>
              <p className="text-white/60 text-sm">$22.00/quarter (save 21%)</p>
            </div>
          </div>
          <Link to="/subscriptions" className="btn-sage text-base inline-block">
            Start Your Subscription
          </Link>
        </div>
      </section>

      {/* About / Mission */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-heading">Our Mission</h2>
            <p className="text-charcoal/60 text-lg leading-relaxed mb-8">
              At <strong className="text-navy">Live well</strong>, we believe that everyone deserves
              access to high-quality products that make life better — from clear skin to clean water
              to a calm home. We work directly with ethical manufacturers to cut out the middleman,
              so we can offer exceptional products at honest prices.
            </p>
            <div className="grid grid-cols-3 gap-8 max-w-sm mx-auto">
              <div>
                <p className="text-3xl font-serif text-sage font-bold">3</p>
                <p className="text-xs text-charcoal/50 mt-1">Products</p>
              </div>
              <div>
                <p className="text-3xl font-serif text-sage font-bold">100%</p>
                <p className="text-xs text-charcoal/50 mt-1">Recyclable Packaging</p>
              </div>
              <div>
                <p className="text-3xl font-serif text-sage font-bold">21%</p>
                <p className="text-xs text-charcoal/50 mt-1">Max Subscriber Savings</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}