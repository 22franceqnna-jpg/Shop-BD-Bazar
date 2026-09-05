import React from 'react';
import { Category } from '../../types/index';
import { useCart } from '../../context/CartContext';
import { Layers } from 'lucide-react';

interface CategoryBarProps {
  categories: Category[];
}

export const CategoryBar: React.FC<CategoryBarProps> = ({ categories }) => {
  const { selectedCategory, setSelectedCategory } = useCart();

  return (
    <section id="categories-section" className="py-8 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Browse Categories</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Select a category to filter our authentic collections
            </p>
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Reset Filter (Show All)
            </button>
          )}
        </div>

        {/* Categories Horizontal Carousel / Grid */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {/* All Category Pill */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>All Categories</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 scale-[1.02]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90'
                }`}
              >
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
