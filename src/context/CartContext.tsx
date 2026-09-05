import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order } from '../types/index';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedSize?: string, selectedColor?: string, quantity?: number) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  totalCartItems: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  
  // Checkout modal state
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutProduct: {
    product: Product;
    selectedSize?: string;
    selectedColor?: string;
    quantity: number;
  } | null;
  openDirectCheckout: (product: Product, selectedSize?: string, selectedColor?: string, quantity?: number) => void;
  openCartCheckout: () => void;

  // Product detail view state
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  openProductModal: (product: Product) => void;

  // Order confirmation modal
  completedOrder: Order | null;
  setCompletedOrder: (order: Order | null) => void;

  // Global search & category filter triggers
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('sbb_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<{
    product: Product;
    selectedSize?: string;
    selectedColor?: string;
    quantity: number;
  } | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    try {
      localStorage.setItem('sbb_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [cart]);

  const addToCart = (product: Product, selectedSize?: string, selectedColor?: string, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, selectedSize, selectedColor, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index].quantity = quantity;
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const openDirectCheckout = (product: Product, selectedSize?: string, selectedColor?: string, quantity = 1) => {
    setCheckoutProduct({
      product,
      selectedSize,
      selectedColor,
      quantity
    });
    setIsCheckoutOpen(true);
  };

  const openCartCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutProduct(null); // Indicates checking out the entire cart
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCartItems,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        checkoutProduct,
        openDirectCheckout,
        openCartCheckout,
        selectedProduct,
        setSelectedProduct,
        openProductModal,
        completedOrder,
        setCompletedOrder,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
