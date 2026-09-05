import React, { useState } from 'react';
import { ShoppingBag, Eye, Zap, Check } from 'lucide-react';
import { Product } from '../../types/index';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, openDirectCheckout, openProductModal } = useCart();

  // Quick variant selection state for card if user orders directly from card
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || '');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isOutOfStock = product.status === 'out_of_stock' || product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    openDirectCheckout(product, selectedSize, selectedColor, 1);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Image Thumbnail Container */}
      <div
        onClick={() => openProductModal(product)}
        className="relative w-full pt-[95%] bg-slate-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.discount && product.discount > 0 && (
            <span className="bg-rose-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-md shadow-sm tracking-wide">
              {product.discount}% OFF
            </span>
          )}
          {product.is_featured && (
            <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
              Popular
            </span>
          )}
        </div>

        {/* Stock Status Pill */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <span className="bg-slate-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
              Out of Stock
            </span>
          ) : (
            <span className="bg-emerald-800/85 text-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs">
              In Stock ({product.stock})
            </span>
          )}
        </div>

        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openProductModal(product);
            }}
            className="bg-white/95 hover:bg-white text-slate-800 text-xs font-bold py-2 px-4 rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[11px] font-semibold text-emerald-700 tracking-wide uppercase">
            {product.category}
          </span>
          <h3
            onClick={() => openProductModal(product)}
            className="text-sm font-bold text-slate-900 hover:text-emerald-700 line-clamp-2 mt-0.5 cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Pricing Info */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-black text-slate-900 tracking-tight">
              ৳{product.price.toLocaleString()}
            </span>
            {product.previous_price && product.previous_price > product.price && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ৳{product.previous_price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Variants Preview (Sizes & Colors) */}
        <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500">Sizes:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {product.sizes.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(s);
                    }}
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md border transition-all ${
                      selectedSize === s
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
                {product.sizes.length > 4 && (
                  <span className="text-[10px] text-slate-400 font-medium">
                    +{product.sizes.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500">Colors:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {product.colors.slice(0, 3).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(c);
                    }}
                    className={`px-1.5 py-0.5 text-[10px] font-medium rounded-md border transition-all ${
                      selectedColor === c
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
                {product.colors.length > 3 && (
                  <span className="text-[10px] text-slate-400 font-medium">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons: ORDER NOW & Add to Cart */}
        <div className="pt-2 space-y-2">
          {/* Prominent Order Now Button */}
          <button
            id={`order-now-btn-${product.id}`}
            onClick={handleOrderNow}
            disabled={isOutOfStock}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wide transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-black shadow-amber-500/20 active:scale-[0.98] cursor-pointer'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>ORDER NOW (অর্ডার করুন)</span>
          </button>

          {/* Secondary Action: Add to Cart */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : addedAnimation
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200/90 active:scale-95 cursor-pointer'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={() => openProductModal(product)}
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
