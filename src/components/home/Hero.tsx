import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Banknote, Sparkles } from 'lucide-react';
import { StoreSettings } from '../../types/index';

interface HeroProps {
  settings?: StoreSettings | null;
  onShopNow: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onShopNow }) => {
  return (
    <section className="relative overflow-hidden bg-radial from-slate-900 via-slate-900 to-emerald-950 text-white py-12 lg:py-20 border-b border-emerald-950/40">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold tracking-wide backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settings?.hero_badge || "AUTHENTIC PRODUCTS • FAST NATIONWIDE COURIER"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {settings?.hero_headline || "Premium Fashion & Lifestyle In Bangladesh"}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              {settings?.hero_subtext ||
                "Order genuine clothing, traditional panjabi, sarees, watches & tech accessories with confidence. Check parcel at your door and pay with 100% Cash on Delivery across all 64 districts."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                id="hero-shop-now-btn"
                onClick={onShopNow}
                className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-base font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-emerald-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Shop All Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#trust-section"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-base font-semibold px-6 py-3.5 rounded-xl backdrop-blur-sm transition-all"
              >
                <span>Why Cash On Delivery?</span>
              </a>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-900/60 text-emerald-400">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">Cash on Delivery</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Pay after parcel arrives</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-900/60 text-emerald-400">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">64 Districts</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Rapid doorstep delivery</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-900/60 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">100% Quality</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">7-day replacement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Right Visuals */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-30 blur-xl"></div>

              {/* Main Visual Card */}
              <div className="relative rounded-2xl bg-slate-800/90 border border-slate-700/80 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=800&q=80"
                  alt="SHOP BD BAZAR Featured Panjabi and Fashion Collection"
                  className="w-full h-84 object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="p-5 bg-gradient-to-t from-slate-950 via-slate-900/90 to-transparent">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-sm">
                        Festive Highlight
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">
                        Royal Platinum Jacquard Panjabi
                      </h3>
                      <p className="text-xs text-slate-300">
                        Available in S, M, L, XL, XXL with Rich Color Swatches
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 line-through">৳2,450</span>
                      <p className="text-xl font-extrabold text-emerald-400">৳1,850</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badge Floating Element */}
              <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 rounded-xl p-3 shadow-xl border border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">ক্যাশ অন ডেলিভারি</p>
                  <p className="text-[11px] text-slate-500">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
