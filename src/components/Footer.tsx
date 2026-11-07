import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Send, Mail, Phone, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-white border-t border-gray-100 text-gray-600 mt-20">
      {/* Top Value Badges Bar */}
      <div className="border-b border-gray-100 py-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mb-2 font-bold text-base">
                ⚡
              </div>
              <h4 className="text-xs font-bold text-gray-900">{t('perk1Title')}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Direct link & keys instantly</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-2 font-bold text-base">
                🇰🇭
              </div>
              <h4 className="text-xs font-bold text-gray-900">{t('perk2Title')}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">ABA, Acleda, Wing, Bakong</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 font-bold text-base">
                ✓
              </div>
              <h4 className="text-xs font-bold text-gray-900">{t('perk3Title')}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">100% Guaranteed authentic</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-2 font-bold text-base">
                💬
              </div>
              <h4 className="text-xs font-bold text-gray-900">{t('perk4Title')}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Live Telegram Assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-brand-500/20">
                NV
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900">
                NAVASEAL<span className="text-brand-600">STORE</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              {t('footerDesc')}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-brand-600" />
                support@navaseal.site
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-brand-600" />
                +855 96 888 9922
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-3">
              {t('categoriesTitle')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/products?category=ai-tools-software" className="hover:text-brand-600 transition-colors">
                  {t('aiTools')}
                </Link>
              </li>
              <li>
                <Link to="/products?category=digital-courses" className="hover:text-brand-600 transition-colors">
                  {t('digitalCourses')}
                </Link>
              </li>
              <li>
                <Link to="/products?category=tiktok-accounts" className="hover:text-brand-600 transition-colors">
                  {t('tiktokAccounts')}
                </Link>
              </li>
              <li>
                <Link to="/products?category=ai-prompts" className="hover:text-brand-600 transition-colors">
                  {t('aiPrompts')}
                </Link>
              </li>
              <li>
                <Link to="/products?category=web-system-dev" className="hover:text-brand-600 transition-colors">
                  {t('developmentServices')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-3">
              Support & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://t.me/navasealstore"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sky-600 hover:text-sky-700 font-medium"
                >
                  <Send className="w-3 h-3" />
                  <span>Telegram Support</span>
                </a>
              </li>
              <li>
                <Link to="/account" className="hover:text-brand-600 transition-colors">
                  {t('myLibrary')}
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-brand-600 transition-colors">
                  {t('orderHistory')}
                </Link>
              </li>
              <li>
                <span className="text-gray-400 cursor-default">{t('privacyPolicy')}</span>
              </li>
              <li>
                <span className="text-gray-400 cursor-default">{t('termsOfService')}</span>
              </li>
            </ul>
          </div>

          {/* Payment Badges */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-3">
              {t('acceptedPayments')}
            </h4>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#e11d48]"></span>
                <span>Bakong KHQR Official</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Instant scan with ABA Mobile, Acleda toUS, Wing, Canadia, Sathapana, and 30+ Cambodian banking apps.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>{t('copyright')}</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for Cambodian Creators</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

