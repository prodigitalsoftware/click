import React, { useState } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TelegramChatButton: React.FC = () => {
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const telegramLink = 'https://t.me/navasealstore';

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover Bubble */}
      {open && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-bold text-xs text-gray-900">
                {language === 'km' ? 'ជំនួយការ NAVASEAL' : 'NAVASEAL Support'}
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-gray-600 mt-2 leading-relaxed">
            {language === 'km'
              ? 'សួស្តី! តើអ្នកត្រូវការជំនួយក្នុងការទិញ ឬដំឡើងផលិតផលមែនទេ? ជជែកជាមួយក្រុមការងារយើងតាម Telegram ឥឡូវនេះ!'
              : 'Hello! Need assistance with digital products, activation, or KHQR payments? Chat with our team on Telegram!'}
          </p>

          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full py-2 px-3 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t('telegramSupport')}</span>
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-[#0088cc] hover:bg-[#0077b5] text-white shadow-xl shadow-sky-500/30 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group"
        aria-label="Telegram Customer Support"
      >
        <Send className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
      </button>
    </div>
  );
};

