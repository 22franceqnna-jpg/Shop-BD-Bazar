import React from 'react';
import { Product } from '../../types/index';
import { ProductCard } from '../product/ProductCard';
import { useCart } from '../../context/CartContext';
import { PackageX, ArrowUpDown, Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  sortBy: string;
  setSortBy: (sort: string) => void;
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  sortBy,
  setSortBy,
  isLoading
}) => {
  const { searchTerm, setSearchTerm, selectedCategory, setSelectedCategory } = useCart();

  return (
    <section id="products-section" className="py-12 bg-slate-50/70 min-h-[500px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Filters Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-100 text-emerald-800">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {selectedCategory !== 'all' ? selectedCategory : 'Featured Collection'}
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Showing {products.length} {products.length === 1 ? 'item' : 'items'} available with Cash on Delivery
            </p>
          </div>

          {/* Sort Selector & Active Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-900 font-bold focus:outline-hidden cursor-pointer"
              >
                <option value="popular">Popular First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse"
              >
                <div className="w-full h-56 bg-slate-200 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && (
          <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <PackageX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Products Found</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              We couldn't find any products matching your current search or category filter. Try changing your search query or reset filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              Show All Available Products
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        {!isLoading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
