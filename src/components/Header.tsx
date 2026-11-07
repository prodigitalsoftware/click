import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  Globe,
  LogOut,
  LayoutDashboard,
  PackageCheck,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { productAPI } from '../services/api';
import { Product } from '../types';

export const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, setAuthModalOpen, setAuthMode } = useAuth();
  const { itemCount, setCartDrawerOpen } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Live search debounced
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await productAPI.getProducts({ search: searchQuery, limit: 5 });
        if (res.success) {
          setSearchResults(res.products);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-blue-700 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>
          {language === 'km'
            ? '🔥 ទីផ្សារផលិតផលឌីជីថលកម្ពុជា: ទូទាត់រហ័សតាម Bakong KHQR និងទទួលបានផលិតផលភ្លាមៗ!'
            : '🔥 Cambodia Premier Digital Marketplace: Instant Bakong KHQR checkout & auto delivery!'}
        </span>
        <span className="hidden md:inline-block bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide">
          1 USD ≈ 4,100 KHR
        </span>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <span className="font-extrabold text-xl tracking-tighter">NV</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-gray-900 group-hover:text-brand-600 transition-colors">
                NAVASEAL<span className="text-brand-600">STORE</span>
              </span>
              <span className="text-[10px] font-medium text-gray-500 -mt-1 hidden sm:block">
                {language === 'km' ? 'ទីផ្សារផលិតផលឌីជីថល' : 'Digital Marketplace'}
              </span>
            </div>
          </Link>

          {/* Search Bar with live autocomplete */}
          <div ref={searchRef} className="flex-1 max-w-xl mx-2 hidden md:block relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                className="w-full pl-10 pr-24 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-brand-600 text-white rounded-full text-xs font-semibold hover:bg-brand-700 transition-colors shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Live Search Results Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Products Found
                    </div>
                    {searchResults.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product.slug}`}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 p-3 hover:bg-brand-50/50 transition-colors"
                      >
                        <img
                          src={product.images[0] || 'https://via.placeholder.com/60'}
                          alt={product.name}
                          className="w-11 h-11 rounded-lg object-cover bg-gray-100 border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {language === 'km' && product.nameKh ? product.nameKh : product.name}
                          </p>
                          <p className="text-xs text-brand-600 font-bold">
                            ${product.discountPrice ?? product.price} USD
                          </p>
                        </div>
                      </Link>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center py-2.5 text-xs text-brand-600 font-semibold hover:bg-gray-50 transition-colors"
                    >
                      View all results for "{searchQuery}" →
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No products found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-brand-600" />
              <span>{language === 'en' ? 'EN' : 'ខ្មែរ'}</span>
            </button>

            {/* Shopping Cart Drawer Toggle */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors group"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-brand-600 transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white animate-scale">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Login */}
            {isAuthenticated ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full border border-gray-200 hover:border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">{user?.name}</span>
                </button>

                {/* Account Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-bold">
                          Administrator
                        </span>
                      )}
                    </div>

                    <Link
                      to="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <PackageCheck className="w-4 h-4 text-brand-600" />
                      <span>{t('myLibrary')}</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-purple-700 font-medium hover:bg-purple-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-600" />
                        <span>{t('adminDashboard')}</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-gray-700 hover:text-brand-600 hover:bg-gray-100 transition-colors"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="hidden sm:inline-flex px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-sm"
                >
                  {t('register')}
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 rounded-full border border-gray-200 bg-gray-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-600 text-white rounded-full text-[11px] font-semibold"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

