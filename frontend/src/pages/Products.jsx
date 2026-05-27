import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state filters with search params
  const categoryParam = searchParams.get('category') || '';
  const keywordParam = searchParams.get('keyword') || '';
  
  const [sortOption, setSortOption] = useState('newest');

  const categories = ['Apparel', 'Electronics', 'Accessories', 'Home & Living'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Construct query string
        let query = '/products';
        const params = [];
        if (categoryParam) params.push(`category=${encodeURIComponent(categoryParam)}`);
        if (keywordParam) params.push(`keyword=${encodeURIComponent(keywordParam)}`);
        
        if (params.length > 0) {
          query += `?${params.join('&')}`;
        }

        const { data } = await api.get(query);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to load products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, keywordParam]);

  // Handle local sorting
  const getSortedProducts = () => {
    const sorted = [...products];
    if (sortOption === 'priceAsc') {
      return sorted.sort((a, b) => a.price - b.price);
    }
    if (sortOption === 'priceDesc') {
      return sorted.sort((a, b) => b.price - a.price);
    }
    if (sortOption === 'rating') {
      return sorted.sort((a, b) => b.rating - a.rating);
    }
    // 'newest' / default uses database creation order (already sorted by server by default)
    return sorted;
  };

  const handleCategorySelect = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category) {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setSortOption('newest');
  };

  const sortedProducts = getSortedProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Search Header Info */}
      <div className="mb-8 border-b border-slate-900 pb-5">
        <h1 className="text-3xl font-bold font-display text-slate-100 mb-2">
          {categoryParam ? `${categoryParam}` : 'All Products'}
        </h1>
        <p className="text-slate-400 text-sm">
          {keywordParam && (
            <span>
              Search results for "<span className="text-violet-400 font-semibold">{keywordParam}</span>" —{' '}
            </span>
          )}
          <span>Showing {sortedProducts.length} items</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Categories Filter Panel */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-slate-200 font-semibold border-b border-slate-800 pb-3 text-sm uppercase tracking-wider">
              <Filter size={16} className="text-violet-400" />
              <span>Categories</span>
            </div>

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleCategorySelect('')}
                className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  !categoryParam
                    ? 'bg-violet-600/15 text-violet-400 border border-violet-500/20'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                All Collections
              </button>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategorySelect(cat)}
                  className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    categoryParam === cat
                      ? 'bg-violet-600/15 text-violet-400 border border-violet-500/20'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Selection Panel */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-slate-200 font-semibold border-b border-slate-800 pb-3 text-sm uppercase tracking-wider">
              <SlidersHorizontal size={16} className="text-violet-400" />
              <span>Sort By</span>
            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-500 transition-colors"
            >
              <option value="newest">Newest Releases</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Highest Reviews</option>
            </select>
          </div>

          {/* Clear Filters CTA */}
          {(categoryParam || keywordParam || sortOption !== 'newest') && (
            <button
              onClick={handleClearFilters}
              className="w-full bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 py-2.5 rounded-xl text-xs font-semibold border border-slate-800 hover:border-slate-700/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          )}

        </div>

        {/* Product Catalog Grid Area */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 6].map((n) => (
                <div key={n} className="h-[360px] bg-slate-900/60 rounded-2xl border border-slate-800"></div>
              ))}
            </div>
          ) : error ? (
            <div className="glass-panel p-12 rounded-2xl text-center border border-rose-950/20 max-w-md mx-auto">
              <p className="text-rose-400 font-semibold mb-2">Error Loading Catalog</p>
              <p className="text-slate-400 text-xs mb-4">{error}</p>
              <button
                onClick={handleClearFilters}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs px-4 py-2 rounded-lg border border-slate-800 cursor-pointer"
              >
                Retry Request
              </button>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="glass-panel p-16 rounded-2xl text-center border border-slate-850 max-w-lg mx-auto space-y-4">
              <div className="text-4xl">🔎</div>
              <h3 className="text-lg font-semibold text-slate-350">No products found</h3>
              <p className="text-slate-400 text-xs max-w-xs mx-auto">
                We couldn't find matches matching your filter queries. Try adjusting your parameters.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-violet-600 hover:bg-violet-500 text-white text-xs px-5 py-2.5 rounded-full font-semibold shadow-lg shadow-violet-600/10 cursor-pointer"
              >
                Clear Search &amp; Category Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Products;
