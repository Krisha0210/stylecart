import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product detail:', err);
        setError(err.response?.data?.message || 'Product not found');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      // Optional: Redirect to cart or show visual success indicator
      navigate('/cart');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={15} className="fill-amber-400 text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Star key={i} size={15} className="fill-amber-400/50 text-amber-400" />);
      } else {
        stars.push(<Star key={i} size={15} className="text-slate-600" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="h-6 w-32 bg-slate-900 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-900 rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-4 w-20 bg-slate-900 rounded"></div>
            <div className="h-10 w-3/4 bg-slate-900 rounded"></div>
            <div className="h-4 w-40 bg-slate-900 rounded"></div>
            <div className="h-8 w-24 bg-slate-900 rounded"></div>
            <div className="h-24 w-full bg-slate-900 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="glass-panel p-10 rounded-2xl max-w-md mx-auto space-y-4">
          <div className="text-rose-400 text-3xl">⚠️</div>
          <h2 className="text-slate-200 font-semibold">Product Load Failure</h2>
          <p className="text-slate-400 text-sm">{error || 'This product does not exist.'}</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-full font-semibold cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.countInStock === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Breadcrumb / Back Navigation */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-violet-400 mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Back to catalog</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column - Product Image */}
        <div className="md:col-span-6 flex justify-center">
          <div className="relative w-full aspect-square max-w-lg rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950/60 shadow-2xl">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {isOutOfStock && (
              <span className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2.5px] flex items-center justify-center text-lg font-bold uppercase tracking-wider text-rose-400">
                Out Of Stock
              </span>
            )}
          </div>
        </div>

        {/* Right Column - Product Contexts & Checkouts */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category */}
            <span className="inline-block bg-violet-600/10 border border-violet-550/20 text-violet-400 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
              {product.category}
            </span>

            {/* Name */}
            <h1 className="text-3xl lg:text-4xl font-bold font-display text-slate-100">
              {product.name}
            </h1>

            {/* Rating Stars Summary */}
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-xs text-slate-400 font-medium">
                {product.rating ? product.rating.toFixed(1) : '0.0'} Rating
              </span>
              <span className="text-slate-700">|</span>
              <span className="text-xs text-slate-400 font-medium">
                {product.numReviews} review{product.numReviews !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-slate-100 font-display">
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed border-t border-slate-900 pt-4">
              {product.description}
            </p>
          </div>

          {/* Checkout parameters panel */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-400">Status</span>
              <span>
                {isOutOfStock ? (
                  <span className="text-rose-400">Temporarily Sold Out</span>
                ) : product.countInStock <= 5 ? (
                  <span className="text-amber-400">Low Stock (Only {product.countInStock} left)</span>
                ) : (
                  <span className="text-emerald-400">In Stock &amp; Ready</span>
                )}
              </span>
            </div>

            {/* Quantity Selector - Rendered only if in stock */}
            {!isOutOfStock && (
              <div className="flex justify-between items-center text-sm font-semibold border-t border-slate-850 pt-4">
                <span className="text-slate-400">Select Quantity</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-slate-200">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                    className="h-8 w-8 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Checkout Action Button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-3.5 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-850 text-slate-650 cursor-not-allowed border border-slate-800'
                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-xl shadow-violet-650/20 active:scale-[0.98]'
              }`}
            >
              <ShoppingCart size={16} />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Shopping Cart'}</span>
            </button>
          </div>

          {/* Shipping Value props */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400 border-t border-slate-900 pt-6">
            <div className="space-y-1">
              <div className="mx-auto text-violet-400 w-fit"><Truck size={16} /></div>
              <p className="font-semibold text-slate-300">Complementary Delivery</p>
              <p>Free on orders over $100</p>
            </div>
            <div className="space-y-1">
              <div className="mx-auto text-violet-400 w-fit"><RefreshCw size={16} /></div>
              <p className="font-semibold text-slate-300">Easy Returns</p>
              <p>30 day return window</p>
            </div>
            <div className="space-y-1">
              <div className="mx-auto text-violet-400 w-fit"><ShieldCheck size={16} /></div>
              <p className="font-semibold text-slate-300">JWT Encrypted</p>
              <p>Secure token transactions</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetail;
