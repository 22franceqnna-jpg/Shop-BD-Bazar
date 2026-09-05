import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Banknote } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalCartItems,
    cartSubtotal,
    openCartCheckout
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      onClick={() => setIsCartOpen(false)}
    >
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cart Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-black text-slate-900">
                Shopping Cart ({totalCartItems})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Looks like you haven't added any products yet. Browse our collections and order with Cash on Delivery!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {item.product.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                    </div>
                    <div className="text-xs font-extrabold text-slate-900 mt-1">
                      ৳{item.product.price.toLocaleString()}
                    </div>

                    {/* Quantity Controls & Delete */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center border border-slate-200 rounded-lg bg-white text-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-600 hover:text-slate-900 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 font-bold text-slate-900 border-x border-slate-100">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-600 hover:text-slate-900 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(index)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900">৳{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold text-emerald-700">Calculated at address selection</span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between text-sm font-black text-slate-900">
                  <span>Estimated Total:</span>
                  <span className="text-emerald-800">৳{cartSubtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="cart-checkout-proceed-btn"
                onClick={openCartCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm uppercase tracking-wide shadow-md transition-all cursor-pointer"
              >
                <span>Proceed to Checkout (অর্ডার করুন)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pay with Cash on Delivery (COD)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
