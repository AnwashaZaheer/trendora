import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Look Good, Feel Great',
    subtitle: 'NEW THIS SEASON',
    description: "Clothes that actually fit your life — not just your body. Whether it's a chill weekend or a big day out, we've got something you'll want to wear again and again.",
    cta: 'Shop Clothes',
    category: "men's clothing",
    bgGradient: 'from-brand-700 via-[#7c3aed] to-[#5b21b6]',
    tag: ' Everyone\'s Buying'
  },
  {
    id: 2,
    title: 'Gadgets You Actually Need',
    subtitle: 'TECH THAT JUST WORKS',
    description: "No jargon, no fluff. Just solid electronics picked for real people — from earbuds that stay in your ears to chargers that don't quit on you.",
    cta: 'Browse Tech',
    category: 'electronics',
    bgGradient: 'from-[#1a1330] via-[#2e2650] to-[#0f0c1a]',
    tag: ' Just Dropped'
  },
  {
    id: 3,
    title: 'A Little Sparkle Goes a Long Way',
    subtitle: 'JEWELRY FOR EVERY MOMENT',
    description: "A gift for someone special — or just a little treat for yourself. Our jewelry is the kind you reach for every day, not just for fancy occasions.",
    cta: 'Find Your Piece',
    category: 'jewelery',
    bgGradient: 'from-[#6d28d9] via-[#8b5cf6] to-[#4c1d95]',
    tag: ' Customer Fav'
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.getProducts();
        // Take a slice of 4 random products as featured
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Slide rotation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    showToast('Subscription successful! Check your inbox for your 10% coupon.', 'success');
    setEmailInput('');
  };

  return (
    <div className="flex-grow space-y-16 pb-16">
      
      {/* Hero Slideshow Section */}
      <section className="relative h-[480px] sm:h-[600px] overflow-hidden bg-slate-950 text-white">
        {/* Slides */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full flex items-center transition-all duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95 pointer-events-none'
            }`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-90`} />
            
            {/* Slide Details */}
            <div className="relative max-w-7xl mx-auto w-full z-20 flex flex-col justify-center items-start text-left px-24 sm:px-28 lg:px-20 xl:px-24">
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={index === currentSlide ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4 }}
                className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/10"
              >
                {slide.tag}
              </motion.span>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={index === currentSlide ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-2xl leading-none"
              >
                {slide.title}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={index === currentSlide ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-4 text-base sm:text-lg text-slate-200/90 max-w-lg leading-relaxed font-light"
              >
                {slide.description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={index === currentSlide ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8"
              >
                <Link to={`/products?category=${encodeURIComponent(slide.category)}`}>
                  <Button variant="secondary" size="lg" className="group">
                    {slide.cta} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        ))}

        {/* Carousel controls */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/25 text-white hover:bg-black/40 border border-white/5 backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/25 text-white hover:bg-black/40 border border-white/5 backdrop-blur-md hover:scale-105 active:scale-95 transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-7' : 'bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Selling Value Props Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="flex gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm items-start">
          <div className="bg-brand-50 dark:bg-brand-950/40 p-3 rounded-xl text-brand-600 dark:text-brand-400">
            <Truck className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Free Courier Shipping</h3>
            <p className="text-xs text-slate-500 mt-1">Get complimentary delivery anywhere on orders above $100.</p>
          </div>
        </div>
        <div className="flex gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm items-start">
          <div className="bg-brand-50 dark:bg-brand-950/40 p-3 rounded-xl text-brand-600 dark:text-brand-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">100% Genuine Products</h3>
            <p className="text-xs text-slate-500 mt-1">All items directly sourced from official manufacturers.</p>
          </div>
        </div>
        <div className="flex gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm items-start">
          <div className="bg-brand-50 dark:bg-brand-950/40 p-3 rounded-xl text-brand-600 dark:text-brand-400">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">30-Day Easy Returns</h3>
            <p className="text-xs text-slate-500 mt-1">No questions asked return policy with full money-back guarantee.</p>
          </div>
        </div>
      </section>

      {/* Grid of Interactive Shop Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">
            Explore Curated Categories
          </h2>
          <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
            Choose from our specialized collections to find the perfect gear tailored to your exact taste.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Men's Fashion",
              category: "men's clothing",
              path: "/products?category=men's clothing",
              gradient: 'from-violet-500 to-indigo-600',
              img: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=400'
            },
            {
              name: "Women's Clothing",
              category: "women's clothing",
              path: "/products?category=women's clothing",
              gradient: 'from-rose-400 to-pink-600',
              img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400'
            },
            {
              name: 'Smart Electronics',
              category: 'electronics',
              path: '/products?category=electronics',
              gradient: 'from-cyan-500 to-blue-600',
              img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400'
            },
            {
              name: 'Jewelry & Accessories',
              category: 'jewelery',
              path: '/products?category=jewelery',
              gradient: 'from-amber-400 to-orange-600',
              img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400'
            }
          ].map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="relative group h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Overlay Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} mix-blend-multiply opacity-75 group-hover:opacity-85 transition-opacity duration-300 z-10`} />
              
              {/* Background Image */}
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Title */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-left">
                <h3 className="text-lg font-bold text-white tracking-wide">{cat.name}</h3>
                <span className="text-xs text-slate-100/90 font-medium inline-flex items-center gap-1.5 mt-2 group-hover:translate-x-1.5 transition-transform">
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">
              Featured Products
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Top trending products highly rated by our active shopper community.
            </p>
          </div>
          <Link to="/products">
            <Button variant="outline" className="group">
              View All Products <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Premium CTA / Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-brand-600 text-white shadow-xl py-12 px-6 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
          <div className="text-left max-w-xl space-y-4">
            <span className="uppercase text-xs font-extrabold tracking-widest bg-white/20 px-3 py-1 rounded-full border border-white/15">
              Limited Time Coupon
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Get an extra 15% off apparel and tech items
            </h2>
            <p className="text-slate-100/90 text-sm leading-relaxed">
              Register an account today and apply the coupon code <span className="font-bold underline">VIBE15</span> at checkout to grab additional savings.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Link to="/auth" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full">
                Register Free
              </Button>
            </Link>
            <Link to="/products" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full border-white/30 hover:bg-white/10 text-white">
                View Catalog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Signup Form */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/80 rounded-2xl p-8 sm:p-12 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            Subscribe to our Newsletter
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Stay updated with fresh drops, exclusive coupon promo codes, and style lookbooks.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </section>

    </div>
  );
}
