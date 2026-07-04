
import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800 dark:bg-slate-950 dark:border-slate-900/50">
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Pitch */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-brand-600 p-2.5 rounded-xl text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                trendora
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mt-2">
              Your one-stop destination for premium electronics, stylish apparel, and exquisite jewelry. Redefining your virtual shopping experience.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              <a href="#" className="p-2 rounded-lg bg-slate-800/80 hover:bg-brand-600 hover:text-white text-slate-400 transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/80 hover:bg-brand-600 hover:text-white text-slate-400 transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/80 hover:bg-brand-600 hover:text-white text-slate-400 transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/80 hover:bg-brand-600 hover:text-white text-slate-400 transition-colors" aria-label="Youtube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">Shop Catalog</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">My Cart</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">My Wishlist</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
              Customer Support
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">Track Orders</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Return Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
              Contact Info
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-2.5 items-start">
                <MapPin className="w-5 h-5 text-brand-500 shrink-0" />
                <span>8685 El Camino Real, New York, NY 10001</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Phone className="w-5 h-5 text-brand-500 shrink-0" />
                <span>+1 (570) 236-7033</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Mail className="w-5 h-5 text-brand-500 shrink-0" />
                <span>support@trendora.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Lower Section */}
        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} trendora Inc. All rights reserved. Made for presentation purposes.
          </p>
          {/* Mock payment methods */}
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700/50">VISA</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700/50">Mastercard</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700/50">Apple Pay</span>
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700/50">Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
