import React, { useState, useEffect } from 'react';
import { Upload, X, Plus, Trash2, Image, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Product, Category } from '../../types/index';
import { api } from '../../services/api';

interface AdminProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSave: (product: Product) => void;
  onCancel: () => void;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  product,
  categories,
  onSave,
  onCancel
}) => {
  const isEditing = Boolean(product);

  // Form State
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || (categories[0]?.name || 'Men Fashion'));
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price ? String(product.price) : '');
  const [previousPrice, setPreviousPrice] = useState(product?.previous_price ? String(product.previous_price) : '');
  const [discount, setDiscount] = useState(product?.discount ? String(product.discount) : '');
  const [stock, setStock] = useState(product?.stock !== undefined ? String(product.stock) : '25');
  const [status, setStatus] = useState<'active' | 'inactive' | 'out_of_stock'>(product?.status || 'active');
  const [isFeatured, setIsFeatured] = useState(product?.is_featured || false);

  // Sizes & Colors
  const [sizes, setSizes] = useState<string[]>(product?.sizes || ['S', 'M', 'L', 'XL']);
  const [newSize, setNewSize] = useState('');

  const [colors, setColors] = useState<string[]>(product?.colors || ['Navy Blue', 'Off-White', 'Black']);
  const [newColor, setNewColor] = useState('');

  // Images (Up to 4 images)
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Specifications
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>(() => {
    if (product?.specifications) {
      return Object.entries(product.specifications).map(([key, value]) => ({ key, value }));
    }
    return [
      { key: 'Fabric', value: '100% Premium Cotton' },
      { key: 'Fitting', value: 'Regular / Semi-Slim' },
      { key: 'Origin', value: 'Bangladesh' }
    ];
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto calculate discount percentage when prices change
  useEffect(() => {
    const p = parseFloat(price);
    const prev = parseFloat(previousPrice);
    if (!isNaN(p) && !isNaN(prev) && prev > p) {
      const calcDiscount = Math.round(((prev - p) / prev) * 100);
      setDiscount(String(calcDiscount));
    }
  }, [price, previousPrice]);

  const handleAddSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize('');
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes(sizes.filter((s) => s !== sizeToRemove));
  };

  const handleAddColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor('');
    }
  };

  const handleRemoveColor = (colorToRemove: string) => {
    setColors(colors.filter((c) => c !== colorToRemove));
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim() && images.length < 4) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 4) {
      setError('Maximum 4 images allowed per product');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploaded = await api.uploadImage(file);
      setImages((prev) => [...prev, uploaded.url]);
    } catch (err: any) {
      setError(err.message || 'Image upload failed. You can also paste an image URL directly.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    const rest = images.filter((_, i) => i !== index);
    setImages([selected, ...rest]);
  };

  const handleAddSpecRow = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const handleUpdateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specifications];
    updated[index][field] = val;
    setSpecifications(updated);
  };

  const handleRemoveSpecRow = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Valid product price is required');
      return;
    }
    if (images.length === 0) {
      setError('Please provide at least 1 image for the product');
      return;
    }

    setLoading(true);

    try {
      // Build specifications object
      const specObj: Record<string, string> = {};
      specifications.forEach((s) => {
        if (s.key.trim() && s.value.trim()) {
          specObj[s.key.trim()] = s.value.trim();
        }
      });

      const payload = {
        name: name.trim(),
        category,
        description: description.trim(),
        price: numPrice,
        previous_price: previousPrice ? parseFloat(previousPrice) : undefined,
        discount: discount ? parseInt(discount, 10) : undefined,
        stock: parseInt(stock, 10) || 0,
        status,
        is_featured: isFeatured,
        sizes,
        colors,
        images,
        specifications: specObj
      };

      let saved: Product;
      if (isEditing && product) {
        saved = await api.updateProduct(product.id, payload);
      } else {
        saved = await api.createProduct(payload);
      }

      onSave(saved);
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {isEditing ? `Edit Product: ${product?.name}` : 'Add New Product to Catalog'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure product details, variants, images, and inventory
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Product Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Product Title / Name <span className="text-rose-600">*</span>
            </label>
            <input
              id="admin-product-name-input"
              type="text"
              required
              placeholder="e.g. Royal Platinum Jacquard Panjabi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category <span className="text-rose-600">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Product Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500"
            >
              <option value="active">Active (Available on Store)</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="inactive">Inactive (Draft / Hidden)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description (বিবরণ)
            </label>
            <textarea
              rows={3}
              placeholder="Detailed description of the product fabric, cut, occasion, and craftsmanship..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Selling Price (৳) <span className="text-rose-600">*</span>
            </label>
            <input
              id="admin-product-price-input"
              type="number"
              required
              min="0"
              step="1"
              placeholder="1850"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Regular Price (৳)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="2450"
              value={previousPrice}
              onChange={(e) => setPreviousPrice(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="24"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold"
            />
          </div>

          <div className="col-span-2 sm:col-span-4 pt-1 flex items-center gap-2">
            <input
              id="product-featured-checkbox"
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
            />
            <label htmlFor="product-featured-checkbox" className="text-xs font-bold text-slate-800 cursor-pointer">
              Mark as Featured Product (Highlight on Homepage)
            </label>
          </div>
        </div>

        {/* Variants: Sizes & Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Sizes */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              Product Sizes (সাইজ)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. XXL, 42, Free Size"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSize();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
              >
                Add Size
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {sizes.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-2xs"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSize(s)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              Product Colors (রং)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. Royal Maroon, Olive Green"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddColor();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
              >
                Add Color
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {colors.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-2xs"
                >
                  <span>{c}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(c)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Product Images (Up to 4) */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Product Images ({images.length}/4) <span className="text-rose-600">*</span>
              </label>
              <p className="text-[11px] text-slate-500">
                Upload image file or paste image URL. First image will be used as primary thumbnail.
              </p>
            </div>
          </div>

          {/* Add image URL or file upload */}
          {images.length < 4 && (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 flex items-center gap-2 w-full">
                <input
                  type="url"
                  placeholder="Paste direct image URL (https://...)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer"
                >
                  Add URL
                </button>
              </div>

              <span className="text-xs text-slate-400">or</span>

              <label className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition-colors shadow-2xs">
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                ) : (
                  <Upload className="w-4 h-4 text-emerald-600" />
                )}
                <span>{isUploading ? 'Uploading...' : 'Upload Image File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Preview Thumbnails Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden border-2 border-slate-200 bg-white aspect-square shadow-2xs"
              >
                <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                    Primary
                  </span>
                )}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      className="p-1.5 rounded-lg bg-white text-slate-800 text-[10px] font-bold shadow-xs hover:bg-emerald-50"
                      title="Set as primary thumbnail"
                    >
                      Make Main
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="p-1.5 rounded-lg bg-rose-600 text-white shadow-xs hover:bg-rose-700"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications Table */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
              Product Specifications (বৈশিষ্ট্য)
            </label>
            <button
              type="button"
              onClick={handleAddSpecRow}
              className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Specification Row</span>
            </button>
          </div>
          <div className="space-y-2">
            {specifications.map((spec, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Key (e.g. Fabric, Collar, Fit)"
                  value={spec.key}
                  onChange={(e) => handleUpdateSpec(idx, 'key', e.target.value)}
                  className="w-1/3 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 100% Cotton, Band Collar)"
                  value={spec.value}
                  onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpecRow(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            id="admin-product-save-btn"
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Product...</span>
              </>
            ) : (
              <span>{isEditing ? 'Update Product' : 'Publish Product to Store'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
