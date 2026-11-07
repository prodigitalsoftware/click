import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse space-y-3">
      <div className="aspect-[16/10] bg-gray-200 rounded-xl"></div>
      <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
      <div className="pt-2 flex justify-between items-center">
        <div className="h-5 bg-gray-200 rounded-md w-1/3"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export const CategorySkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse flex flex-col items-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-200 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded-md w-2/3 mb-1.5"></div>
      <div className="h-3 bg-gray-200 rounded-md w-1/3"></div>
    </div>
  );
};

