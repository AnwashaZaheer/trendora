import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Percent } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartSubtotal, cartTax, cartShipping, cartTotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // decimal e.g. 0.15 for 15%
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'VIBE15') {
      setAppliedDiscount(0.15);
      showToast('Coupon VIBE15 applied! 15% discount deducted.', 'success');
    } else {
      showToast('Invalid coupon code. Try VIBE15.', 'error');
    }
  };

  const discountAmount = cartSubtotal * appliedDiscount;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + cartTax + cartShipping);

  const handleCheckoutClick = () => {
    // Navigate to checkout. If they have applied discount, we can pass it down through local storage or state
    localStorage.setItem('trendora_applied_discount', JSON.stringify(appliedDiscount));
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="flex-grow max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center gap-6">
        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-full text-slate-400">
          <ShoppingBag className="w-16 h-16" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Your Cart is Empty</h2>
          <p className="text-slate-500 text-sm max-w-sm">Looks like you haven't added anything to your cart yet. Let's find some premium gear.</p>
        </div>
        <Link to="/products">
          <Button size="lg" className="group">
            Explore Catalog <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-left space-y-8">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
        Shopping Bag
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4 sm:p-5 rounded-2xl shadow-sm"
            >
              {/* Product Thumbnail */}
              <Link to={`/products/${item.id}`} className="w-20 h-20 shrink-0 bg-white border rounded-xl p-2 flex items-center justify-center overflow-hidden">
                <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
              </Link>

              {/* Title & Price Details */}
              <div className="flex-grow space-y-1">
                <Link to={`/products/${item.id}`} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1 leading-snug">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-xs text-slate-400 capitalize">{item.category}</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-slate-50 mt-1">
                  {formatPrice(item.price)}
                </p>
              </div>

              {/* Quantity Selector Counter */}
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-950/50 shrink-0">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  aria-label="Reduce quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 px-2.5">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => {
                  removeFromCart(item.id);
                  showToast('Item removed from cart.', 'info');
                }}
                className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                aria-label="Remove item"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Order Summary
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-4 border-b border-slate-100 dark:border-slate-800/50 pb-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800 dark:text-slate-200">{formatPrice(cartSubtotal)}</span>
              </div>
              
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1.5"><Percent className="w-3.5 h-3.5" /> Discount (15%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span className="text-slate-800 dark:text-slate-200">{formatPrice(cartTax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Standard Delivery</span>
                <span className="text-slate-800 dark:text-slate-200">
                  {cartShipping === 0 ? (
                    <span className="text-emerald-600 font-bold dark:text-emerald-400">Free</span>
                  ) : (
                    formatPrice(cartShipping)
                  )}
                </span>
              </div>
            </div>

            {/* Free Shipping Progress bar */}
            {cartSubtotal < 100 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  Add <span className="text-brand-600 dark:text-brand-400">{formatPrice(100 - cartSubtotal)}</span> for Free Shipping
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-brand-600 h-full transition-all duration-300" style={{ width: `${(cartSubtotal / 100) * 100}%` }} />
                </div>
              </div>
            )}

            {/* Final Total */}
            <div className="flex justify-between items-center text-base font-extrabold text-slate-900 dark:text-slate-50">
              <span>Estimated Total</span>
              <span className="text-lg">{formatPrice(finalTotal)}</span>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 flex items-center justify-center gap-2 group shadow-lg shadow-brand-500/25"
            >
              Secure Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Coupon Code Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-brand-600" /> Apply Coupon
            </h4>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code (VIBE15)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-grow px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 uppercase font-semibold"
              />
              <Button type="submit" variant="secondary" size="sm" className="px-4">Apply</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
