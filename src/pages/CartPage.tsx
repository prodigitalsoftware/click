import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, total, subtotal } = useCart();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{t('cartEmpty')}</h2>
        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
          Add items from our catalog of digital courses, AI tools, accounts, and prompts.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md hover:bg-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('continueShopping')}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {t('shoppingCart')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {items.reduce((s, i) => s + i.quantity, 0)} items ready for instant checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-rose-600 font-semibold transition-colors"
        >
          {t('clearCart')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs divide-y divide-gray-100 overflow-hidden">
            {items.map((item) => {
              const title = language === 'km' && item.product.nameKh ? item.product.nameKh : item.product.name;
              const unitPrice =
                item.product.discountPrice !== undefined && item.product.discountPrice < item.product.price
                  ? item.product.discountPrice
                  : item.product.price;

              return (
                <div key={item.product._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.images[0] || 'https://via.placeholder.com/80'}
                      alt={title}
                      className="w-18 h-18 rounded-2xl object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                    />
                    <div>
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="font-bold text-sm text-gray-900 hover:text-brand-600 transition-colors line-clamp-1"
                      >
                        {title}
                      </Link>
                      <p className="text-xs font-black text-brand-700 mt-0.5">
                        ${unitPrice.toFixed(2)} USD
                      </p>
                      <span className="text-[10px] text-gray-400">
                        ≈ {(unitPrice * 4100).toLocaleString()} ៛
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-center">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="p-1.5 text-gray-500 hover:text-gray-800"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="p-1.5 text-gray-500 hover:text-gray-800"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="font-extrabold text-sm text-gray-900">
                        ${(unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title={t('remove')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('continueShopping')}</span>
          </Link>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs h-fit space-y-5">
          <h3 className="font-extrabold text-base text-gray-900 pb-3 border-b border-gray-100">
            {t('orderSummary')}
          </h3>

          <div className="space-y-2.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>{t('subtotal')}</span>
              <span className="font-bold text-gray-900">${subtotal.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span>{t('discount')}</span>
              <span className="font-bold text-emerald-600">$0.00</span>
            </div>
            <div className="pt-3 border-t border-gray-100 flex justify-between text-sm font-extrabold text-gray-900">
              <span>{t('total')}</span>
              <span className="text-brand-700">${total.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Equivalent in KHR</span>
              <span className="font-bold text-gray-700">{(total * 4100).toLocaleString()} ៛</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all active:scale-95"
          >
            <span>{t('proceedToCheckout')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

