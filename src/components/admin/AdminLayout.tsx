import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Layers,
  ShoppingBag,
  Settings,
  User,
  LogOut,
  Store,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onLogout: () => void;
  onBackToStore: () => void;
  pendingOrdersCount?: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onLogout,
  onBackToStore,
  pendingOrdersCount = 0,
  children
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount },
    { id: 'products', label: 'All Products', icon: Package },
    { id: 'add-product', label: 'Add Product', icon: PlusCircle },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'settings', label: 'Store Settings', icon: Settings },
    { id: 'profile', label: 'Admin Profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-black text-sm">
            BD
          </div>
          <div>
            <span className="font-extrabold text-sm block">SHOP BD BAZAR</span>
            <span className="text-[10px] text-emerald-400 block font-semibold">Admin Panel</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToStore}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg text-xs"
            title="Go to storefront"
          >
            <Store className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 md:translate-x-0 md:static md:h-screen ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Store Info */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                BD
              </div>
              <div>
                <h1 className="font-black text-base text-white tracking-tight">SHOP BD BAZAR</h1>
                <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Portal</span>
                </p>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-nav-${item.id}`}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                      : 'hover:bg-slate-800/80 hover:text-white text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onBackToStore}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <Store className="w-4 h-4 text-emerald-400" />
            <span>Visit Customer Website</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-30 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-screen">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};
