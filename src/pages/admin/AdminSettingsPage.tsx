import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Store, Send, ShieldCheck, Check } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { StoreSettings } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => adminAPI.getSettings(),
  });

  const [storeName, setStoreName] = useState('');
  const [storeNameKh, setStoreNameKh] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [telegramSupportUrl, setTelegramSupportUrl] = useState('');
  const [storeAnnouncement, setStoreAnnouncement] = useState('');
  const [storeAnnouncementKh, setStoreAnnouncementKh] = useState('');
  const [exchangeRateUSDToKHR, setExchangeRateUSDToKHR] = useState(4100);
  const [bakongAccountId, setBakongAccountId] = useState('');
  const [bakongMerchantName, setBakongMerchantName] = useState('');
  const [bakongMerchantCity, setBakongMerchantCity] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (data?.settings) {
      const s = data.settings;
      setStoreName(s.storeName || 'NAVASEALSTORE');
      setStoreNameKh(s.storeNameKh || 'ណាវ៉ាស៊ីលស្ត័រ');
      setContactEmail(s.contactEmail || 'support@navaseal.site');
      setContactPhone(s.contactPhone || '+855 96 888 9922');
      setTelegramSupportUrl(s.telegramSupportUrl || 'https://t.me/navasealstore');
      setStoreAnnouncement(s.storeAnnouncement || '');
      setStoreAnnouncementKh(s.storeAnnouncementKh || '');
      setExchangeRateUSDToKHR(s.exchangeRateUSDToKHR || 4100);
      setBakongAccountId(s.bakongAccountId || 'navaseal_store@aclb');
      setBakongMerchantName(s.bakongMerchantName || 'NAVASEAL STORE');
      setBakongMerchantCity(s.bakongMerchantCity || 'Phnom Penh');
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<StoreSettings>) => adminAPI.updateSettings(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      storeName,
      storeNameKh,
      contactEmail,
      contactPhone,
      telegramSupportUrl,
      storeAnnouncement,
      storeAnnouncementKh,
      exchangeRateUSDToKHR: Number(exchangeRateUSDToKHR),
      bakongAccountId,
      bakongMerchantName,
      bakongMerchantCity,
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-gray-500 animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Store Settings</h1>
        <p className="text-xs text-gray-500 mt-1">Configure brand details, Bakong merchant info, and support links</p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* General Store Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-brand-600" />
            <span>Store Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Store Name (English)</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Store Name (Khmer)</label>
              <input
                type="text"
                value={storeNameKh}
                onChange={(e) => setStoreNameKh(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500 font-khmer"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Support Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Support Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Telegram Support URL</label>
              <input
                type="url"
                value={telegramSupportUrl}
                onChange={(e) => setTelegramSupportUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Exchange Rate (USD to KHR)</label>
              <input
                type="number"
                value={exchangeRateUSDToKHR}
                onChange={(e) => setExchangeRateUSDToKHR(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-gray-900">Announcement Bar</h3>
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Announcement Text (EN)</label>
              <input
                type="text"
                value={storeAnnouncement}
                onChange={(e) => setStoreAnnouncement(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Announcement Text (Khmer)</label>
              <input
                type="text"
                value={storeAnnouncementKh}
                onChange={(e) => setStoreAnnouncementKh(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500 font-khmer"
              />
            </div>
          </div>
        </div>

        {/* Bakong KHQR Merchant Configuration */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]"></span>
            <span>Bakong KHQR Merchant Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Bakong Account ID</label>
              <input
                type="text"
                value={bakongAccountId}
                onChange={(e) => setBakongAccountId(e.target.value)}
                placeholder="e.g. navaseal_store@aclb"
                className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Merchant Name (Tag 59)</label>
              <input
                type="text"
                value={bakongMerchantName}
                onChange={(e) => setBakongMerchantName(e.target.value)}
                placeholder="NAVASEAL STORE"
                className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Merchant City (Tag 60)</label>
              <input
                type="text"
                value={bakongMerchantCity}
                onChange={(e) => setBakongMerchantCity(e.target.value)}
                placeholder="Phnom Penh"
                className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{updateMutation.isPending ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

