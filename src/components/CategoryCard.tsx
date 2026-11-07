import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, GraduationCap, Smartphone, Sparkles, BookOpen, Code, Folder } from 'lucide-react';
import { Category } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CategoryCardProps {
  category: Category;
}

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  GraduationCap,
  Smartphone,
  Sparkles,
  BookOpen,
  Code,
  Folder,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { language } = useLanguage();
  const Icon = iconMap[category.icon || 'Folder'] || Folder;
  const name = language === 'km' && category.nameKh ? category.nameKh : category.name;

  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group relative flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-gray-100 hover:border-brand-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-bold text-sm text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
        {name}
      </h3>
      {category.productCount !== undefined && (
        <span className="text-xs text-gray-400 mt-1">
          {category.productCount} {language === 'km' ? 'ផលិតផល' : 'items'}
        </span>
      )}
    </Link>
  );
};

