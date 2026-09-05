import React, { useState, useEffect, useMemo } from 'react';
import { X, ShieldCheck, Banknote, Truck, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { BANGLADESH_DIVISIONS, getDeliveryZone } from '../../data/bangladeshData';
import { useCart } from '../../context/CartContext';
import { api } from '../../services/api';
import { StoreSettings } from '../../types/index';

interface CheckoutModalProps {
  settings?: StoreSettings | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ settings }) => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    checkoutProduct,
    cart,
    clearCart,
    setCompletedOrder
  } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [upazila, setUpazila] = useState('Dhanmondi');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtered Districts based on Division
  const currentDivisionObj = useMemo(() => {
    return BANGLADESH_DIVISIONS.find((d) => d.name === division) || BANGLADESH_DIVISIONS[0];
  }, [division]);

  const availableDistricts = useMemo(() => {
    return currentDivisionObj.districts.map((d) => d.name);
  }, [currentDivisionObj]);

  // Filtered Upazilas based on District
  const currentDistrictObj = useMemo(() => {
    return currentDivisionObj.districts.find((d) => d.name === district) || currentDivisionObj.districts[0];
  }, [currentDivisionObj, district]);

  const availableUpazilas = useMemo(() => {
    if (!currentDistrictObj) return [];
    return currentDistrictObj.upazilas.map((u) => (typeof u === 'string' ? u : u.name));
  }, [currentDistrictObj]);

  // When division changes, default district and upazila
  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const divObj = BANGLADESH_DIVISIONS.find((d) => d.name === newDiv);
    if (divObj && divObj.districts.length > 0) {
      const firstDist = divObj.districts[0];
      setDistrict(firstDist.name);
      if (firstDist.upazilas.length > 0) {
        const firstUp = firstDist.upazilas[0];
        setUpazila(typeof firstUp === 'string' ? firstUp : firstUp.name);
      }
    }
  };

  // When district changes, default upazila
  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const distObj = currentDivisionObj.districts.find((d) => d.name === newDist);
    if (distObj && distObj.upazilas.length > 0) {
      const firstUp = distObj.upazilas[0];
      setUpazila(typeof firstUp === 'string' ? firstUp : firstUp.name);
    }
  };

  // Compute Delivery Charge dynamically
  const deliveryCharge = useMemo(() => {
    const zone = getDeliveryZone(division, district, upazila);
    const insideRate = settings?.delivery_charge_inside_dhaka ?? 70;
    const otherRate = settings?.delivery_charge_other_dhaka ?? 100;
    const outsideRate = settings?.delivery_charge_outside_dhaka ?? 120;

    if (zone === 'dhaka_city') return insideRate;
    if (zone === 'other_dhaka') return otherRate;
    return outsideRate;
  }, [division, district, upazila, settings]);

  // Determine items to order (either single direct product or entire cart)
  const isDirectOrder = Boolean(checkoutProduct);
  const items = useMemo(() => {
    if (isDirectOrder && checkoutProduct) {
      return [
        {
          product: checkoutProduct.product,
          selectedSize: checkoutProduct.selectedSize,
          selectedColor: checkoutProduct.selectedColor,
          quantity: checkoutProduct.quantity,
          subtotal: checkoutProduct.product.price * checkoutProduct.quantity
        }
      ];
    }
    return cart.map((item) => ({
      product: item.product,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity
    }));
  }, [isDirectOrder, checkoutProduct, cart]);

  const itemsSubtotal = useMemo(() => {
    return items.reduce((acc, it) => acc + it.subtotal, 0);
  }, [items]);

  const grandTotal = itemsSubtotal + deliveryCharge;

  if (!isCheckoutOpen || items.length === 0) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side Validation
    if (!customerName.trim()) {
      setError('Please enter your full name');
      return;
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    const bdPhoneRegex = /^(?:\+?8801|01)[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanPhone)) {
      setError('Please enter a valid 11-digit Bangladesh phone number (e.g. 01712345678)');
      return;
    }

    if (!division || !district || !upazila) {
      setError('Please complete your Division, District, and Upazila/Thana selection');
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setError('Please provide your full delivery street / house address for courier');
      return;
    }

    setLoading(true);

    try {
      const primaryItem = items[0];
      const payload = {
        customer_name: customerName.trim(),
        phone: cleanPhone,
        alternative_phone: altPhone.trim() || undefined,
        division,
        district,
        upazila,
        area: area.trim() || upazila,
        address: address.trim(),
        product_id: primaryItem.product.id,
        selected_size: primaryItem.selectedSize,
        selected_color: primaryItem.selectedColor,
        quantity: primaryItem.quantity,
        delivery_charge: deliveryCharge,
        note: note.trim() || undefined,
        items: items.map((it) => ({
          product_id: it.product.id,
          selected_size: it.selectedSize,
          selected_color: it.selectedColor,
          quantity: it.quantity
        }))
      };

      const created = await api.createOrder(payload);

      // Order created successfully
      if (!isDirectOrder) {
        clearCart();
      }
      setIsCheckoutOpen(false);
      setCompletedOrder(created);
    } catch (err: any) {
      setError(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
      onClick={() => setIsCheckoutOpen(false)}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Cash on Delivery Checkout (অর্ডার কনফার্ম করুন)
              </h2>
              <p className="text-xs text-emerald-200">
                পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন • কোনো অগ্রিম টাকা দিতে হবে না
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form & Summary Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Selected Product(s) Summary Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Order Items ({items.length})
            </h3>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                      {item.selectedSize && (
                        <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold">
                          Color: {item.selectedColor}
                        </span>
                      )}
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                      ৳{item.subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-200">
              Customer Information (গ্রাহকের তথ্য)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name (আপনার নাম) <span className="text-rose-600">*</span>
                </label>
                <input
                  id="checkout-customer-name"
                  type="text"
                  required
                  placeholder="e.g. Md. Shakil Ahmed"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (মোবাইল নম্বর) <span className="text-rose-600">*</span>
                </label>
                <input
                  id="checkout-customer-phone"
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alternative Phone Number (বিকল্প মোবাইল নম্বর - ঐচ্ছিক)
                </label>
                <input
                  type="tel"
                  placeholder="Optional backup phone number"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Bangladesh Cascading Address System */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Delivery Address (ডেলিভারি ঠিকানা - সারা বাংলাদেশ)
              </h3>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                Automatic Delivery Charge
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Division Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Division (বিভাগ) <span className="text-rose-600">*</span>
                </label>
                <select
                  id="checkout-division-select"
                  value={division}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-emerald-500"
                >
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <option key={div.name} value={div.name}>
                      {div.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  District (জেলা) <span className="text-rose-600">*</span>
                </label>
                <select
                  id="checkout-district-select"
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-emerald-500"
                >
                  {availableDistricts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upazila/Thana Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upazila / Thana (থানা) <span className="text-rose-600">*</span>
                </label>
                <select
                  id="checkout-upazila-select"
                  value={upazila}
                  onChange={(e) => setUpazila(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-medium focus:bg-white focus:outline-hidden focus:border-emerald-500"
                >
                  {availableUpazilas.map((upz) => (
                    <option key={upz} value={upz}>
                      {upz}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Area / Sector / Village (এলাকা / সেক্টর / গ্রাম)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sector 4, Road 7 or Shantinagar"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Delivery Note (ডেলিভারি নোট - ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before delivery, morning delivery"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Street / House Address (সম্পূর্ণ ঠিকানা) <span className="text-rose-600">*</span>
              </label>
              <textarea
                id="checkout-full-address"
                required
                rows={2}
                placeholder="House No, Road No, Flat/Floor, Holding No, Nearby Landmark..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Pricing & Delivery Charge Summary Breakdown */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="flex justify-between text-xs text-slate-700">
              <span>Products Subtotal:</span>
              <span className="font-bold">৳{itemsSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-700">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Delivery Charge ({district === 'Dhaka' ? 'Inside/Near Dhaka' : 'Outside Dhaka'}):</span>
              </span>
              <span className="font-bold text-emerald-800">৳{deliveryCharge}</span>
            </div>
            <hr className="border-emerald-200 my-1.5" />
            <div className="flex justify-between text-base sm:text-lg font-black text-slate-900">
              <span>Grand Total (সর্বমোট মূল্য):</span>
              <span className="text-emerald-800">৳{grandTotal.toLocaleString()}</span>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs text-emerald-900 font-semibold bg-emerald-100/60 p-2.5 rounded-xl">
              <span className="flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-emerald-700" />
                Payment Method:
              </span>
              <span className="font-extrabold uppercase">Cash on Delivery (ক্যাশ অন ডেলিভারি)</span>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            id="checkout-submit-order-btn"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black text-base uppercase tracking-wider shadow-lg shadow-amber-500/20 cursor-pointer transition-all disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Placing Your Order...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>CONFIRM ORDER (অর্ডার নিশ্চিত করুন) • ৳{grandTotal.toLocaleString()}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
