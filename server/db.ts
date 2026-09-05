import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { Product, Order, Category, StoreSettings, DashboardStats } from '../src/types/index.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

export interface AdminUserRecord {
  id: string;
  username: string;
  salt: string;
  hash: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  orders: Order[];
  admin: AdminUserRecord;
  settings: StoreSettings;
  orderCounter: number;
}

export function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const finalSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, finalSalt, 64).toString('hex');
  return { salt: finalSalt, hash };
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const computed = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
}

const DEFAULT_SETTINGS: StoreSettings = {
  store_name: "SHOP BD BAZAR",
  tagline: "Bangladesh's Trusted Online Shopping Destination",
  phone: "+880 1712-345678",
  email: "support@shopbdbazar.com",
  address: "House 24, Road 4, Dhanmondi, Dhaka 1205, Bangladesh",
  delivery_charge_inside_dhaka: 70,
  delivery_charge_other_dhaka: 100,
  delivery_charge_outside_dhaka: 120,
  hero_headline: "Premium Lifestyle & Fashion Collection for Bangladesh",
  hero_subtext: "Enjoy reliable Cash on Delivery nationwide across all 64 districts. 100% genuine products with doorstep delivery and easy returns.",
  hero_badge: "NEW ARRIVALS • CASH ON DELIVERY ANYWHERE IN BANGLADESH",
  facebook_url: "https://facebook.com",
  instagram_url: "https://instagram.com",
  whatsapp_number: "+8801712345678"
};

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Men's Fashion",
    slug: "mens-fashion",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: "cat-2",
    name: "Panjabi & Festive",
    slug: "panjabi-festive",
    image: "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=600&q=80",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: "cat-3",
    name: "Women's Collection",
    slug: "womens-collection",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: "cat-4",
    name: "Watches & Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: "cat-5",
    name: "Footwear & Shoes",
    slug: "footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: "cat-6",
    name: "Gadgets & Smart Tech",
    slug: "gadgets",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    status: "active",
    created_at: new Date().toISOString()
  }
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Royal Platinum Jacquard Semi-Formal Panjabi",
    slug: "royal-platinum-jacquard-semi-formal-panjabi",
    description: "Exquisite hand-finished semi-formal jacquard Panjabi with refined collar embroidery, metallic snap buttons, and ultra-breathable high-twist premium cotton blend. Tailored for comfort in Bangladesh's climate for Eid, weddings, and formal occasions.",
    category: "Panjabi & Festive",
    price: 1850,
    previous_price: 2450,
    discount: 24,
    images: [
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["38", "40", "42", "44"],
    colors: ["Navy Blue", "Off White", "Olive Green", "Maroon"],
    stock: 42,
    status: "active",
    specifications: {
      "Fabric": "100% Jacquard High-Twist Combed Cotton",
      "Collar": "Mandarin Band with Hand Threadwork",
      "Fit": "Regular Slim Tailored Fit",
      "Buttons": "Antique Brass Snap Fasteners",
      "Care": "Dry clean recommended or gentle hand wash in cold water"
    },
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-2",
    name: "Executive 100% Egyptian Cotton Formal Shirt",
    slug: "executive-egyptian-cotton-formal-shirt",
    description: "Crisp, wrinkle-resistant premium Oxford weave business shirt engineered for executives. Features reinforced collar stiffeners, mother-of-pearl buttons, and moisture-wicking weave ideal for corporate workdays.",
    category: "Men's Fashion",
    price: 1350,
    previous_price: 1750,
    discount: 23,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15c429fcc71?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Sky Blue", "Crisp White", "Classic Navy", "Charcoal Gray"],
    stock: 35,
    status: "active",
    specifications: {
      "Material": "100% Giza Egyptian Long-Staple Cotton",
      "Weave": "Royal Oxford Non-Iron Finish",
      "Collar": "Modern Cutaway Collar",
      "Cuff": "Dual Button Adjustable Barrel Cuff",
      "Pocket": "Single V-Chest Pocket"
    },
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-3",
    name: "Jamdani Inspired Designer Silk Georgette Saree",
    slug: "jamdani-inspired-designer-silk-georgette-saree",
    description: "Breathtaking artisan saree featuring intricate golden zari flora and geometrical borders inspired by authentic heritage Jamdani motifs. Lightweight, elegant drape including unstitched designer blouse piece.",
    category: "Women's Collection",
    price: 3200,
    previous_price: 4500,
    discount: 29,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610030469851-8724b0717208?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["Standard 12 Haat (with Blouse Piece)"],
    colors: ["Crimson Red", "Emerald Green", "Royal Purple", "Gold Dust"],
    stock: 20,
    status: "active",
    specifications: {
      "Body": "Soft Georgette Pure Silk Blend",
      "Work": "Intricate Metallic Resham & Golden Zari Weaving",
      "Length": "6.3 Meters with 0.8 Meter Blouse Piece",
      "Occasion": "Festive, Wedding Guest, Parties",
      "Origin": "Crafted in Bangladesh"
    },
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-4",
    name: "Chronograph Precision Aviator Leather Men's Watch",
    slug: "chronograph-precision-aviator-leather-mens-watch",
    description: "Robust Japanese quartz movement chronograph featuring scratch-resistant sapphire mineral crystal, luminous indices, 30M water resistance, and genuine hand-stitched top-grain leather strap.",
    category: "Watches & Accessories",
    price: 2450,
    previous_price: 3200,
    discount: 23,
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["42mm Dial"],
    colors: ["Obsidian Black", "Cognac Brown", "Silver Navy"],
    stock: 28,
    status: "active",
    specifications: {
      "Movement": "Japanese Quartz Triple Sub-dial Chronograph",
      "Glass": "Hardened Anti-Scratch Mineral Crystal",
      "Case": "316L Surgical Stainless Steel",
      "Water Resistance": "3 ATM / 30 Meters",
      "Strap": "22mm Genuine Full-Grain Calfskin Leather"
    },
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-5",
    name: "Urban Glide Air-Cushion Athletic Sneakers",
    slug: "urban-glide-air-cushion-athletic-sneakers",
    description: "Engineered breathable mesh upper with responsive shock-absorbing pneumatic air cushioning sole. Lightweight, anti-slip rubber grip, and ergonomic footbed designed for daily running, gym, and street style.",
    category: "Footwear & Shoes",
    price: 2190,
    previous_price: 2950,
    discount: 26,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["Triple Black", "Pure White", "Slate Gray"],
    stock: 30,
    status: "active",
    specifications: {
      "Upper": "Honeycomb Micro-Mesh Breathable Knit",
      "Sole": "High-Density EVA + Rubber Traction Pods",
      "Insole": "Memory Foam Arch Support",
      "Closure": "Reinforced Lace-up",
      "Weight": "Ultra-light 280g per shoe"
    },
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "prod-6",
    name: "SoundBeast Pro Active Noise Cancelling TWS Earbuds",
    slug: "soundbeast-pro-anc-tws-earbuds",
    description: "Hybrid 35dB Active Noise Cancellation with transparency mode, quad ENC microphones for crystal-clear calls even in traffic, 13mm dynamic titanium drivers, IPX5 sweat resistance, and 36-hour total battery life.",
    category: "Gadgets & Smart Tech",
    price: 1950,
    previous_price: 2700,
    discount: 28,
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598331668826-20cecc596b86?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    ],
    sizes: ["One Size (Includes S/M/L Silicone Tips)"],
    colors: ["Matte Black", "Pearl White"],
    stock: 50,
    status: "active",
    specifications: {
      "Bluetooth": "V5.3 Ultra-Low Latency 40ms Gaming Mode",
      "Noise Reduction": "Hybrid ANC up to -35dB + Quad Mic ENC",
      "Battery": "7 hours per charge + 29 hours charging case",
      "Charging": "Type-C Fast Charge (10 mins = 2 hours playback)",
      "Waterproof": "IPX5 Splash & Sweat Resistant"
    },
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error reading database file, initializing defaults:', err);
    }

    // Default admin user as specified in user prompt:
    // Username: Shakil0099
    // Password: Shakil9900
    const { salt, hash } = hashPassword('Shakil9900');
    const initialAdmin: AdminUserRecord = {
      id: 'admin-1',
      username: 'Shakil0099',
      salt,
      hash,
      role: 'superadmin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const initialData: DatabaseSchema = {
      products: DEFAULT_PRODUCTS,
      categories: DEFAULT_CATEGORIES,
      orders: [],
      admin: initialAdmin,
      settings: DEFAULT_SETTINGS,
      orderCounter: 10001
    };

    this.saveDataDirect(initialData);
    return initialData;
  }

  private saveDataDirect(data: DatabaseSchema) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, DB_FILE);
  }

  public save() {
    this.saveDataDirect(this.data);
  }

  // --- Products ---
  public getProducts(options?: {
    category?: string;
    search?: string;
    status?: string;
    featured?: boolean;
    sort?: string;
    includeInactive?: boolean;
  }): Product[] {
    let result = [...this.data.products];

    if (!options?.includeInactive) {
      result = result.filter(p => p.status !== 'inactive');
    }

    if (options?.status && options.status !== 'all') {
      result = result.filter(p => p.status === options.status);
    }

    if (options?.category && options.category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === options.category!.toLowerCase());
    }

    if (options?.featured) {
      result = result.filter(p => p.is_featured);
    }

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (options?.sort) {
      switch (options.sort) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        case 'popular':
        default:
          result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
          break;
      }
    }

    return result;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find(p => p.slug === slug);
  }

  public createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product {
    const id = 'prod-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const newProduct: Product = {
      ...productData,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const current = this.data.products[index];
    const updated: Product = {
      ...current,
      ...updates,
      id: current.id,
      created_at: current.created_at,
      updated_at: new Date().toISOString()
    };

    // Automatically update status to out_of_stock if stock <= 0
    if (typeof updated.stock === 'number') {
      if (updated.stock <= 0 && updated.status === 'active') {
        updated.status = 'out_of_stock';
      } else if (updated.stock > 0 && updated.status === 'out_of_stock') {
        updated.status = 'active';
      }
    }

    this.data.products[index] = updated;
    this.save();
    return updated;
  }

  public deleteProduct(id: string): boolean {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.save();
    return true;
  }

  // --- Categories ---
  public getCategories(): Category[] {
    return this.data.categories;
  }

  public createCategory(cat: Omit<Category, 'id' | 'created_at'>): Category {
    const id = 'cat-' + Date.now();
    const newCat: Category = {
      ...cat,
      id,
      created_at: new Date().toISOString()
    };
    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.categories[index] = { ...this.data.categories[index], ...updates };
    this.save();
    return this.data.categories[index];
  }

  public deleteCategory(id: string): boolean {
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.data.categories.splice(index, 1);
    this.save();
    return true;
  }

  // --- Orders ---
  public getOrders(filters?: {
    search?: string;
    status?: string;
  }): Order[] {
    let list = [...this.data.orders];

    if (filters?.status && filters.status !== 'all') {
      list = list.filter(o => o.status.toLowerCase() === filters.status!.toLowerCase());
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(o =>
        o.order_id.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.product_name_snapshot.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return list;
  }

  public getOrderById(idOrOrderId: string): Order | undefined {
    return this.data.orders.find(o => o.id === idOrOrderId || o.order_id === idOrOrderId);
  }

  public createOrder(orderInput: {
    customer_name: string;
    phone: string;
    alternative_phone?: string;
    division: string;
    district: string;
    upazila: string;
    area: string;
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
  }): Order {
    const orderNumber = this.data.orderCounter++;
    const orderId = `SBB-${orderNumber}`;

    // Fetch primary product to snapshot
    const primaryProduct = this.getProductById(orderInput.product_id);
    if (!primaryProduct) {
      throw new Error("Product not found");
    }

    const priceSnapshot = primaryProduct.price;
    const nameSnapshot = primaryProduct.name;
    const imageSnapshot = primaryProduct.images[0] || '';

    // Decrement stock for primary product
    const qty = Math.max(1, orderInput.quantity || 1);
    const newStock = Math.max(0, (primaryProduct.stock || 0) - qty);
    this.updateProduct(primaryProduct.id, {
      stock: newStock,
      status: newStock === 0 ? 'out_of_stock' : primaryProduct.status
    });

    // If multi-item checkout, decrement additional items as well
    const itemsSnapshot: Order['items'] = [];
    if (orderInput.items && orderInput.items.length > 0) {
      for (const item of orderInput.items) {
        const p = this.getProductById(item.product_id);
        if (p) {
          const itemQty = item.quantity || 1;
          itemsSnapshot.push({
            product_id: p.id,
            product_name: p.name,
            product_image: p.images[0] || '',
            selected_size: item.selected_size,
            selected_color: item.selected_color,
            quantity: itemQty,
            unit_price: p.price,
            subtotal: p.price * itemQty
          });
          // Decrement other items if not the primary one already decremented
          if (p.id !== primaryProduct.id) {
            const extraStock = Math.max(0, (p.stock || 0) - itemQty);
            this.updateProduct(p.id, {
              stock: extraStock,
              status: extraStock === 0 ? 'out_of_stock' : p.status
            });
          }
        }
      }
    }

    const productTotal = itemsSnapshot.length > 0
      ? itemsSnapshot.reduce((acc, it) => acc + it.subtotal, 0)
      : priceSnapshot * qty;

    const grandTotal = productTotal + orderInput.delivery_charge;

    const newOrder: Order = {
      id: 'ord-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      order_id: orderId,
      customer_name: orderInput.customer_name.trim(),
      phone: orderInput.phone.trim(),
      alternative_phone: orderInput.alternative_phone?.trim(),
      division: orderInput.division,
      district: orderInput.district,
      upazila: orderInput.upazila,
      area: orderInput.area,
      address: orderInput.address.trim(),
      product_id: primaryProduct.id,
      product_name_snapshot: nameSnapshot,
      product_image_snapshot: imageSnapshot,
      selected_size: orderInput.selected_size,
      selected_color: orderInput.selected_color,
      quantity: qty,
      product_price_snapshot: priceSnapshot,
      items: itemsSnapshot.length > 0 ? itemsSnapshot : undefined,
      delivery_charge: orderInput.delivery_charge,
      total: grandTotal,
      payment_method: 'Cash on Delivery',
      status: 'Pending',
      note: orderInput.note?.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['status']): Order | null {
    const order = this.data.orders.find(o => o.id === orderId || o.order_id === orderId);
    if (!order) return null;
    order.status = status;
    order.updated_at = new Date().toISOString();
    this.save();
    return order;
  }

  // --- Admin Auth ---
  public getAdmin(): AdminUserRecord {
    return this.data.admin;
  }

  public updateAdminPassword(newPassword: string): boolean {
    const { salt, hash } = hashPassword(newPassword);
    this.data.admin.salt = salt;
    this.data.admin.hash = hash;
    this.data.admin.updated_at = new Date().toISOString();
    this.save();
    return true;
  }

  // --- Settings ---
  public getSettings(): StoreSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  // --- Dashboard Statistics ---
  public getStats(): DashboardStats {
    const totalProducts = this.data.products.length;
    const activeProducts = this.data.products.filter(p => p.status === 'active').length;
    const outOfStockProducts = this.data.products.filter(p => p.status === 'out_of_stock' || p.stock <= 0).length;

    const orders = this.data.orders;
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const confirmedOrders = orders.filter(o => o.status === 'Confirmed').length;
    const processingOrders = orders.filter(o => o.status === 'Processing').length;
    const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

    // Total sales excludes cancelled orders
    const totalSales = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const recentOrders = orders.slice(0, 8);

    return {
      totalProducts,
      activeProducts,
      outOfStockProducts,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalSales,
      recentOrders
    };
  }
}

export const db = new Database();
