import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  PackageCheck,
  Clock,
  Download,
  Key,
  ShieldCheck,
  User as UserIcon,
  ShoppingBag,
  ExternalLink,
  QrCode,
} from 'lucide-react';
import { orderAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Order, Payment } from '../types';
import { KHQRPaymentModal } from '../components/KHQRPaymentModal';

export const AccountPage: React.FC = () => {
  const { user, isAuthenticated, setAuthModalOpen } = useAuth();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'library' | 'orders' | 'profile'>('library');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activePayment, setActivePayment] = useState<Payment | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderAPI.getMyOrders(),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="text-xs text-gray-500 mt-1 mb-6">
          Log in to access your digital library, order receipts, and account settings.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition-colors shadow-md"
        >
          {t('login')} / {t('register')}
        </button>
      </div>
    );
  }

  const orders = data?.orders || [];
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');

  // Collect all purchased items across paid orders
  const allPurchasedItems = paidOrders.flatMap((order) =>
    order.items.map((item) => ({
      ...item,
      orderId: order._id,
      orderNumber: order.orderNumber,
      paidAt: order.paidAt || order.createdAt,
    }))
  );

  const handleDownload = async (orderId: string, productId: string) => {
    try {
      const res = await orderAPI.downloadProduct(orderId, productId);
      if (res.success && res.downloadUrl) {
        window.open(res.downloadUrl, '_blank');
      }
    } catch (err: any) {
      alert(`Download error: ${err?.response?.data?.message || err.message}`);
    }
  };

  const handlePayPendingOrder = async (order: Order) => {
    try {
      const res = await paymentAPI.createKHQR(order._id);
      if (res.success && res.payment) {
        setSelectedOrder(order);
        setActivePayment(res.payment);
        setShowPayModal(true);
      }
    } catch (err: any) {
      alert(`Failed to launch payment: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Overview Header */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-brand-500/20">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">{user?.name}</h1>
            <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold">
            {allPurchasedItems.length} Products Owned
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
            {orders.length} Orders Total
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="border-b border-gray-100 flex gap-4 px-6 pt-4">
          <button
            onClick={() => setActiveTab('library')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'library'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>{t('myLibrary')}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{t('myOrders')} ({orders.length})</span>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Library Tab */}
          {activeTab === 'library' && (
            <div>
              {allPurchasedItems.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <PackageCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-xs font-medium">{t('noDownloadsYet')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allPurchasedItems.map((item, idx) => {
                    const productId = typeof item.product === 'object' ? (item.product as any)._id : item.product;

                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-brand-200 transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={item.image || 'https://via.placeholder.com/60'}
                            alt=""
                            className="w-14 h-14 rounded-xl object-cover bg-white border border-gray-200 flex-shrink-0"
                          />
                          <div>
                            <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-1">
                              {language === 'km' && item.nameKh ? item.nameKh : item.name}
                            </h3>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              Order #{item.orderNumber} • {new Date(item.paidAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {item.digitalAccessInfo && (
                          <div className="p-2.5 rounded-xl bg-white border border-gray-200/70 text-[11px] font-mono text-gray-700 select-all">
                            {item.digitalAccessInfo}
                          </div>
                        )}

                        <button
                          onClick={() => handleDownload(item.orderId, productId)}
                          className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{t('downloadFile')}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-xs font-medium">{t('noOrdersYet')}</p>
                </div>
              ) : (
                orders.map((order) => {
                  const isPaid = order.paymentStatus === 'paid';
                  const isPending = order.paymentStatus === 'pending';

                  return (
                    <div key={order._id} className="py-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-gray-900 font-mono">
                            #{order.orderNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isPaid
                                ? 'bg-emerald-50 text-emerald-700'
                                : isPending
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {order.items.length} items • ${order.total.toFixed(2)} USD •{' '}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {isPending && (
                          <button
                            onClick={() => handlePayPendingOrder(order)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#e11d48] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#c9183e] transition-colors"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Pay KHQR</span>
                          </button>
                        )}

                        {isPaid && (
                          <button
                            onClick={() => setActiveTab('library')}
                            className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 text-xs font-bold hover:bg-brand-100 transition-colors"
                          >
                            Access Downloads
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pay Modal for pending orders */}
      {showPayModal && selectedOrder && activePayment && (
        <KHQRPaymentModal
          order={selectedOrder}
          payment={activePayment}
          onClose={() => setShowPayModal(false)}
          onPaymentSuccess={() => {
            setShowPayModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
};

