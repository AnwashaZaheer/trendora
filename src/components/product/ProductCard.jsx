import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/helpers';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const isLiked = isInWishlist(product.id);
  const ratingValue = product.rating ? Math.round(product.rating.rate) : 4;
  const ratingCount = product.rating ? product.rating.count : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`${product.title.substring(0, 20)}... added to cart!`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (isLiked) {
      showToast('Removed from wishlist.', 'info');
    } else {
      showToast('Added to wishlist!', 'success');
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full overflow-hidden">
      
      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-4 right-4 z-10 p-2.5 rounded-xl border backdrop-blur-md transition-all duration-200 active:scale-95 ${
          isLiked
            ? 'bg-rose-50 border-rose-200/50 text-rose-500 dark:bg-rose-950/30 dark:border-rose-900/30'
            : 'bg-white/80 border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-white dark:bg-slate-900/80 dark:border-slate-800 dark:hover:bg-slate-800'
        }`}
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
      </button>

      {/* Image Block */}
      <Link to={`/products/${product.id}`} className="block relative aspect-square w-full mb-4 bg-white rounded-xl p-3 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Label Overlay */}
        <span className="absolute bottom-2 left-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100/90 text-slate-600 dark:bg-slate-800/90 dark:text-slate-300 rounded-md">
          {product.category}
        </span>
      </Link>

      {/* Info Block */}
      <div className="flex flex-col gap-2 flex-grow">
        {/* Title */}
        <Link to={`/products/${product.id}`}>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < ratingValue ? 'fill-current' : 'text-slate-200 dark:text-slate-800'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">({ratingCount})</span>
        </div>

        {/* Price & Cart Trigger */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50 dark:border-slate-800/50">
          <span className="text-base font-extrabold text-slate-900 dark:text-slate-50">
            {formatPrice(product.price)}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 hover:shadow-brand-500/40 active:scale-95 transition-all duration-200"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
