import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Headphones, Sparkles } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        // Slice top 4 products for featured listing
        setFeaturedProducts(data.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    {
      name: 'Apparel',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80',
      description: 'Refined leather jackets, sweaters & cotton essentials.',
    },
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80',
      description: 'State-of-the-art headphones, keyboards & peripherals.',
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      description: 'Chronograph watches, leather bags & sunglasses.',
    },
    {
      name: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      description: 'Hand-poured candles, stoneware mugs & blankets.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/4 translate-x-1/2 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-violet-550/10 border border-violet-500/35 px-3 py-1.5 rounded-full text-violet-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>New Season Arrivals</span>
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display text-slate-100 leading-tight">
                Elevate Your <br />
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                  Everyday Aesthetic
                </span>
              </h1>
              
              <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Explore a curated marketplace of premium apparel, minimal tech peripherals, and refined lifestyle accessories. Built for performance, designed for life.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/products"
                  className="w-full sm:w-auto text-center bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3.5 rounded-full transition-colors flex items-center justify-center gap-2 shadow-xl shadow-violet-600/25 group cursor-pointer"
                >
                  <span>Shop Collection</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/products?category=Electronics"
                  className="w-full sm:w-auto text-center border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white font-semibold px-8 py-3.5 rounded-full transition-colors cursor-pointer"
                >
                  Explore Tech
                </Link>
              </div>
            </div>

            {/* Hero Visual Card Stack */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-80 h-96 sm:w-96 sm:h-[450px]">
                {/* Secondary Background card */}
                <div className="absolute top-4 -right-4 w-full h-full rounded-3xl bg-slate-900 border border-slate-800 rotate-3 z-0 opacity-80 pointer-events-none"></div>
                {/* Primary Card */}
                <div className="absolute top-0 right-0 w-full h-full rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl z-10">
                  <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80"
                    alt="Premium Fashion"
                    className="w-full h-full object-cover brightness-90 group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex flex-col justify-end p-6">
                    <p className="text-violet-400 text-xs font-bold uppercase tracking-wider mb-1">Premium Apparel</p>
                    <h3 className="text-slate-100 font-display text-lg font-bold">Classic Outerwear Collection</h3>
                    <Link to="/products?category=Apparel" className="text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 mt-2">
                      <span>View items</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-panel p-6 rounded-2xl flex gap-4 items-start">
            <div className="bg-violet-650/15 border border-violet-500/30 p-3 rounded-xl text-violet-400 shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h3 className="text-slate-200 font-semibold mb-1">Free Shipping</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Complementary express shipping on all orders over $100.</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex gap-4 items-start">
            <div className="bg-violet-650/15 border border-violet-500/30 p-3 rounded-xl text-violet-400 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-slate-200 font-semibold mb-1">Secure Checkouts</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Protected financial routes carrying SSL tokens and JWT guards.</p>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex gap-4 items-start">
            <div className="bg-violet-650/15 border border-violet-500/30 p-3 rounded-xl text-violet-400 shrink-0">
              <Headphones size={24} />
            </div>
            <div>
              <h3 className="text-slate-200 font-semibold mb-1">Premium Support</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Dedicated service advisors online and reachable 24/7.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="text-3xl font-bold tracking-tight font-display text-slate-100 mb-2">Shop By Categories</h2>
          <p className="text-slate-400 text-sm">Select collections meticulously curated for various lifestyle preferences.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-80 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700/60 transition-all flex flex-col justify-end p-6"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-0"></div>
              
              <div className="relative z-10 space-y-1">
                <h3 className="text-slate-200 font-display font-bold text-lg group-hover:text-violet-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-display text-slate-100 mb-1">Featured Essentials</h2>
            <p className="text-slate-400 text-sm">Our most popular, top-rated products of the season.</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
          >
            <span>See All Products</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-[360px] bg-slate-900/60 rounded-2xl border border-slate-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;
