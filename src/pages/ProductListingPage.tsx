import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Filter,
  SlidersHorizontal,
  Search,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  X,
} from 'lucide-react';
import { productAPI, categoryAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductSkeleton } from '../components/LoadingSkeleton';
import { useLanguage } from '../context/LanguageContext';

export const ProductListingPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentType = searchParams.get('type') || '';

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getCategories(),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', currentSearch, currentCategory, currentSort, currentPage, currentType],
    queryFn: () =>
      productAPI.getProducts({
        search: currentSearch || undefined,
        category: currentCategory || undefined,
        sort: currentSort,
        page: currentPage,
        type: currentType || undefined,
        limit: 12,
      }),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      params.set('search', searchInput.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const setCategoryFilter = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    setSearchParams(params);
    setMobileFilterOpen(false);
  };

  const setSortOption = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', sort);
    params.set('page', '1');
    setSearchParams(params);
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {t('products')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {data?.pagination.total ?? 0} {language === 'km' ? 'ផលិតផលឌីជីថល' : 'digital products found'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>Filter</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 hidden sm:inline">Sort:</span>
            <select
              value={currentSort}
              onChange={(e) => setSortOption(e.target.value)}
              className="py-2 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="newest">Latest Releases</option>
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters Desktop */}
        <aside className="hidden lg:block space-y-6">
          {/* Search in Catalog */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Search Catalog</h3>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Categories List */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                {t('categoriesTitle')}
              </h3>
              {currentCategory && (
                <button
                  onClick={() => setCategoryFilter('')}
                  className="text-[11px] text-brand-600 font-semibold hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-1 text-xs">
              <button
                onClick={() => setCategoryFilter('')}
                className={`w-full text-left px-3 py-2 rounded-xl font-medium transition-colors ${
                  !currentCategory
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t('allCategories')}
              </button>

              {categoriesData?.categories.map((cat) => {
                const isSelected = currentCategory === cat.slug;
                const name = language === 'km' && cat.nameKh ? cat.nameKh : cat.name;
                return (
                  <button
                    key={cat._id}
                    onClick={() => setCategoryFilter(cat.slug)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors ${
                      isSelected
                        ? 'bg-brand-50 text-brand-700 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="truncate">{name}</span>
                    {cat.productCount !== undefined && (
                      <span className="text-[10px] text-gray-400">{cat.productCount}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : data?.products && data.products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {data.pagination.totalPages > 1 && (
                <div className="pt-6 border-t border-gray-100 flex items-center justify-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setPage(currentPage - 1)}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: data.pagination.totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          pageNum === currentPage
                            ? 'bg-brand-600 text-white shadow-sm'
                            : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage >= data.pagination.totalPages}
                    onClick={() => setPage(currentPage + 1)}
                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="py-20 bg-white rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-300 flex items-center justify-center mb-4">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">No products found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                We couldn't find any digital products matching your current filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-brand-50 text-brand-600 text-xs font-bold hover:bg-brand-100 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

