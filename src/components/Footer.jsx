import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <span className="text-navy text-xs font-bold">LW</span>
              </div>
              <span className="font-sans font-semibold text-white text-lg tracking-tight">
                live <span className="text-sage">well</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm max-w-sm">
              Bringing quality and affordability together. Premium wellness products designed
              for everyone, not just the few.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans font-semibold text-sm mb-4 text-white/80 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-white/60 text-sm hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-white/60 text-sm hover:text-white transition-colors">
                  Bakuchiol Serum
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-white/60 text-sm hover:text-white transition-colors">
                  Filtered Showerhead
                </Link>
              </li>
              <li>
                <Link to="/subscriptions" className="text-white/60 text-sm hover:text-white transition-colors">
                  Subscriptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-sans font-semibold text-sm mb-4 text-white/80 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="text-white/60 text-sm">Shipping & Returns</span>
              </li>
              <li>
                <span className="text-white/60 text-sm">FAQ</span>
              </li>
              <li>
                <span className="text-white/60 text-sm">Contact Us</span>
              </li>
              <li>
                <span className="text-white/60 text-sm">Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Live well. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-white/40 text-xs">
            <span>Quality. Affordability. Wellness.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}