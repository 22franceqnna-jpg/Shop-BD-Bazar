import React, { useState } from 'react';
import { ShoppingBag, Search, PhoneCall, ShieldCheck, Menu, X, ArrowRight, UserCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { StoreSettings } from '../../types/index';

interface HeaderProps {
  settings?: StoreSettings | null;
  onOpenAdmin: () => void;
  onNavigateHome: () => void;
  onNavigateProducts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onOpenAdmin,
  onNavigateHome,
  onNavigateProducts
}) => {
  const { totalCartItems, setIsCartOpen, searchTerm, setSearchTerm } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateProducts();
    // Scroll smoothly to products section
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Banner Notice */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{settings?.hero_badge || "CASH ON DELIVERY ALL OVER BANGLADESH • 100% GENUINE GUARANTEE"}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-emerald-200 text-xs">
            <a href={`tel:${settings?.phone || '+8801712345678'}`} className="hover:text-white flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Hotline: {settings?.phone || '+880 1712-345678'}</span>
            </a>
            <span className="text-emerald-700">•</span>
            <button
              id="admin-portal-link-btn"
              onClick={onOpenAdmin}
              className="hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black tracking-tight shadow-md group-hover:bg-emerald-700 transition-colors">
                <span className="text-lg">BD</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none group-hover:text-emerald-700 transition-colors">
                  SHOP BD BAZAR
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-emerald-700 uppercase mt-0.5">
                  Trusted Shopping
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-lg mx-6 relative"
          >
            <div className="relative w-full">
              <input
                id="header-search-input"
                type="text"
                placeholder="Search products by name, panjabi, shirt, saree, watch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-24 py-2.5 bg-slate-100/90 border border-slate-200 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="submit"
                id="header-search-submit-btn"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Action Links & Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-700">
              <button
                onClick={onNavigateHome}
                className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors"
              >
                Home
              </button>
              <button
                onClick={onNavigateProducts}
                className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors"
              >
                All Products
              </button>
              <a
                href="#categories-section"
                className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors"
              >
                Categories
              </a>
              <a
                href="#trust-section"
                className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-emerald-50/60 transition-colors"
              >
                Why Choose Us
              </a>
            </nav>

            {/* Cart Button */}
            <button
              id="cart-drawer-trigger-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3.5 py-2 rounded-xl text-sm font-semibold border border-emerald-200/80 cursor-pointer transition-all active:scale-95"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <span className="hidden sm:inline">Cart</span>
              {totalCartItems > 0 && (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-white bg-emerald-600 rounded-full shadow-xs animate-bounce">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {showSearchInput && (
          <div className="md:hidden pb-3 pt-1">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-20 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => {
              onNavigateHome();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-slate-800 font-semibold hover:bg-emerald-50"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigateProducts();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-slate-800 font-semibold hover:bg-emerald-50"
          >
            All Products
          </button>
          <a
            href="#categories-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left px-4 py-2.5 rounded-lg text-slate-800 font-semibold hover:bg-emerald-50"
          >
            Product Categories
          </a>
          <a
            href="#trust-section"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left px-4 py-2.5 rounded-lg text-slate-800 font-semibold hover:bg-emerald-50"
          >
            Why Choose Us (Trust)
          </a>
          <hr className="my-2 border-slate-200" />
          <div className="pt-2 px-2 flex flex-col gap-2">
            <a
              href={`tel:${settings?.phone || '+8801712345678'}`}
              className="flex items-center gap-2 text-emerald-800 text-sm font-bold bg-emerald-50 px-3 py-2.5 rounded-lg"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Hotline: {settings?.phone || '+880 1712-345678'}</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center justify-between w-full text-slate-700 text-sm font-semibold bg-slate-100 hover:bg-slate-200 px-3 py-2.5 rounded-lg"
            >
              <span className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Admin Panel (Shakil0099)
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
