import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  Cpu,
  GraduationCap,
  Smartphone,
  BookOpen,
  Code,
} from 'lucide-react';
import { productAPI, categoryAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { ProductSkeleton, CategorySkeleton } from '../components/LoadingSkeleton';
import { useLanguage } from '../context/LanguageContext';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  // Fetch Featured Products
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productAPI.getProducts({ featured: 'true', limit: 8 }),
  });

  // Fetch Best Sellers / Popular Products
  const { data: popularData, isLoading: popularLoading } = useQuery({
    queryKey: ['popular-products'],
    queryFn: () => productAPI.getProducts({ sort: 'popular', limit: 4 }),
  });

  // Fetch Categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getCategories(),
  });

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-transparent pt-10 sm:pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold shadow-xs animate-in fade-in duration-500">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>{t('heroBadge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
              {language === 'km' ? (
                <>
                  ពង្រីកអាជីវកម្មរបស់អ្នកជាមួយ <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600">
                    ផលិតផលឌីជីថលគុណភាពខ្ពស់
                  </span>
                </>
              ) : (
                <>
                  Level Up Your Business With <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600">
                    Premium Digital Assets
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {t('heroSubtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/products"
                className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-brand-500/25 active:scale-95 transition-all"
              >
                <span>{t('exploreCatalog')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#categories"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-sm shadow-xs active:scale-95 transition-all"
              >
                {t('categoriesTitle')}
              </a>
            </div>

            {/* Social Proof Stats */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-gray-100 max-w-xl mx-auto text-center">
              <div>
                <p className="text-xl sm:text-2xl font-black text-gray-900">10,000+</p>
                <p className="text-xs text-gray-500 mt-0.5">{t('happyCustomers')}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-brand-600">⚡ 100%</p>
                <p className="text-xs text-gray-500 mt-0.5">{t('instantDelivery')}</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-600">24/7</p>
                <p className="text-xs text-gray-500 mt-0.5">{t('bakongSupported')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">{t('categoriesTitle')}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {language === 'km'
                ? 'ស្វែងរកផលិតផលតាមប្រភេទដែលអ្នកចាប់អារម្មណ៍'
                : 'Explore assets curated across key digital domains'}
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoriesLoading
            ? Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)
            : categoriesData?.categories.map((cat) => (
                <CategoryCard key={cat._id} category={cat} />
              ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-600"></span>
              <h2 className="text-2xl font-extrabold text-gray-900">{t('featuredProducts')}</h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {language === 'km'
                ? 'ផលិតផលពេញនិយម និងមានការទាញយកច្រើនបំផុត'
                : 'Top verified tools, courses, and accounts with instant activation'}
            </p>
          </div>
          <Link
            to="/products?featured=true"
            className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredLoading
            ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
            : featuredData?.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
        </div>
      </section>

      {/* Best Selling Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-blue-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  🔥 {t('popularProducts')}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {language === 'km' ? 'ជម្រើសកំពូលប្រចាំខែ' : 'Trending Monthly Bestsellers'}
                </h3>
              </div>
              <Link
                to="/products?sort=popular"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-sm transition-colors self-start md:self-auto"
              >
                <span>{t('viewAll')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularLoading
                ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
                : popularData?.products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Feature Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {t('whyChooseUs')}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">{t('whySubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-gray-900 mb-1.5">{t('perk1Title')}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{t('perk1Desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-gray-900 mb-1.5">{t('perk2Title')}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{t('perk2Desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-gray-900 mb-1.5">{t('perk3Title')}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{t('perk3Desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-gray-900 mb-1.5">{t('perk4Title')}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{t('perk4Desc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

