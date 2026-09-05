import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { db, verifyPassword } from './db.js';
import { createToken, requireAdmin, AuthenticatedRequest } from './auth.js';

export const apiRouter = Router();

// Ensure upload directory exists
const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// --- Auth Endpoints ---
apiRouter.post('/auth/login', (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = db.getAdmin();
    if (admin.username.toLowerCase() !== username.trim().toLowerCase()) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isValid = verifyPassword(password, admin.salt, admin.hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = createToken({
      id: admin.id,
      username: admin.username,
      role: admin.role
    });

    return res.json({
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server authentication failure' });
  }
});

apiRouter.get('/auth/me', requireAdmin, (req: AuthenticatedRequest, res) => {
  const admin = db.getAdmin();
  return res.json({
    id: admin.id,
    username: admin.username,
    role: admin.role
  });
});

apiRouter.post('/auth/change-password', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const admin = db.getAdmin();
    const isValid = verifyPassword(currentPassword, admin.salt, admin.hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    db.updateAdminPassword(newPassword);
    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err: any) {
    console.error('Change password error:', err);
    return res.status(500).json({ error: 'Failed to update password' });
  }
});

// --- Settings Endpoints ---
apiRouter.get('/settings', (req, res) => {
  return res.json(db.getSettings());
});

apiRouter.put('/settings', requireAdmin, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update settings' });
  }
});

// --- Products Endpoints ---
apiRouter.get('/products', (req, res) => {
  try {
    const { category, search, status, featured, sort, includeInactive } = req.query;
    const products = db.getProducts({
      category: category as string,
      search: search as string,
      status: status as string,
      featured: featured === 'true',
      sort: sort as string,
      includeInactive: includeInactive === 'true'
    });
    return res.json(products);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
});

apiRouter.get('/products/slug/:slug', (req, res) => {
  const product = db.getProductBySlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(product);
});

apiRouter.get('/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(product);
});

apiRouter.post('/products', requireAdmin, (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    // Generate unique slug if not provided
    let slug = data.slug
      ? data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : data.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check slug collision
    if (db.getProductBySlug(slug)) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newProduct = db.createProduct({
      name: data.name.trim(),
      slug,
      description: data.description || '',
      category: data.category || 'General',
      price: Number(data.price),
      previous_price: data.previous_price ? Number(data.previous_price) : undefined,
      discount: data.discount ? Number(data.discount) : undefined,
      images: Array.isArray(data.images) ? data.images.slice(0, 4) : [],
      sizes: Array.isArray(data.sizes) ? data.sizes : [],
      colors: Array.isArray(data.colors) ? data.colors : [],
      stock: Number(data.stock || 0),
      status: data.status || 'active',
      specifications: data.specifications || {},
      is_featured: Boolean(data.is_featured)
    });

    return res.status(201).json(newProduct);
  } catch (err: any) {
    console.error('Create product error:', err);
    return res.status(500).json({ error: 'Failed to create product' });
  }
});

apiRouter.put('/products/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update product' });
  }
});

apiRouter.delete('/products/:id', requireAdmin, (req, res) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json({ success: true, message: 'Product deleted successfully' });
});

// --- Categories Endpoints ---
apiRouter.get('/categories', (req, res) => {
  return res.json(db.getCategories());
});

apiRouter.post('/categories', requireAdmin, (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat = db.createCategory({
      name: name.trim(),
      slug,
      image: image || '',
      status: 'active'
    });
    return res.status(201).json(newCat);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create category' });
  }
});

apiRouter.put('/categories/:id', requireAdmin, (req, res) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Category not found' });
  }
  return res.json(updated);
});

apiRouter.delete('/categories/:id', requireAdmin, (req, res) => {
  const success = db.deleteCategory(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Category not found' });
  }
  return res.json({ success: true, message: 'Category deleted successfully' });
});

// --- Orders Endpoints ---
apiRouter.post('/orders', (req, res) => {
  try {
    const {
      customer_name,
      phone,
      alternative_phone,
      division,
      district,
      upazila,
      area,
      address,
      product_id,
      selected_size,
      selected_color,
      quantity,
      delivery_charge,
      note,
      items
    } = req.body;

    // Validation
    if (!customer_name || !customer_name.trim()) {
      return res.status(400).json({ error: 'Please enter your full name' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'Please enter your mobile phone number' });
    }

    // Validate Bangladesh mobile number (e.g. 01XXXXXXXXX or +8801XXXXXXXXX)
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const bdPhoneRegex = /^(?:\+?8801|01)[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        error: 'Please enter a valid 11-digit Bangladesh phone number (e.g. 01712345678)'
      });
    }

    if (!division || !district || !upazila) {
      return res.status(400).json({ error: 'Please complete your division, district, and upazila/thana selection' });
    }

    if (!address || address.trim().length < 5) {
      return res.status(400).json({ error: 'Please provide your full delivery street/house address' });
    }

    if (!product_id) {
      return res.status(400).json({ error: 'No product selected for order' });
    }

    const order = db.createOrder({
      customer_name,
      phone: cleanPhone,
      alternative_phone,
      division,
      district,
      upazila,
      area: area || upazila,
      address,
      product_id,
      selected_size,
      selected_color,
      quantity: Number(quantity) || 1,
      delivery_charge: typeof delivery_charge === 'number' ? delivery_charge : 120,
      note,
      items
    });

    return res.status(201).json(order);
  } catch (err: any) {
    console.error('Order creation failed:', err);
    return res.status(400).json({ error: err.message || 'Failed to place order' });
  }
});

apiRouter.get('/orders', requireAdmin, (req, res) => {
  try {
    const { search, status } = req.query;
    const orders = db.getOrders({
      search: search as string,
      status: status as string
    });
    return res.json(orders);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

apiRouter.get('/orders/:orderId', (req, res) => {
  const order = db.getOrderById(req.params.orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json(order);
});

apiRouter.put('/orders/:orderId/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  const updated = db.updateOrderStatus(req.params.orderId, status);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json(updated);
});

// --- Dashboard Statistics Endpoint ---
apiRouter.get('/stats', requireAdmin, (req, res) => {
  try {
    const stats = db.getStats();
    return res.json(stats);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to generate stats' });
  }
});

// --- Image Upload Endpoint ---
// Accepts JSON { image: "data:image/jpeg;base64,..." } and saves to uploads folder
apiRouter.post('/upload', requireAdmin, (req, res) => {
  try {
    const { image, name } = req.body || {};
    if (!image || !image.startsWith('data:image')) {
      return res.status(400).json({ error: 'Valid base64 image data is required' });
    }

    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 string' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const ext = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1] || 'png';
    const filename = `img-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const publicUrl = `/uploads/${filename}`;
    return res.json({ url: publicUrl, filename });
  } catch (err: any) {
    console.error('Image upload failed:', err);
    return res.status(500).json({ error: 'Image upload failed' });
  }
});
