import React from 'react';
import { Banknote, Truck, ShieldCheck, Headphones, RefreshCw, Award } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustFeatures = [
    {
      icon: Banknote,
      title: "Cash on Delivery (ক্যাশ অন ডেলিভারি)",
      description: "Pay 100% in cash directly to delivery courier upon doorstep inspection. Zero advance risk.",
      badge: "No Advance Required"
    },
    {
      icon: Truck,
      title: "Fast Delivery in 64 Districts",
      description: "Delivered within 24-48 hours inside Dhaka and 48-72 hours across all 64 districts in Bangladesh.",
      badge: "Doorstep Courier"
    },
    {
      icon: ShieldCheck,
      title: "100% Premium Quality",
      description: "Every product is strictly inspected before dispatch to ensure fabric quality, stitching, and finishing.",
      badge: "Quality Guaranteed"
    },
    {
      icon: RefreshCw,
      title: "7-Day Easy Replacement",
      description: "Received wrong size or defect? Enjoy our customer-first 7-day hassle-free replacement policy.",
      badge: "Hassle-Free Return"
    },
    {
      icon: Headphones,
      title: "Dedicated Hotline Support",
      description: "Friendly Bangla & English customer support team ready to assist your orders via call or WhatsApp.",
      badge: "Direct Assistance"
    }
  ];

  return (
    <section id="trust-section" className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>THE SHOP BD BAZAR PROMISE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Why Thousands of Bangladeshi Shoppers Trust Us
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            We prioritize customer safety, genuine fabric craftsmanship, and convenient Cash on Delivery across the entire country.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
