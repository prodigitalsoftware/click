import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Zap, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { language, t } = useLanguage();

  const title = language === 'km' && product.nameKh ? product.nameKh : product.name;
  const price = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const khrPrice = (price * 4100).toLocaleString();

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'course':
        return language === 'km' ? 'វគ្គសិក្សា' : 'Course';
      case 'software':
        return language === 'km' ? 'កម្មវិធី' : 'Software';
      case 'account':
        return language === 'km' ? 'គណនី' : 'Account';
      case 'prompt':
        return language === 'km' ? 'Prompts' : 'Prompt';
      case 'ebook':
        return language === 'km' ? 'សៀវភៅ' : 'E-Book';
      case 'service':
        return language === 'km' ? 'សេវាកម្ម' : 'Service';
      default:
        return 'Digital';
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Thumbnail */}
      <Link to={`/product/${product.slug}`} className="relative block aspect-[16/10] bg-gray-50 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-sm text-brand-700 shadow-sm">
            {getTypeLabel(product.type)}
          </span>
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white shadow-sm animate-pulse">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Instant Digital Tag */}
        <div className="absolute bottom-2 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium text-emerald-300">
          <Zap className="w-2.5 h-2.5" />
          <span>{t('instantDownloadBadge')}</span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5 text-xs text-gray-500">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="font-semibold text-gray-800">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-gray-400">({product.numReviews})</span>
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="block font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2 text-sm leading-snug mb-2"
          >
            {title}
          </Link>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-3 border-t border-gray-50 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-brand-700">${price.toFixed(2)}</span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
              )}
            </div>
            <div className="text-[11px] font-medium text-gray-400">≈ {khrPrice} ៛</div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="flex items-center justify-center p-2.5 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white transition-all shadow-sm active:scale-95"
            title={t('addToCart')}
            aria-label={t('addToCart')}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

