import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const CartDrawer: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, total, cartDrawerOpen, setCartDrawerOpen } = useCart();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  if (!cartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="font-bold text-lg text-gray-900">{t('shoppingCart')}</h2>
              <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-bold">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setCartDrawerOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-gray-500 font-medium text-sm mb-4">{t('cartEmpty')}</p>
                <button
                  onClick={() => setCartDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-brand-50 text-brand-700 font-semibold text-xs hover:bg-brand-100 transition-colors"
                >
                  {t('continueShopping')}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const title = language === 'km' && item.product.nameKh ? item.product.nameKh : item.product.name;
                const unitPrice =
                  item.product.discountPrice !== undefined && item.product.discountPrice < item.product.price
                    ? item.product.discountPrice
                    : item.product.price;

                return (
                  <div key={item.product._id} className="py-4 flex gap-3.5 items-center">
                    <img
                      src={item.product.images[0] || 'https://via.placeholder.com/80'}
                      alt={title}
                      className="w-16 h-16 rounded-xl object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{title}</h4>
                      <p className="text-xs font-extrabold text-brand-600 mt-0.5">
                        ${unitPrice.toFixed(2)} USD
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            className="p-1 text-gray-500 hover:text-gray-800"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            className="p-1 text-gray-500 hover:text-gray-800"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                          title={t('remove')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between font-extrabold text-base text-gray-900">
                  <span>{t('total')}</span>
                  <span className="text-brand-700">${total.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>≈ In Cambodian Riel (KHR)</span>
                  <span className="font-semibold text-gray-700">{(total * 4100).toLocaleString()} ៛</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setCartDrawerOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 active:scale-[0.99] transition-all"
                >
                  <span>{t('proceedToCheckout')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex justify-between items-center px-1">
                  <button
                    onClick={clearCart}
                    className="text-xs text-gray-400 hover:text-rose-600 transition-colors"
                  >
                    {t('clearCart')}
                  </button>
                  <button
                    onClick={() => setCartDrawerOpen(false)}
                    className="text-xs text-brand-600 font-semibold hover:underline"
                  >
                    {t('continueShopping')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

