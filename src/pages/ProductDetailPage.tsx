import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Star,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { user, isAuthenticated, setAuthModalOpen } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');

  // Review form states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getProductById(id!),
    enabled: !!id,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['product-reviews', data?.product._id],
    queryFn: () => productAPI.getReviews(data!.product._id),
    enabled: !!data?.product._id,
  });

  const reviewMutation = useMutation({
    mutationFn: (newReview: { rating: number; comment: string; userName?: string }) =>
      productAPI.createReview(data!.product._id, newReview),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', data?.product._id] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      setReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 3000);
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-[4/3] bg-gray-200 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
        <p className="text-xs text-gray-500 mt-1">The product you requested does not exist or was removed.</p>
        <Link
          to="/products"
          className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const { product, related } = data;
  const title = language === 'km' && product.nameKh ? product.nameKh : product.name;
  const description = language === 'km' && product.descriptionKh ? product.descriptionKh : product.description;
  const price = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice !== undefined && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    reviewMutation.mutate({
      rating: reviewRating,
      comment: reviewComment.trim(),
      userName: user?.name,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-3xl bg-gray-50 border border-gray-100 overflow-hidden relative shadow-sm">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-rose-500 text-white font-black text-xs rounded-full shadow-md">
                SAVE {discountPercent}%
              </span>
            )}
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-semibold text-emerald-300">
              <Zap className="w-3.5 h-3.5" />
              <span>{t('instantDownloadBadge')}</span>
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === idx
                      ? 'border-brand-600 ring-2 ring-brand-500/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700">
                {typeof product.category === 'object' ? product.category.name : 'Digital Asset'}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="font-bold text-gray-900">{product.rating.toFixed(1)}</span>
                <span>({product.numReviews} {t('reviews')})</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {title}
            </h1>

            {/* Pricing Section */}
            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-brand-700">${price.toFixed(2)} USD</span>
                {hasDiscount && (
                  <span className="text-base text-gray-400 line-through">
                    ${product.price.toFixed(2)} USD
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-gray-500">
                ≈ In Cambodian Riel: <strong className="text-gray-800">{(price * 4100).toLocaleString()} ៛</strong>
              </p>
            </div>

            {/* In-Stock & Delivery Guarantee */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600">
              <div className="flex items-center gap-1.5 text-emerald-600">
                <Check className="w-4 h-4" />
                <span>{t('inStock')} ({product.stock} items)</span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-600">
                <ShieldCheck className="w-4 h-4" />
                <span>Bakong KHQR Instant Verification</span>
              </div>
            </div>

            {/* Key feature preview list */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                {product.specifications.slice(0, 4).map((spec, i) => (
                  <div key={i} className="text-xs bg-white p-2.5 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">{spec.key}</span>
                    <span className="font-semibold text-gray-800">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Purchase Controls */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-700">{t('itemQuantity')}:</span>
              <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-gray-500 hover:text-gray-800"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-gray-500 hover:text-gray-800"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => addToCart(product, quantity)}
                className="py-3.5 px-4 rounded-xl border-2 border-brand-600 text-brand-600 hover:bg-brand-50 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t('addToCart')}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all active:scale-95"
              >
                <Zap className="w-4 h-4" />
                <span>{t('buyNow')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Overview, Specifications, Reviews */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="border-b border-gray-100 flex gap-4 px-6 pt-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t('productOverview')}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t('specifications')}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t('customerReviews')} ({reviewsData?.reviews.length ?? product.numReviews})
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'overview' && (
            <div className="prose max-w-none text-xs sm:text-sm text-gray-600 leading-relaxed space-y-4">
              <p className="whitespace-pre-line">{description}</p>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-900 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-brand-800 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-brand-600" />
                  <span>{t('howToAccess')}</span>
                </h4>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Upon completion of Bakong KHQR verification, download links, source code, and login credentials unlock immediately in your Customer Library and Order Receipt screen.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="divide-y divide-gray-100 max-w-2xl text-xs">
              {product.specifications && product.specifications.length > 0 ? (
                product.specifications.map((spec, i) => (
                  <div key={i} className="py-3 flex justify-between">
                    <span className="font-semibold text-gray-500">{spec.key}</span>
                    <span className="font-bold text-gray-900">{spec.value}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 py-4">Standard digital product specifications apply.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Add Review Form */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 max-w-xl">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-800 mb-3">
                  {t('writeReview')}
                </h4>
                {reviewSuccess && (
                  <div className="mb-3 p-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">
                    Thank you! Your review has been published.
                  </div>
                )}
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Rating</label>
                    <div className="flex gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Comment</label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this digital product..."
                      className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewMutation.isPending}
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm disabled:opacity-50"
                  >
                    {reviewMutation.isPending ? 'Submitting...' : t('submitReview')}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 max-w-2xl divide-y divide-gray-100">
                {reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
                  reviewsData.reviews.map((rev) => (
                    <div key={rev._id} className="pt-4 first:pt-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900">{rev.userName}</span>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{rev.comment}</p>
                      <span className="text-[10px] text-gray-400 block">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400">No reviews yet. Be the first to leave a review!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related && related.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-900">{t('relatedProducts')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

