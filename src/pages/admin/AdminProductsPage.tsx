import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Check,
  X,
  Zap,
  Image as ImageIcon,
  Key,
} from 'lucide-react';
import { productAPI, categoryAPI, adminAPI } from '../../services/api';
import { Product } from '../../types';

export const AdminProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [nameKh, setNameKh] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionKh, setDescriptionKh] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('software');
  const [images, setImages] = useState<string[]>(['']);
  const [digitalDownloadUrl, setDigitalDownloadUrl] = useState('');
  const [digitalAccessInfo, setDigitalAccessInfo] = useState('');
  const [stock, setStock] = useState<number>(999);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [featured, setFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getCategories(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', searchTerm, categoryFilter],
    queryFn: () =>
      productAPI.getProducts({
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        status: 'all',
        limit: 50,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (newProd: Partial<Product>) => productAPI.createProduct(newProd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      productAPI.updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productAPI.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setNameKh('');
    setSlug('');
    setDescription('');
    setDescriptionKh('');
    setPrice(19.99);
    setDiscountPrice(undefined);
    setCategory(categoriesData?.categories[0]?._id || '');
    setType('software');
    setImages(['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80']);
    setDigitalDownloadUrl('https://storage.googleapis.com/navaseal-downloads/sample.zip');
    setDigitalAccessInfo('Activation License Key: NAVA-SAMPLE-1234. Full installation instructions included.');
    setStock(999);
    setStatus('published');
    setFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setNameKh(prod.nameKh || '');
    setSlug(prod.slug);
    setDescription(prod.description);
    setDescriptionKh(prod.descriptionKh || '');
    setPrice(prod.price);
    setDiscountPrice(prod.discountPrice);
    setCategory(typeof prod.category === 'object' ? (prod.category as any)._id : prod.category);
    setType(prod.type);
    setImages(prod.images.length > 0 ? prod.images : ['']);
    setDigitalDownloadUrl(prod.digitalDownloadUrl || '');
    setDigitalAccessInfo(prod.digitalAccessInfo || '');
    setStock(prod.stock);
    setStatus(prod.status);
    setFeatured(prod.featured);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Product> = {
      name,
      nameKh,
      slug,
      description,
      descriptionKh,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      category,
      type: type as any,
      images: images.filter((img) => img.trim().length > 0),
      digitalDownloadUrl,
      digitalAccessInfo,
      stock: Number(stock),
      status,
      featured,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, updates: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const res = await adminAPI.uploadImage(formData);
      if (res.success && res.url) {
        setImages((prev) => [res.url, ...prev.filter(Boolean)]);
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Product Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Create, update digital assets, set pricing, and configure secure delivery URLs
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Digital Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto py-2 px-3 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-white outline-none"
        >
          <option value="">All Categories</option>
          {categoriesData?.categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Type</th>
                <th className="p-4">Price (USD)</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    Loading products...
                  </td>
                </tr>
              ) : data?.products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                data?.products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0] || 'https://via.placeholder.com/50'}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate max-w-xs">{prod.name}</p>
                          {prod.nameKh && (
                            <p className="text-[11px] text-gray-400 truncate max-w-xs">{prod.nameKh}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700">
                        {prod.type}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gray-900">${prod.price.toFixed(2)}</td>
                    <td className="p-4 font-bold text-emerald-600">
                      {prod.discountPrice ? `$${prod.discountPrice.toFixed(2)}` : '—'}
                    </td>
                    <td className="p-4 text-gray-700 font-semibold">{prod.stock}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          prod.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {prod.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete product "${prod.name}"?`)) {
                            deleteMutation.mutate(prod._id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-extrabold text-base text-gray-900">
                {editingProduct ? 'Edit Digital Product' : 'Add New Digital Product'}
              </h3>
              <button onClick={closeModal} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Product Name (EN) *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Product Name (Khmer)</label>
                  <input
                    type="text"
                    value={nameKh}
                    onChange={(e) => setNameKh(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500 font-khmer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500 bg-white"
                  >
                    {categoriesData?.categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Product Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500 bg-white"
                  >
                    <option value="software">AI Tools & Software</option>
                    <option value="course">Digital Course</option>
                    <option value="account">TikTok / Social Account</option>
                    <option value="prompt">AI Prompts</option>
                    <option value="ebook">Digital Book</option>
                    <option value="service">Development Service</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price ($ USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Discount Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={discountPrice ?? ''}
                    onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Optional discount"
                    className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description (EN) *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description (Khmer)</label>
                <textarea
                  rows={2}
                  value={descriptionKh}
                  onChange={(e) => setDescriptionKh(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500 font-khmer"
                />
              </div>

              {/* Digital Delivery Setup */}
              <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100 space-y-3">
                <h4 className="font-bold text-brand-900 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-brand-600" />
                  <span>Digital Product Delivery (Unlocked upon Paid Verification)</span>
                </h4>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Digital Download File URL</label>
                  <input
                    type="url"
                    value={digitalDownloadUrl}
                    onChange={(e) => setDigitalDownloadUrl(e.target.value)}
                    placeholder="https://storage.googleapis.com/... or Google Drive URL"
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Account Login Credentials / License Key Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={digitalAccessInfo}
                    onChange={(e) => setDigitalAccessInfo(e.target.value)}
                    placeholder="e.g. TikTok Account Login: email/password or Activation Key: NAVA-XXXX"
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Image URL & Upload */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={images[0] || ''}
                    onChange={(e) => setImages([e.target.value])}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500"
                  />
                  <label className="px-3 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Status and Featured toggle */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={status === 'published'}
                    onChange={(e) => setStatus(e.target.checked ? 'published' : 'draft')}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  <span>Published & Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600"
                  />
                  <span>Featured Product on Homepage</span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

