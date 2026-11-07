import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, authMode, setAuthMode, login, register } = useAuth();
  const { language, t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, phone);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@navaseal.site');
    setPassword('Admin@123456');
    setAuthMode('login');
  };

  const fillDemoCustomer = () => {
    setEmail('customer@navaseal.site');
    setPassword('Customer@123456');
    setAuthMode('login');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden relative">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-brand-600 to-blue-600 p-6 text-white relative">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute right-4 top-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="text-xl font-extrabold tracking-tight">
            {authMode === 'login' ? t('login') : t('register')}
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            {authMode === 'login'
              ? 'Access your purchased digital products and orders'
              : 'Join NAVASEALSTORE to unlock instant downloads'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Quick Demo Fill Buttons */}
          <div className="mb-5 p-3 rounded-2xl bg-brand-50 border border-brand-100/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-800 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Demo Quick-Fill:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="py-1.5 px-2 bg-white rounded-xl border border-brand-200 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition-colors shadow-xs"
              >
                Demo Admin 👑
              </button>
              <button
                type="button"
                onClick={fillDemoCustomer}
                className="py-1.5 px-2 bg-white rounded-xl border border-brand-200 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition-colors shadow-xs"
              >
                Demo Customer 🛍️
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('fullName')}
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
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {t('emailAddress')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                />
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('phoneNumber')} (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+855 12 345 678"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
            >
              {loading
                ? 'Processing...'
                : authMode === 'login'
                ? t('login')
                : t('register')}
            </button>
          </form>

          {/* Toggle between login and register */}
          <div className="mt-5 text-center text-xs text-gray-500">
            {authMode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-brand-600 font-bold hover:underline"
                >
                  {t('register')}
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-brand-600 font-bold hover:underline"
                >
                  {t('login')}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

