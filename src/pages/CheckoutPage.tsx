import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  User,
  Mail,
  Phone,
  Send,
  FileText,
  Lock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { orderAPI, paymentAPI } from '../services/api';
import { Order, Payment } from '../types';
import { KHQRPaymentModal } from '../components/KHQRPaymentModal';

export const CheckoutPage: React.FC = () => {
  const { items, total, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  // Customer form inputs
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [telegram, setTelegram] = useState('');
  const [note, setNote] = useState('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'KHQR'>('KHQR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [activePayment, setActivePayment] = useState<Payment | null>(null);
  const [showKHQRModal, setShowKHQRModal] = useState(false);

  if (items.length === 0 && !activeOrder) {
    navigate('/cart');
    return null;
  }

  const handleCreateOrderAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please provide your full name, email, and phone number.');
      return;
    }

    try {
      setLoading(true);

      // 1. Create Pending Order on Backend
      const orderPayload = {
        items: items.map((i) => ({ productId: i.product._id, quantity: i.quantity })),
        customerDetails: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          telegram: telegram.trim(),
          note: note.trim(),
        },
        currency: 'USD' as const,
        paymentMethod: 'KHQR',
      };

      const orderRes = await orderAPI.createOrder(orderPayload);
      if (!orderRes.success || !orderRes.order) {
        throw new Error(orderRes.message || 'Failed to initialize order');
      }

      const createdOrder = orderRes.order;
      setActiveOrder(createdOrder);

      // 2. Request Bakong KHQR Payment Payload from Backend
      const paymentRes = await paymentAPI.createKHQR(createdOrder._id);
      if (!paymentRes.success || !paymentRes.payment) {
        throw new Error(paymentRes.message || 'Failed to generate Bakong KHQR');
      }

      setActivePayment(paymentRes.payment);
      setShowKHQRModal(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paidOrder: Order) => {
    setShowKHQRModal(false);
    clearCart();
    navigate(`/order-success/${paidOrder._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {t('checkoutTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Instant digital delivery with secure Bakong KHQR verification
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleCreateOrderAndPay} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Customer Form & Payment Method */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Details Box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              <span>{t('customerInfo')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('fullName')} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sophea Sok"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('emailAddress')} * (For delivery)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sophea@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('phoneNumber')} *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+855 12 345 678"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('telegramUsername')}
                </label>
                <div className="relative">
                  <Send className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="@sophea_kh"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t('orderNote')}
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any special request or customization instructions..."
                className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-600" />
              <span>{t('paymentMethod')}</span>
            </h3>

            {/* Bakong KHQR Option */}
            <div className="relative p-4 rounded-2xl border-2 border-[#e11d48] bg-rose-50/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e11d48] text-white flex items-center justify-center font-black text-xs shadow-sm">
                  KHQR
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-900">
                    Cambodian Bakong KHQR
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Scan with ABA, Acleda, Wing, or any Cambodian bank mobile app
                  </p>
                </div>
              </div>

              <div className="w-5 h-5 rounded-full border-2 border-[#e11d48] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-gray-900 pb-3 border-b border-gray-100">
              {t('orderSummary')}
            </h3>

            {/* Items Mini List */}
            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => {
                const title = language === 'km' && item.product.nameKh ? item.product.nameKh : item.product.name;
                const unitPrice =
                  item.product.discountPrice !== undefined && item.product.discountPrice < item.product.price
                    ? item.product.discountPrice
                    : item.product.price;

                return (
                  <div key={item.product._id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-800 truncate">{title}</p>
                      <p className="text-gray-400 text-[10px]">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-gray-900">
                      ${(unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-gray-900">${subtotal.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('discount')}</span>
                <span className="font-bold text-emerald-600">$0.00</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex justify-between text-base font-black text-gray-900">
                <span>{t('total')}</span>
                <span className="text-brand-700">${total.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>≈ In Cambodian Riel (KHR)</span>
                <span className="font-bold text-gray-700">{(total * 4100).toLocaleString()} ៛</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                'Generating KHQR...'
              ) : (
                <>
                  <span>{t('placeOrder')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>100% Encrypted & Authenticated checkout</span>
            </p>
          </div>
        </div>
      </form>

      {/* KHQR Interactive Modal */}
      {showKHQRModal && activeOrder && activePayment && (
        <KHQRPaymentModal
          order={activeOrder}
          payment={activePayment}
          onClose={() => setShowKHQRModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

