import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Sun, Moon, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/products' },
  ];

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-slate-200/40 dark:border-slate-800/40 glassmorphism shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-brand-600 p-2.5 rounded-xl shadow-lg shadow-brand-500/25 text-white transform group-hover:rotate-12 transition-transform duration-200">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-violet-400 dark:from-brand-400 dark:to-violet-300">
                trendora
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-semibold tracking-wide transition-colors ${
                    isActive
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-5">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none text-white bg-rose-500 transform translate-x-1/4 -translate-y-1/4 animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none text-white bg-brand-600 transform translate-x-1/4 -translate-y-1/4">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  onBlur={() => setTimeout(() => setProfileDropdownOpen(false), 200)}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 flex items-center justify-center border border-brand-200/50 uppercase">
                    {user.name.firstname[0]}
                    {user.name.lastname[0]}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 rounded-2xl shadow-xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/50">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user.username}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-brand-400 dark:hover:bg-slate-800/50 transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" /> My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Buttons */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile Cart Toggle */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[9px] font-bold leading-none text-white bg-brand-600 transform translate-x-1/4 -translate-y-1/4">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/40 dark:border-slate-800/40 bg-white dark:bg-slate-950 animate-slide-up">
          <div className="px-4 pt-2 pb-6 space-y-4 shadow-inner">
            <nav className="flex flex-col gap-3.5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-base font-semibold px-2 py-1.5 rounded-lg ${
                      isActive
                        ? 'text-brand-600 bg-brand-50/50 dark:text-brand-400 dark:bg-brand-950/20'
                        : 'text-slate-600 dark:text-slate-300'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
              <NavLink
                to="/wishlist"
                className="text-base font-semibold px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 flex justify-between items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>My Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {wishlist.length}
                  </span>
                )}
              </NavLink>
            </nav>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 flex items-center justify-center border border-brand-200/50 uppercase font-bold">
                      {user.name.firstname[0]}
                      {user.name.lastname[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.name.firstname} {user.name.lastname}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    className="block text-base font-semibold px-2 py-1.5 text-slate-600 dark:text-slate-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-base font-semibold px-2 py-1.5 text-rose-600"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
