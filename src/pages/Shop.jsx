import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const allProducts = [
  {
    id: 'bakuchiol-serum',
    name: 'Bakuchiol Serum',
    tagline: 'Plant-powered. Skin-renewing.',
    description: 'A gentle, plant-based alternative to retinol. Reduces fine lines and evens skin tone without irritation. Perfect for sensitive skin.',
    features: [
      '30ml amber glass bottle with dropper',
      'Plant-based bakuchiol (no retinol)',
      'Vegan & cruelty-free',
      'Suitable for all skin types',
    ],
    price: 22.00,
    subPrice: 18.00,
    category: 'Personal Care',
    badge: 'Best Seller',
    color: 'bg-sage/10',
  },
  {
    id: 'bakuchiol-serum-refill',
    name: 'Bakuchiol Serum Refill',
    tagline: 'Sustainable. Smart. Savings.',
    description: 'Lightweight aluminum refill tube for your glass bottle. Same premium serum, less waste and lower cost.',
    features: [
      'Recyclable aluminum tube',
      '30ml — same quantity as bottle',
      '18% savings vs one-time purchase',
      'Sage green limited edition',
    ],
    price: 18.00,
    category: 'Personal Care',
    badge: 'Refill',
    color: 'bg-sage/10',
  },
  {
    id: 'filtered-showerhead',
    name: 'Filtered Showerhead',
    tagline: 'Your skin deserves clean water.',
    description: 'Transform your daily shower into a spa ritual. Multi-stage filtration removes chlorine, heavy metals, and impurities for healthier skin and hair.',
    features: [
      'Multi-stage filtration (Vitamin C + activated carbon)',
      'Matte white finish, transparent handle',
      'Easy tool-free installation',
      'Includes 1 filter cartridge (90-day life)',
    ],
    price: 49.00,
    category: 'Home Goods',
    badge: 'New',
    color: 'bg-oat/20',
  },
  {
    id: 'shower-filter-replacement',
    name: 'Filter Replacement Cartridge',
    tagline: 'Keep the clean flowing.',
    description: 'Replace your shower filter every 90 days for optimal performance. Subscribe and save 21%.',
    features: [
      'Vitamin C + mineral bead filtration',
      '90-day lifespan per cartridge',
      'Easy pop-in replacement',
      'Subscribe for automatic delivery',
    ],
    price: 28.00,
    subPrice: 22.00,
    category: 'Home Goods',
    badge: 'Essential',
    color: 'bg-oat/20',
  },
  {
    id: 'japandi-lamp',
    name: 'Japandi Table Lamp',
    tagline: 'Calm. Light. Space.',
    description: 'Handcrafted from natural materials. Solid oak or ash base with a pleated off-white rice paper shade. Subtle branding etched into the wood.',
    features: [
      'Solid wood base (oak/ash)',
      'Pleated rice paper shade',
      'Warm ambient light',
      'Minimalist Japandi design',
    ],
    price: 65.00,
    category: 'Home Goods',
    badge: 'Limited',
    color: 'bg-navy/5',
  },
];

const categories = ['All', 'Personal Care', 'Home Goods'];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? allProducts
    : allProducts.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-b from-sage/5 to-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-navy mb-4">Shop</h1>
          <p className="text-charcoal/60 text-lg max-w-xl mx-auto">
            Premium essentials curated for your well-being — from skincare to home.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-charcoal/60 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                {/* Product image placeholder */}
                <div className={`aspect-[4/3] ${product.color} relative flex items-center justify-center`}>
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-white/90 text-navy text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  <div className="w-24 h-24 rounded-full bg-white/50 flex items-center justify-center">
                    <span className="text-4xl text-navy/30">◉</span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs text-sage font-semibold uppercase tracking-wider mb-1">
                    {product.category}
                  </p>
                  <h3 className="font-serif text-xl text-navy mb-1">{product.name}</h3>
                  <p className="text-sm text-sage font-medium mb-3">{product.tagline}</p>
                  <p className="text-charcoal/60 text-sm mb-4">{product.description}</p>

                  {/* Features */}
                  <ul className="space-y-1.5 mb-6">
                    {product.features.map((f, i) => (
                      <li key={i} className="text-xs text-charcoal/50 flex items-start gap-2">
                        <span className="text-sage mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="font-sans font-semibold text-xl text-navy">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.subPrice && (
                        <span className="block text-xs text-charcoal/50">
                          Subscribe: ${product.subPrice.toFixed(2)}/mo
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/checkout?product=${product.id}`}
                      className="btn-primary text-sm !px-4 !py-2"
                    >
                      Add to Cart
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}