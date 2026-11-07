import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('navaseal_lang');
    return saved === 'km' ? 'km' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('navaseal_lang', language);
    document.documentElement.lang = language;
    if (language === 'km') {
      document.body.classList.add('font-khmer');
    } else {
      document.body.classList.remove('font-khmer');
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'km' : 'en'));
  };

  const t = (key: keyof typeof translations['en']): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || (key as string);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

