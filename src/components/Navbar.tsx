import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sparkles,
  Cpu,
  GraduationCap,
  Smartphone,
  BookOpen,
  Code,
  LayoutGrid,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();

  const navItems = [
    { name: t('allCategories'), path: '/products', icon: LayoutGrid },
    { name: t('aiTools'), path: '/products?category=ai-tools-software', icon: Cpu },
    { name: t('digitalCourses'), path: '/products?category=digital-courses', icon: GraduationCap },
    { name: t('tiktokAccounts'), path: '/products?category=tiktok-accounts', icon: Smartphone },
    { name: t('aiPrompts'), path: '/products?category=ai-prompts', icon: Sparkles },
    { name: t('digitalBooks'), path: '/products?category=digital-books', icon: BookOpen },
    { name: t('developmentServices'), path: '/products?category=web-system-dev', icon: Code },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto py-2 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 text-brand-600" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

