import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/helpers';
import { Button } from '../components/ui/Button';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    showToast(`Moved ${product.title.substring(0, 18)}... to cart!`);
  };

  if (wishlist.length === 0) {
    return (
      <div className="flex-grow max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center gap-6">
        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-full text-slate-400">
          <Heart className="w-16 h-16" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Your Wishlist is Empty</h2>
          <p className="text-slate-500 text-sm max-w-sm">Save items you like to access them later. Start exploring our top trending items today.</p>
        </div>
        <RouterLink to="/products">
          <Button size="lg" className="group">
            Explore Catalogue <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </RouterLink>
      </div>
    );
  }

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-left space-y-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
        My Wishlist
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Delete button */}
            <button
              onClick={() => {
                removeFromWishlist(item.id);
                showToast('Removed from wishlist.', 'info');
              }}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-xl border border-slate-100 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-white active:scale-95 transition-all duration-200"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Thumbnail */}
            <RouterLink to={`/products/${item.id}`} className="block relative aspect-square w-full mb-4 bg-white rounded-xl p-3 flex items-center justify-center overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="max-h-full max-w-full object-contain transform group-hover:scale-102 transition-transform duration-500"
              />
              <span className="absolute bottom-2 left-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100/90 text-slate-600 dark:bg-slate-800/90 dark:text-slate-300 rounded-md">
                {item.category}
              </span>
            </RouterLink>

            {/* Title / Details */}
            <div className="flex flex-col gap-2 flex-grow">
              <RouterLink to={`/products/${item.id}`} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
                  {item.title}
                </h3>
              </RouterLink>

              <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-50 dark:border-slate-800/50 gap-2">
                <span className="text-base font-extrabold text-slate-900 dark:text-slate-50">
                  {formatPrice(item.price)}
                </span>
                
                {/* Move to Cart */}
                <Button
                  size="sm"
                  onClick={() => handleMoveToCart(item)}
                  className="flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
