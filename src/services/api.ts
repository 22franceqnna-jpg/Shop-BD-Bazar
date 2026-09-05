import { Product, Category, Order, StoreSettings, DashboardStats } from '../types/index';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('sbb_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // --- Products ---
  async getProducts(params?: {
    category?: string;
    search?: string;
    status?: string;
    featured?: boolean;
    sort?: string;
    includeInactive?: boolean;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.featured) query.set('featured', 'true');
    if (params?.sort) query.set('sort', params.sort);
    if (params?.includeInactive) query.set('includeInactive', 'true');

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/slug/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create product');
    return data;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update product');
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete product');
  },

  // --- Categories ---
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async createCategory(cat: { name: string; image?: string; description?: string }): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(cat)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create category');
    return data;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update category');
    return data;
  },

  async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete category');
  },

  // --- Orders ---
  async createOrder(orderPayload: {
    customer_name: string;
    phone: string;
    alternative_phone?: string;
    division: string;
    district: string;
    upazila: string;
    area?: string;
    address: string;
    product_id: string;
    selected_size?: string;
    selected_color?: string;
    quantity: number;
    delivery_charge: number;
    note?: string;
    items?: Array<{
      product_id: string;
      selected_size?: string;
      selected_color?: string;
      quantity: number;
    }>;
  }): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit order');
    return data;
  },

  async getOrders(params?: { search?: string; status?: string }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);

    const res = await fetch(`${API_BASE}/orders?${query.toString()}`, {
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
    return data;
  },

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update order status');
    return data;
  },

  async getOrderById(orderId: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order not found');
    return data;
  },

  // --- Settings ---
  async getSettings(): Promise<StoreSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(settings)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data;
  },

  // --- Dashboard Stats ---
  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: getAuthHeader()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch statistics');
    return data;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    return this.getStats();
  },

  // --- Auth ---
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('sbb_admin_token', data.token);
    return data;
  },

  async getAdminMe(): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to change password');
    return data;
  },

  logout() {
    localStorage.removeItem('sbb_admin_token');
  },

  // --- Upload Image ---
  async uploadImage(fileOrBase64: File | string, name?: string): Promise<{ url: string }> {
    let base64Data: string;
    let fileName = name;

    if (fileOrBase64 instanceof File) {
      fileName = fileName || fileOrBase64.name;
      base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(fileOrBase64);
      });
    } else {
      base64Data = fileOrBase64;
    }

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ image: base64Data, name: fileName })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Image upload failed');
    return data;
  }
};
