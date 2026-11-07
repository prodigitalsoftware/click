import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  Download,
  Key,
  ShieldCheck,
  PackageCheck,
  FileText,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { orderAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['order-success', id],
    queryFn: () => orderAPI.getOrderById(id!),
    enabled: !!id,
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = async (productId: string, productName: string) => {
    try {
      const res = await orderAPI.downloadProduct(id!, productId, data?.order.downloadToken);
      if (res.success && res.downloadUrl) {
        window.open(res.downloadUrl, '_blank');
      } else {
        alert('Download URL not ready or access denied.');
      }
    } catch (err: any) {
      alert(`Download error: ${err?.response?.data?.message || err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
      </div>
    );
  }

  if (isError || !data?.order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
        <Link to="/" className="mt-4 inline-block px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold">
          Go to Home
        </Link>
      </div>
    );
  }

  const { order } = data;
  const isPaid = order.paymentStatus === 'paid';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Success Banner */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-xs text-center space-y-4">
        <div className="w-18 h-18 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {t('orderSuccessTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
          {t('orderSuccessSubtitle')}
        </p>

        {/* Order Meta Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 font-mono font-bold">
            Order #{order.orderNumber}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('paidStatus')}</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-blue-50 text-brand-700 font-bold">
            ${order.total.toFixed(2)} USD ({(order.total * 4100).toLocaleString()} ៛)
          </span>
        </div>
      </div>

      {/* Unlocked Digital Products Section */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>{t('unlockedProducts')}</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Instant secure access guaranteed. Download your assets or access your credentials below.
            </p>
          </div>
          <Link
            to="/account"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 hidden sm:block"
          >
            {t('goToMyLibrary')} →
          </Link>
        </div>

        {/* Digital Products List */}
        <div className="space-y-4">
          {order.items.map((item, idx) => {
            const title = language === 'km' && item.nameKh ? item.nameKh : item.name;
            const productId = typeof item.product === 'object' ? (item.product as any)._id : item.product;

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3 hover:border-brand-200 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://via.placeholder.com/60'}
                      alt={title}
                      className="w-14 h-14 rounded-xl object-cover bg-white border border-gray-200 flex-shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{title}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {item.type || 'Digital Asset'}
                      </span>
                    </div>
                  </div>

                  {/* Download CTA */}
                  {isPaid ? (
                    <button
                      onClick={() => handleDownload(productId, item.name)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 active:scale-95 transition-all self-start sm:self-auto"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t('downloadNow')}</span>
                    </button>
                  ) : (
                    <span className="text-xs text-amber-600 font-semibold">
                      Payment Verification Pending
                    </span>
                  )}
                </div>

                {/* Access Details / License Info Box */}
                {isPaid && item.digitalAccessInfo && (
                  <div className="p-3 bg-white rounded-xl border border-gray-200/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-gray-500 font-semibold text-[11px]">
                      <span className="flex items-center gap-1 text-gray-700">
                        <Key className="w-3.5 h-3.5 text-amber-500" />
                        <span>{t('accessDetails')}</span>
                      </span>
                      <button
                        onClick={() => handleCopy(item.digitalAccessInfo!)}
                        className="text-brand-600 hover:text-brand-700 flex items-center gap-1 font-bold"
                      >
                        {copiedKey === item.digitalAccessInfo ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Details</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-mono text-gray-800 bg-gray-50 p-2 rounded-lg text-[11px] select-all break-all">
                      {item.digitalAccessInfo}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Customer Care Box */}
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sky-900">
          <div>
            <p className="font-bold">Need assistance with your digital asset setup?</p>
            <p className="text-sky-700 text-[11px] mt-0.5">
              Contact our 24/7 Telegram support with your Order Number #{order.orderNumber}.
            </p>
          </div>
          <a
            href="https://t.me/navasealstore"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-[#0088cc] text-white font-bold text-xs hover:bg-[#0077b5] transition-colors flex-shrink-0"
          >
            Open Telegram Support
          </a>
        </div>
      </div>
    </div>
  );
};

