import React, { useState, useEffect, useMemo } from 'react';
import { api } from './services/api';
import { Product, Category, StoreSettings, DashboardStats, Order } from './types/index';
import { CartProvider, useCart } from './context/CartContext';

// Storefront Components
import { Header } from './components/common/Header';
import { Hero } from './components/home/Hero';
import { CategoryBar } from './components/home/CategoryBar';
import { ProductGrid } from './components/home/ProductGrid';
import { TrustSection } from './components/common/TrustSection';
import { Footer } from './components/common/Footer';
import { ProductDetailsModal } from './components/product/ProductDetailsModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { CartDrawer } from './components/cart/CartDrawer';

// Admin Components
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminProductForm } from './components/admin/AdminProductForm';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminProfile } from './components/admin/AdminProfile';

const AppContent: React.FC = () => {
  // Global Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sorting state for storefront
  const [sortBy, setSortBy] = useState('popular');

  // Navigation mode: 'store' | 'admin'
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [adminTab, setAdminTab] = useState('dashboard');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Admin Editing Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedAdminOrder, setSelectedAdminOrder] = useState<Order | null>(null);

  const {
    selectedProduct,
    setSelectedProduct,
    completedOrder,
    setCompletedOrder,
    searchTerm,
    selectedCategory
  } = useCart();

  // Initial Data Fetch
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [prodsData, catsData, settingsData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getSettings()
      ]);
      setProducts(prodsData);
      setCategories(catsData);
      setSettings(settingsData);
    } catch (e) {
      console.error('Failed to load initial store data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      const [ordersData, statsData] = await Promise.all([
        api.getOrders(),
        api.getDashboardStats()
      ]);
      setOrders(ordersData);
      setDashboardStats(statsData);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Check existing admin session token
    const token = localStorage.getItem('sbb_admin_token');
    if (token) {
      setAdminUser({ username: 'Shakil0099', role: 'admin' });
      loadAdminData();
    }

    // Check URL path on load (e.g. /product/:slug or /admin)
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      if (token) {
        setViewMode('admin');
      } else {
        setShowAdminLogin(true);
      }
    }
  }, []);

  // Handle URL slug matching for direct links
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/product/') && products.length > 0) {
      const slug = path.replace('/product/', '');
      const matched = products.find((p) => p.slug === slug);
      if (matched) {
        setSelectedProduct(matched);
      }
    }
  }, [products]);

  // Refresh admin data when switching to admin or on update
  useEffect(() => {
    if (viewMode === 'admin' && adminUser) {
      loadAdminData();
    }
  }, [viewMode, adminUser]);

  // Filter & Sort Products for Storefront
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sorting
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      // Default: Popular First
      list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return list;
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Admin Access Handler
  const handleOpenAdmin = () => {
    if (adminUser) {
      setViewMode('admin');
      window.history.pushState({}, '', '/admin');
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLoginSuccess = (user: any) => {
    setAdminUser(user);
    setViewMode('admin');
    window.history.pushState({}, '', '/admin');
    loadAdminData();
  };

  const handleAdminLogout = () => {
    api.logout();
    setAdminUser(null);
    setViewMode('store');
    window.history.pushState({}, '', '/');
  };

  const pendingCount = useMemo(() => {
    return orders.filter((o) => o.status === 'Pending').length;
  }, [orders]);

  // ================= ADMIN VIEW =================
  if (viewMode === 'admin') {
    return (
      <AdminLayout
        currentTab={adminTab}
        setCurrentTab={(tab) => {
          if (tab === 'add-product') {
            setEditingProduct(null);
          }
          setAdminTab(tab);
        }}
        onLogout={handleAdminLogout}
        onBackToStore={() => {
          setViewMode('store');
          window.history.pushState({}, '', '/');
        }}
        pendingOrdersCount={pendingCount}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            stats={dashboardStats}
            onNavigateTab={(tab) => {
              if (tab === 'add-product') setEditingProduct(null);
              setAdminTab(tab);
            }}
            onSelectOrder={(order) => {
              setSelectedAdminOrder(order);
              setAdminTab('orders');
            }}
          />
        )}

        {adminTab === 'orders' && (
          <AdminOrders
            orders={orders}
            onOrderUpdated={() => {
              loadAdminData();
              loadInitialData();
            }}
            initialSelectedOrder={selectedAdminOrder}
          />
        )}

        {adminTab === 'products' && (
          <AdminProducts
            products={products}
            categories={categories}
            onAddNew={() => {
              setEditingProduct(null);
              setAdminTab('add-product');
            }}
            onEdit={(p) => {
              setEditingProduct(p);
              setAdminTab('add-product');
            }}
            onProductUpdated={() => {
              loadInitialData();
              loadAdminData();
            }}
          />
        )}

        {adminTab === 'add-product' && (
          <AdminProductForm
            product={editingProduct}
            categories={categories}
            onSave={() => {
              loadInitialData();
              loadAdminData();
              setAdminTab('products');
            }}
            onCancel={() => {
              setEditingProduct(null);
              setAdminTab('products');
            }}
          />
        )}

        {adminTab === 'categories' && (
          <AdminCategories
            categories={categories}
            onUpdated={() => {
              loadInitialData();
            }}
          />
        )}

        {adminTab === 'settings' && (
          <AdminSettings
            settings={settings}
            onSettingsUpdated={(newSettings) => setSettings(newSettings)}
          />
        )}

        {adminTab === 'profile' && <AdminProfile />}
      </AdminLayout>
    );
  }

  // ================= STOREFRONT VIEW =================
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Sticky Header */}
      <Header
        settings={settings}
        onOpenAdmin={handleOpenAdmin}
        onNavigateHome={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateProducts={() => {
          const el = document.getElementById('products-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Body */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          settings={settings}
          onShopNow={() => {
            const el = document.getElementById('products-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Categories Bar */}
        <CategoryBar categories={categories} />

        {/* Product Grid Section */}
        <ProductGrid
          products={filteredProducts}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isLoading={isLoading}
        />

        {/* Trust & Why Choose Us Section */}
        <TrustSection />
      </main>

      {/* Global Footer */}
      <Footer settings={settings} onOpenAdmin={handleOpenAdmin} />

      {/* Modals & Overlays */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CheckoutModal settings={settings} />

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

      <CartDrawer />

      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
};

export function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
