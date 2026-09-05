export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';

export interface ProductVariant {
  size?: string;
  color?: string;
  stock?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  previous_price?: number;
  discount?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  status: ProductStatus;
  specifications: Record<string, string>;
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  selected_size?: string;
  selected_color?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_id: string; // e.g. SBB-10001
  customer_name: string;
  phone: string;
  alternative_phone?: string;
  division: string;
  district: string;
  upazila: string;
  area: string;
  address: string;
  // Primary product snapshot for simple direct orders
  product_id: string;
  product_name_snapshot: string;
  product_image_snapshot: string;
  selected_size?: string;
  selected_color?: string;
  quantity: number;
  product_price_snapshot: number;
  // Full items list if cart checkout
  items?: OrderItem[];
  delivery_charge: number;
  total: number;
  payment_method: 'Cash on Delivery';
  status: OrderStatus;
  note?: string;
  created_at: string;
  updated_at: string;
}

export interface StoreSettings {
  store_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  delivery_charge_inside_dhaka: number;
  delivery_charge_other_dhaka: number;
  delivery_charge_outside_dhaka: number;
  hero_headline: string;
  hero_subtext: string;
  hero_badge: string;
  facebook_url?: string;
  instagram_url?: string;
  whatsapp_number?: string;
  notice?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: string;
  created_at: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalSales: number;
  recentOrders: Order[];
}

export interface CartItem {
  product: Product;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}
