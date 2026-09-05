import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Zap, Check, Share2, ShieldCheck, Truck, Banknote, RefreshCw } from 'lucide-react';
import { Product } from '../../types/index';
import { useCart } from '../../context/CartContext';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, onClose }) => {
  const { addToCart, openDirectCheckout } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
      setQuantity(1);
      setErrorMsg(null);
      // Update page title & URL history without reload
      document.title = `${product.name} | SHOP BD BAZAR`;
      window.history.pushState({}, '', `/product/${product.slug}`);
    } else {
      document.title = 'SHOP BD BAZAR — Professional E-Commerce Store';
      window.history.pushState({}, '', '/');
    }

    return () => {
      document.title = 'SHOP BD BAZAR — Professional E-Commerce Store';
    };
  }, [product]);

  if (!product) return null;

  const isOutOfStock = product.status === 'out_of_stock' || product.stock <= 0;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/product/${product.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const validateSelection = (): boolean => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setErrorMsg('Please select your size before ordering');
      return false;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setErrorMsg('Please select your preferred color');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (!validateSelection()) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleOrderNow = () => {
    if (isOutOfStock) return;
    if (!validateSelection()) return;
    onClose();
    openDirectCheckout(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
          {/* Gallery Column */}
          <div className="md:col-span-6 space-y-4">
            {/* Main High-Res Image Preview */}
            <div className="relative pt-[100%] rounded-2xl bg-slate-100 overflow-hidden border border-slate-200/80 shadow-xs">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              {product.discount && product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-md shadow-sm">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Gallery Thumbnails (Up to 4 images) */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2.5">
                {product.images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative pt-[100%] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Share Link */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
              <span className="font-medium truncate max-w-[220px]">
                Product SKU / Slug: {product.slug}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold px-2.5 py-1 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Product'}</span>
              </button>
            </div>
          </div>

          {/* Details & Variant Selection Column */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {product.category}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-snug">
                  {product.name}
                </h1>
              </div>

              {/* Pricing Breakdown */}
              <div className="flex items-baseline gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.previous_price && product.previous_price > product.price && (
                  <span className="text-sm text-slate-400 line-through font-medium">
                    ৳{product.previous_price.toLocaleString()}
                  </span>
                )}
                {product.previous_price && product.previous_price > product.price && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md ml-auto">
                    Save ৳{(product.previous_price - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status Notification */}
              <div className="flex items-center gap-2 text-xs">
                {isOutOfStock ? (
                  <span className="text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                    Currently Out of Stock
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Available in Stock ({product.stock} items remaining)
                  </span>
                )}
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Select Size: <span className="text-emerald-700 font-extrabold">{selectedSize || 'Choose Size'}</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setSelectedSize(size);
                          setErrorMsg(null);
                        }}
                        className={`min-w-11 py-2 px-3.5 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                          selectedSize === size
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Select Color: <span className="text-emerald-700 font-extrabold">{selectedColor || 'Choose Color'}</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          setSelectedColor(color);
                          setErrorMsg(null);
                        }}
                        className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedColor === color
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-current opacity-80"></span>
                        <span>{color}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Quantity (পরিমাণ):
                </label>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-slate-600 hover:text-slate-900 font-bold text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-sm font-extrabold text-slate-900 border-x border-slate-100 min-w-10 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                      className="px-3.5 py-2 text-slate-600 hover:text-slate-900 font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Total: ৳{(product.price * quantity).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl animate-shake">
                  {errorMsg}
                </div>
              )}

              {/* Description */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Description
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications Table */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Specifications
                  </h4>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-slate-50 text-slate-700"
                      >
                        <span className="font-semibold text-slate-500">{key}:</span>
                        <span className="font-bold text-slate-800">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fixed Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-slate-200">
              {/* Order Now (Direct Checkout) Button */}
              <button
                id="modal-order-now-btn"
                type="button"
                onClick={handleOrderNow}
                disabled={isOutOfStock}
                className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl text-sm font-black uppercase tracking-wider shadow-lg transition-all ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-black shadow-amber-500/25 active:scale-[0.98] cursor-pointer'
                }`}
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>ORDER NOW • ক্যাশ অন ডেলিভারি</span>
              </button>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                  isOutOfStock
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : addedAnimation
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200/90 active:scale-95 cursor-pointer'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart Successfully!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
