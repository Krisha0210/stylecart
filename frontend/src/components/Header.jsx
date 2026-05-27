import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User as UserIcon,
  LogOut,
  Search,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();

  const [keyword, setKeyword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(keyword)}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="glass-panel-heavy sticky top-0 z-50 w-full border-b border-slate-800/60">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold tracking-tight font-display bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent"
            >
              StyleCart
            </Link>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">

            <form
              onSubmit={handleSearchSubmit}
              className="relative w-full"
            >

              <input
                type="text"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-full py-2 pl-4 pr-10 text-sm text-slate-100"
              />

              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <Search size={18} />
              </button>

            </form>

          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">

            <Link
              to="/products"
              className="text-sm text-slate-300 hover:text-violet-400"
            >
              Shop All
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-300"
            >

              <ShoppingCart size={21} />

              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] text-white">
                  {itemsCount}
                </span>
              )}

            </Link>

            {user ? (

              <div className="flex items-center space-x-4">

                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 text-amber-400"
                  >
                    <LayoutDashboard size={16} />
                    <span>Admin</span>
                  </Link>
                )}

                {/* Profile */}
                <Link
                  to="/profile"
                  className="flex items-center gap-1 text-slate-300 hover:text-violet-400"
                >
                  <UserIcon size={16} />
                  <span>Profile</span>
                </Link>

                <span className="text-sm text-slate-400 border-l border-slate-700 pl-4">
                  Hi{' '}
                  <span className="text-slate-100">
                    {user.name.split(' ')[0]}
                  </span>
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-slate-400 hover:text-rose-400"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>

              </div>

            ) : (

              <div className="flex items-center space-x-3">

                <Link
                  to="/login"
                  className="text-slate-300"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="bg-violet-600 text-white px-4 py-2 rounded-full"
                >
                  Register
                </Link>

              </div>

            )}

          </div>

          {/* Mobile */}

          <div className="flex md:hidden items-center space-x-4">

            <Link
              to="/cart"
              className="relative"
            >

              <ShoppingCart size={20} />

              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[9px] text-white">
                  {itemsCount}
                </span>
              )}

            </Link>

            <button
              onClick={() =>
                setMobileMenuOpen(!mobileMenuOpen)
              }
            >
              {mobileMenuOpen
                ? <X size={24} />
                : <Menu size={24} />
              }
            </button>

          </div>

        </div>

      </div>

      {/* Mobile Drawer */}

      {mobileMenuOpen && (

        <div className="md:hidden px-4 pt-2 pb-6 space-y-4">

          <Link
            to="/products"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="block py-2"
          >
            Shop All
          </Link>

          {user ? (

            <>

              {user.isAdmin && (

                <Link
                  to="/admin"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="flex items-center gap-2 py-2"
                >
                  <LayoutDashboard size={18} />
                  Admin
                </Link>

              )}

              <Link
                to="/profile"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex items-center gap-2 py-2"
              >
                <UserIcon size={18} />
                My Profile
              </Link>

              <div className="text-sm text-slate-400">
                Logged in as {user.name}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-rose-400 py-2"
              >
                <LogOut size={18} />
                Logout
              </button>

            </>

          ) : (

            <div className="grid grid-cols-2 gap-2">

              <Link
                to="/login"
                className="text-center border rounded-lg py-2"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="text-center bg-violet-600 text-white rounded-lg py-2"
              >
                Register
              </Link>

            </div>

          )}

        </div>

      )}

    </header>
  );
};

export default Header;