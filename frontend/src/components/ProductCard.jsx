import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevents navigating to details page
    e.stopPropagation();
    addToCart(product, 1);
  };

  // Generate star array for reviews
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
   
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={13} className="fill-amber-400 text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Star key={i} size={13} className="fill-amber-400/50 text-amber-400" />);
      } else {
        stars.push(<Star key={i} size={13} className="text-slate-600" />);
      }
    }
    return stars;
  };

  const isOutOfStock = product.countInStock === 0;

  return (
    <div className="group relative bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/60 rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-350 hover:shadow-2xl hover:shadow-violet-950/10">
      
      {/* Product Image Link */}
      <Link to={`/products/${product._id}`} className="relative block overflow-hidden aspect-square bg-slate-950">
       <img
  src={product.image}
  alt={product.name}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = "https://placehold.co/600x600/png?text=StyleCart";
  }}
/>
        
        {/* Category Pill Tag */}
        <span className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest text-slate-300 py-1 px-2.5 rounded-full border border-slate-800">
          {product.category}
        </span>

        {/* Stock status indicator if low or out */}
        {isOutOfStock ? (
          <span className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center text-xs font-bold uppercase tracking-wider text-rose-400">
            Out Of Stock
          </span>
        ) : product.countInStock <= 5 ? (
          <span className="absolute bottom-3 left-3 bg-amber-600/90 text-white text-[9px] uppercase font-bold tracking-wider py-0.5 px-2 rounded">
            Only {product.countInStock} Left
          </span>
        ) : null}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex">{renderStars(product.rating || 4)}</div>
            <span className="text-[10px] text-slate-500 font-medium">
              ({product.numReviews || 0})
            </span>
          </div>

          {/* Title */}
          <Link to={`/products/${product._id}`} className="block mb-2">
            <h3 className="text-sm font-semibold text-slate-200 group-hover:text-violet-400 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Description Snippet */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-850">
          <span className="text-base font-bold text-slate-100 font-display">
            ${product.price.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center p-2 rounded-full cursor-pointer transition-all ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20 active:scale-95'
            }`}
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
