import React, { useState } from 'react';
import {
  Package,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Product, Category } from '../../types/index';
import { api } from '../../services/api';

interface AdminProductsProps {
  products: Product[];
  categories: Category[];
  onAddNew: () => void;
  onEdit: (product: Product) => void;
  onProductUpdated: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  categories,
  onAddNew,
  onEdit,
  onProductUpdated
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    setActionError(null);
    try {
      await api.deleteProduct(productToDelete.id);
      setProductToDelete(null);
      onProductUpdated();
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      const nextStatus =
        product.status === 'active'
          ? 'out_of_stock'
          : product.status === 'out_of_stock'
          ? 'inactive'
          : 'active';
      await api.updateProduct(product.id, { status: nextStatus });
      onProductUpdated();
    } catch (err: any) {
      setActionError(err.message || 'Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Product Catalog Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage inventory, variants, prices, and stock status across your store
          </p>
        </div>
        <button
          id="admin-add-product-btn"
          onClick={onAddNew}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {actionError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search products by title, category, slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price (৳)</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Variants</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Product Name & Thumbnail */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                            <span>{product.name}</span>
                            {product.is_featured && (
                              <span className="p-0.5 rounded-sm bg-amber-100 text-amber-800" title="Featured">
                                <Sparkles className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            /{product.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5 font-semibold text-slate-700">
                      {product.category}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-3.5">
                      <div className="font-extrabold text-slate-900">
                        ৳{product.price.toLocaleString()}
                      </div>
                      {product.previous_price && (
                        <div className="text-[10px] text-slate-400 line-through">
                          ৳{product.previous_price.toLocaleString()}
                        </div>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`font-bold ${
                          product.stock <= 0
                            ? 'text-rose-600'
                            : product.stock < 10
                            ? 'text-amber-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </td>

                    {/* Status Badge with Click to toggle */}
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(product)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          product.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : product.status === 'out_of_stock'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Click to cycle status"
                      >
                        {product.status === 'active'
                          ? 'Active'
                          : product.status === 'out_of_stock'
                          ? 'Out of Stock'
                          : 'Inactive'}
                      </button>
                    </td>

                    {/* Variants */}
                    <td className="px-5 py-3.5 text-[11px] text-slate-500">
                      <div>Sizes: {product.sizes?.join(', ') || 'None'}</div>
                      <div>Colors: {product.colors?.join(', ') || 'None'}</div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(product)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-black text-slate-900">Delete Product?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove <strong>"{productToDelete.name}"</strong>? This will permanently delete the item from the catalog.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
