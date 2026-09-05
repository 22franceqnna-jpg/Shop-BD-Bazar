import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit2, Check, X, AlertCircle } from 'lucide-react';
import { Category } from '../../types/index';
import { api } from '../../services/api';

interface AdminCategoriesProps {
  categories: Category[];
  onUpdated: () => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({ categories, onUpdated }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    setLoading(true);
    try {
      if (editingCat) {
        await api.updateCategory(editingCat.id, {
          name: name.trim(),
          image: image.trim() || undefined,
          description: description.trim() || undefined
        });
      } else {
        await api.createCategory({
          name: name.trim(),
          image: image.trim() || 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80',
          description: description.trim() || undefined
        });
      }
      setName('');
      setImage('');
      setDescription('');
      setEditingCat(null);
      onUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setImage(cat.image || '');
    setDescription(cat.description || '');
  };

  const handleCancelEdit = () => {
    setEditingCat(null);
    setName('');
    setImage('');
    setDescription('');
    setError(null);
  };

  const handleDelete = async (catId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.deleteCategory(catId);
      onUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Category Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Organize products into categories for easy customer discovery
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900">
              {editingCat ? `Edit Category: ${editingCat.name}` : 'Add New Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Category Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Jackets, Kids Wear"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short overview of this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                {editingCat && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {loading ? 'Saving...' : editingCat ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Categories List Column */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">
                Active Store Categories ({categories.length})
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center gap-3">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <Layers className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{cat.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">slug: {cat.slug}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50"
                      title="Edit Category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
