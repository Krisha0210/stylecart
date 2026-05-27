import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const { register, user, error, setError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get redirect url from search params, default to home page
  const redirect = searchParams.get('redirect') || '/';

  // If user is already logged in, redirect them immediately
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
    // Clean up error state when page loads
    setError(null);
  }, [user, redirect, navigate, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!name || !email || !password || !confirmPassword) {
      setLocalError('Please fill out all fields');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register(name, email, password);
    } catch (err) {
      console.error('Registration action rejected:', err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      
      {/* Background radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-650/10 blur-[100px] pointer-events-none rounded-full"></div>

      <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-display text-slate-100">Create Account</h2>
          <p className="text-slate-400 text-xs">Join StyleCart to browse and track premium items</p>
        </div>

        {/* Display Error Message */}
        {(localError || error) && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-400">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{localError || error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name field */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-900 border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-violet-500 text-slate-100 placeholder-slate-600 transition-colors"
              />
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            </div>
          </div>

          {/* Email field */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-900 border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-violet-500 text-slate-100 placeholder-slate-600 transition-colors"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-slate-900 border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-violet-500 text-slate-100 placeholder-slate-650 transition-colors"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            </div>
          </div>

          {/* Confirm Password field */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-slate-900 border border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-violet-500 text-slate-100 placeholder-slate-650 transition-colors"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-violet-650 hover:bg-violet-550 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-violet-650/15 cursor-pointer mt-6 active:scale-98"
          >
            <LogIn size={15} />
            <span>Create Account</span>
          </button>

        </form>

        {/* Footnote Link */}
        <div className="text-center text-xs text-slate-500 border-t border-slate-900/60 pt-4">
          <span>Already have an account? </span>
          <Link
            to={redirect !== '/' ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login'}
            className="text-violet-400 font-semibold hover:text-violet-300 transition-colors"
          >
            Sign In here
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Register;
