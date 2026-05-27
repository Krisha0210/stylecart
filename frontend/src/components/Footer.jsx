import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        {/* StyleCart Info */}
        <div className="space-y-4">
          <Link to="/" className="text-xl font-bold tracking-tight font-display bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            StyleCart
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            Curated premium lifestyle, tech, and apparel items designed for comfort, utility, and refined aesthetics.
          </p>
        </div>

        {/* Shop Category Links */}
        <div>
          <h4 className="text-slate-200 text-sm font-semibold tracking-wider uppercase mb-4">Shop By Collection</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              <Link to="/products?category=Apparel" className="hover:text-violet-400 transition-colors">Apparel</Link>
            </li>
            <li>
              <Link to="/products?category=Electronics" className="hover:text-violet-400 transition-colors">Electronics</Link>
            </li>
            <li>
              <Link to="/products?category=Accessories" className="hover:text-violet-400 transition-colors">Accessories</Link>
            </li>
            <li>
              <Link to="/products?category=Home%20%26%20Living" className="hover:text-violet-400 transition-colors">Home & Living</Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-slate-200 text-sm font-semibold tracking-wider uppercase mb-4">Customer Support</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              <a href="#" className="hover:text-violet-400 transition-colors">Contact Support</a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-400 transition-colors">Shipping & Returns</a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-400 transition-colors">FAQ Overview</a>
            </li>
            <li>
              <a href="#" className="hover:text-violet-400 transition-colors">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription mock */}
        <div>
          <h4 className="text-slate-200 text-sm font-semibold tracking-wider uppercase mb-4">Stay Connected</h4>
          <p className="text-slate-400 text-sm mb-4">
            Subscribe to our newsletter to receive stock drops, exclusive deals, and release notices.
          </p>
          <form className="flex space-x-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs w-full focus:outline-none focus:border-violet-500 text-slate-100"
              required
            />
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-500 text-white rounded-lg px-4 py-2 text-xs font-semibold shadow-lg shadow-violet-600/10 cursor-pointer"
            >
              Join
            </button>
          </form>
        </div>

      </div>

      {/* Copy info */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900/60 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
        <p className="mb-4 sm:mb-0">&copy; {new Date().getFullYear()} StyleCart Inc. All rights reserved.</p>
        <p>Built with React &amp; Tailwind CSS v4</p>
      </div>
    </footer>
  );
};

export default Footer;
