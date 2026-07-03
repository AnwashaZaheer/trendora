import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Plus, Minus, ArrowLeft, ShieldCheck, HelpCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, getMockReviews } from '../utils/helpers';
import { ProductCard } from '../components/product/ProductCard';
import { Skeleton, ProductSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description'); // description, specifications, reviews

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const isLiked = product ? isInWishlist(product.id) : false;
  const mockReviewsList = product ? getMockReviews(product.id) : [];

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setRelatedLoading(true);
        const data = await api.getProductById(id);
        
        if (data) {
          setProduct(data);
          setQuantity(1); // Reset quantity trigger
          
          // Fetch related products in category
          const related = await api.getProductsByCategory(data.category);
          // Filter out current product
          const filteredRelated = related.filter((p) => p.id !== data.id).slice(0, 4);
          setRelatedProducts(filteredRelated);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
        setRelatedLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    showToast(`Added ${quantity} x ${product.title.substring(0, 18)}... to cart!`);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product);
    if (isLiked) {
      showToast('Removed from wishlist.', 'info');
    } else {
      showToast('Added to wishlist!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-left space-y-10">
        <Skeleton variant="text" className="w-1/4 h-5" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton variant="rect" className="aspect-square w-full" />
          <div className="space-y-6">
            <Skeleton variant="text" className="w-1/3 h-4" />
            <Skeleton variant="text" className="w-full h-8" />
            <Skeleton variant="text" className="w-1/4 h-8" />
            <Skeleton variant="text" className="w-full h-24" />
            <Skeleton variant="rect" className="w-1/2 h-12" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="text-slate-500">The product you are trying to view does not exist or has been removed.</p>
        <Link to="/products">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const ratingValue = product.rating ? Math.round(product.rating.rate) : 4;
  const ratingCount = product.rating ? product.rating.count : 0;

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-left space-y-16">
      
      {/* Breadcrumb / Back Link */}
      <div>
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>

      {/* Main Details Panel */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Product Image Frame */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-center aspect-square max-w-lg mx-auto w-full relative overflow-hidden group">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Product Description details */}
        <div className="space-y-6">
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-3 py-1 rounded-full">
            {product.category}
          </span>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
            {product.title}
          </h1>

          {/* Rating Block */}
          <div className="flex items-center gap-4">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < ratingValue ? 'fill-current' : 'text-slate-200 dark:text-slate-800'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-500">
              {product.rating ? product.rating.rate : '4.0'} rating ({ratingCount} Reviews)
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-black text-slate-900 dark:text-slate-50">
            {formatPrice(product.price)}
          </div>

          {/* Intro Description */}
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Quantity and Actions Triggers */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
            {/* Quantity select counter */}
            <div className="flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-xl p-1 bg-slate-50 dark:bg-slate-900/50 sm:w-32 shrink-0">
              <button
                onClick={handleDecrement}
                className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Decrement quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-slate-800 dark:text-slate-100 px-3">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                aria-label="Increment quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart button */}
            <Button
              onClick={handleAddToCart}
              className="flex-grow flex items-center justify-center gap-2.5 py-3.5 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </Button>

            {/* Wishlist button */}
            <button
              onClick={handleToggleWishlist}
              className={`p-3.5 rounded-xl border transition-colors flex items-center justify-center active:scale-95 shrink-0 ${
                isLiked
                  ? 'bg-rose-50 border-rose-200/50 text-rose-500 dark:bg-rose-950/20 dark:border-rose-900/30'
                  : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800'
              }`}
              aria-label="Wishlist toggle"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Secure Trust Icons */}
          <div className="grid grid-cols-2 gap-4 pt-6 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Full Authenticity Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0" />
              <span>24/7 Dedicated Support Help</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Layout: Description, Specs, Reviews */}
      <section className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 pb-px gap-6 overflow-x-auto">
          {[
            { id: 'description', name: 'Product Description' },
            { id: 'specifications', name: 'Details & Specs' },
            { id: 'reviews', name: `Customer Reviews (${mockReviewsList.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm font-bold pb-4 transition-all focus:outline-none shrink-0 ${
                activeTab === tab.id
                  ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 dark:border-brand-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab content panels */}
        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 text-sm leading-relaxed space-y-4">
              <p>{product.description}</p>
              <p>Designed with standard durable materials, this product offers both aesthetic appeal and practical performance. Engineered for users who value high-grade reliability, it delivers maximum capabilities without compromising design elements.</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="max-w-xl text-sm">
              <table className="w-full border-collapse">
                <tbody>
                  {[
                    { name: 'Product ID Reference', value: `VBC-${product.id * 107}` },
                    { name: 'Product Classification', value: product.category },
                    { name: 'Item Weight (Est)', value: product.id % 2 === 0 ? '420g' : '1.2kg' },
                    { name: 'Quality Rating Standard', value: `${product.rating ? product.rating.rate : '4.0'} / 5.0 Stars` },
                    { name: 'Stock Available Status', value: 'In Stock (Ships in 24 hours)' }
                  ].map((spec, i) => (
                    <tr key={spec.name} className={i % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800/30' : ''}>
                      <td className="px-4 py-3 font-bold text-slate-500 dark:text-slate-400">{spec.name}</td>
                      <td className="px-4 py-3 text-slate-800 dark:text-slate-200 capitalize font-medium">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {mockReviewsList.map((review) => (
                <div key={review.id} className="border-b border-slate-100 dark:border-slate-800/80 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <h5 className="font-bold text-slate-800 dark:text-slate-100">{review.name}</h5>
                    <span className="text-xs text-slate-400 font-medium">{review.date}</span>
                  </div>
                  <div className="flex items-center text-amber-400 mt-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-3 h-3 ${
                          idx < review.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      <section>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mb-8">
          Related Products
        </h3>
        
        {relatedLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </div>
        ) : relatedProducts.length === 0 ? (
          <p className="text-slate-400 text-sm">No related products found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
