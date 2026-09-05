import React from 'react';
import { CheckCircle2, Banknote, Truck, PhoneCall, Copy, Check } from 'lucide-react';
import { Order } from '../../types/index';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.order_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 p-6 sm:p-8 text-center space-y-6">
        {/* Animated Success Badge */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Order Confirmed (অর্ডার সফল হয়েছে)
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            Thank You, {order.customer_name}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Your order has been recorded in our system and is being processed for fast dispatch.
          </p>
        </div>

        {/* Order ID Pill */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="text-left">
            <span className="text-[11px] font-semibold text-slate-500 block">Your Order ID:</span>
            <span className="text-base font-black text-emerald-800 tracking-wider">
              #{order.order_id}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyOrderId}
            className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy ID'}</span>
          </button>
        </div>

        {/* Snapshot Summary */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-bold text-slate-800">
            <span>Ordered Item(s)</span>
            <span>Quantity</span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-slate-900">{order.product_name_snapshot}</p>
              <div className="flex items-center gap-2 text-slate-500 mt-0.5 text-[11px]">
                {order.selected_size && <span>Size: {order.selected_size}</span>}
                {order.selected_color && <span>• Color: {order.selected_color}</span>}
              </div>
            </div>
            <span className="font-extrabold text-slate-800">x{order.quantity}</span>
          </div>
          <hr className="border-slate-200" />
          <div className="space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span>Delivery Address:</span>
              <span className="font-semibold text-slate-900 text-right max-w-[200px] truncate">
                {order.address}, {order.upazila}, {order.district}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Contact Mobile:</span>
              <span className="font-semibold text-slate-900">{order.phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge:</span>
              <span className="font-semibold text-slate-900">৳{order.delivery_charge}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
              <span>Total Payable Amount:</span>
              <span className="text-emerald-700">৳{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Instruction Notice */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left flex items-start gap-3">
          <Banknote className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <p className="font-bold">ক্যাশ অন ডেলিভারি (Cash on Delivery)</p>
            <p className="mt-0.5 text-amber-800">
              কুরিয়ার ডেলিভারিম্যান আপনার ঠিকানায় পার্সেল নিয়ে পৌঁছালে পণ্যের মোট মূল্য <strong>৳{order.total.toLocaleString()}</strong> নগদ পরিশোধ করে পার্সেল গ্রহণ করুন।
            </p>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          Continue Shopping (আরও কেনাকাটা করুন)
        </button>
      </div>
    </div>
  );
};
