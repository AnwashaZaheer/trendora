import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Grid, List, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { ProductSkeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

const ITEMS_PER_PAGE = 8;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState(1000); // Max cap
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popular'); // popular, priceAsc, priceDesc, nameAsc, nameDesc
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync params from URL (e.g. when category clicked from Home)
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [searchParams]);

  // Initial Fetches
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching catalog data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter and Sort application
  const getFilteredProducts = () => {
    let result = [...products];

    // Search query
    if (searchQuery.trim()) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Price
    result = result.filter((p) => p.price <= priceRange);

    // Rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating && p.rating.rate >= minRating);
    }

    // Sort
    if (sortBy === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'nameAsc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'nameDesc') {
      result.sort((a, b) => b.title.localeCompare(a.title));
    } // 'popular' uses default ordering from Fake Store

    return result;
  };

  const filteredProducts = getFilteredProducts();

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceRange, minRating, sortBy]);

  // Paginated details
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange(1000);
    setMinRating(0);
    setSortBy('popular');
    setSearchParams({});
  };

  // Find dynamic max price to clamp slider limits
  const maxProductPrice = products.length > 0 ? Math.ceil(Math.max(...products.map(p => p.price))) : 1000;

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col gap-6">
        
        {/* Top Header / Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-200/40 dark:border-slate-800/40 pb-6">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight margin-0">
              Browse Catalogue
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Showing {filteredProducts.length} items matching your criteria
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            />
            <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
          </div>
        </div>

        {/* Catalog Content Layout */}
        <div className="flex gap-8 items-start relative">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm text-left space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-600" /> Filters
              </h3>
              <button
                onClick={clearFilters}
                className="text-xs text-brand-600 hover:underline font-semibold"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setSelectedCategory(''); setSearchParams({}); }}
                  className={`text-sm py-1.5 px-3 rounded-lg text-left transition-all ${
                    selectedCategory === ''
                      ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/30 dark:text-brand-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setSearchParams({ category: cat }); }}
                    className={`text-sm py-1.5 px-3 rounded-lg text-left capitalize transition-all ${
                      selectedCategory === cat
                        ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/30 dark:text-brand-300'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Max Price</h4>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">${priceRange}</span>
              </div>
              <input
                type="range"
                min="0"
                max={maxProductPrice || 1000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600"
              />
            </div>

            {/* Rating Filter */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Minimum Rating</h4>
              <div className="flex flex-col gap-2">
                {[0, 4, 3, 2].map((stars) => (
                  <label key={stars} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === stars}
                      onChange={() => setMinRating(stars)}
                      className="accent-brand-600"
                    />
                    <span>{stars === 0 ? 'Any Rating' : `${stars} Stars & Up`}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-grow space-y-6">
            {/* Toolbar: Views and Sorting */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 px-4 py-3 rounded-2xl shadow-sm">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 hidden sm:inline">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm font-semibold border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                >
                  <option value="popular">Popularity</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                  <option value="nameAsc">Name: A to Z</option>
                  <option value="nameDesc">Name: Z to A</option>
                </select>
                
                {/* Grid View toggle */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 flex gap-0.5 bg-slate-50 dark:bg-slate-800/50">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-brand-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Catalog Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">No products match your filters</h3>
                <p className="text-slate-400 text-sm mt-1 mb-6">Try clearing your queries or raising your max price limit.</p>
                <Button onClick={clearFilters}>Reset Filters</Button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                  : "flex flex-col gap-6"
              }>
                {paginatedProducts.map((prod) => (
                  <div key={prod.id} className={viewMode === 'list' ? 'h-64' : ''}>
                    <ProductCard product={prod} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2.5 pt-8 border-t border-slate-100 dark:border-slate-800/50">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
                
                {[...Array(totalPages)].map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => handlePageChange(pNum)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all active:scale-95 ${
                        currentPage === pNum
                          ? 'bg-brand-600 border-brand-600 text-white shadow-md shadow-brand-500/25'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-95"
                >
                  <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Slide-in filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[150] lg:hidden flex justify-end">
          {/* Overlay background */}
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Drawer body */}
          <aside className="relative w-80 max-w-full bg-white dark:bg-slate-900 h-full p-6 shadow-2xl flex flex-col justify-between z-10 animate-fade-in text-left overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-600" /> Filters
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</h4>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setSelectedCategory(''); setSearchParams({}); }}
                    className={`text-sm py-1.5 px-3 rounded-lg text-left transition-all ${
                      selectedCategory === ''
                        ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/30'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setSearchParams({ category: cat }); }}
                      className={`text-sm py-1.5 px-3 rounded-lg text-left capitalize transition-all ${
                        selectedCategory === cat
                          ? 'bg-brand-50 text-brand-700 font-semibold dark:bg-brand-950/30'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Max Price</h4>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">${priceRange}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxProductPrice || 1000}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
              </div>

              {/* Rating Filter */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Minimum Rating</h4>
                <div className="flex flex-col gap-2">
                  {[0, 4, 3, 2].map((stars) => (
                    <label key={stars} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="mobileMinRating"
                        checked={minRating === stars}
                        onChange={() => setMinRating(stars)}
                        className="accent-brand-600"
                      />
                      <span>{stars === 0 ? 'Any Rating' : `${stars} Stars & Up`}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t mt-6 flex gap-3">
              <Button variant="outline" className="w-full" onClick={clearFilters}>Reset</Button>
              <Button className="w-full" onClick={() => setMobileFiltersOpen(false)}>Apply</Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
