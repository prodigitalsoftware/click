import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, X, FolderTree } from 'lucide-react';
import { categoryAPI } from '../../services/api';
import { Category } from '../../types';

export const AdminCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [nameKh, setNameKh] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Folder');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getCategories({ status: 'all' }),
  });

  const createMutation = useMutation({
    mutationFn: (newCat: Partial<Category>) => categoryAPI.createCategory(newCat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Category> }) =>
      categoryAPI.updateCategory(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryAPI.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err: any) => {
      alert(err?.response?.data?.message || err.message);
    },
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setNameKh('');
    setSlug('');
    setDescription('');
    setIcon('Folder');
    setStatus('active');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setNameKh(cat.nameKh || '');
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setIcon(cat.icon || 'Folder');
    setStatus(cat.status);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Category> = {
      name,
      nameKh,
      slug,
      description,
      icon,
      status,
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, updates: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Category Management</h1>
          <p className="text-xs text-gray-500 mt-1">Organize digital marketplace product categories</p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
            <tr>
              <th className="p-4">Category Name</th>
              <th className="p-4">Khmer Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Icon</th>
              <th className="p-4">Products</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">
                  Loading categories...
                </td>
              </tr>
            ) : data?.categories.map((cat) => (
              <tr key={cat._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-bold text-gray-900">{cat.name}</td>
                <td className="p-4 text-gray-600 font-khmer">{cat.nameKh || '—'}</td>
                <td className="p-4 font-mono text-gray-500">{cat.slug}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-mono text-[10px]">
                    {cat.icon || 'Folder'}
                  </span>
                </td>
                <td className="p-4 font-semibold text-brand-600">{cat.productCount ?? 0}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      cat.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-gray-400 hover:text-brand-600 rounded-lg hover:bg-brand-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete category "${cat.name}"?`)) {
                        deleteMutation.mutate(cat._id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-gray-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={closeModal} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Name (EN) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Name (Khmer)</label>
                <input
                  type="text"
                  value={nameKh}
                  onChange={(e) => setNameKh(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500 font-khmer"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. ai-tools-software"
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Icon Name</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 outline-none focus:border-brand-500 bg-white"
                >
                  <option value="Cpu">Cpu (AI Tools)</option>
                  <option value="GraduationCap">GraduationCap (Courses)</option>
                  <option value="Smartphone">Smartphone (TikTok / Mobile)</option>
                  <option value="Sparkles">Sparkles (Prompts)</option>
                  <option value="BookOpen">BookOpen (E-books)</option>
                  <option value="Code">Code (Dev Services)</option>
                  <option value="Folder">Folder (Generic)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

