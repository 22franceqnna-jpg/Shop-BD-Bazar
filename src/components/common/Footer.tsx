import React from 'react';
import { PhoneCall, Mail, MapPin, Facebook, Instagram, MessageCircle, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '../../types/index';

interface FooterProps {
  settings?: StoreSettings | null;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                BD
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                SHOP BD BAZAR
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {settings?.tagline ||
                "Bangladesh's trusted e-commerce marketplace offering premium clothing, festive collections, and lifestyle accessories with rapid Cash on Delivery to all 64 districts."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={settings?.facebook_url || "https://facebook.com"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings?.instagram_url || "https://instagram.com"}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${settings?.whatsapp_number?.replace(/\+/g, '') || '8801712345678'}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="WhatsApp Support"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-emerald-400 transition-colors">
                  All Products
                </a>
              </li>
              <li>
                <a href="#categories-section" className="hover:text-emerald-400 transition-colors">
                  Categories
                </a>
              </li>
              <li>
                <a href="#trust-section" className="hover:text-emerald-400 transition-colors">
                  Cash on Delivery
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  Admin Portal (Shakil0099)
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Customer Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-400 hover:text-slate-200">
                  Payment: Cash on Delivery (COD)
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-slate-200">
                  Delivery Charge: Inside Dhaka ৳70 | Suburb ৳100 | Outside ৳120
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-slate-200">
                  7 Days Easy Replacement Policy
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-slate-200">
                  Privacy & Data Protection
                </span>
              </li>
              <li>
                <span className="text-slate-400 hover:text-slate-200">
                  Terms & Conditions
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Contact & Hotline
            </h4>
            <div className="space-y-2.5 text-xs">
              <a
                href={`tel:${settings?.phone || '+8801712345678'}`}
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{settings?.phone || '+880 1712-345678'}</span>
              </a>
              <a
                href={`mailto:${settings?.email || 'support@shopbdbazar.com'}`}
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{settings?.email || 'support@shopbdbazar.com'}</span>
              </a>
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{settings?.address || 'House 24, Road 4, Dhanmondi, Dhaka 1205, Bangladesh'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SHOP BD BAZAR. All rights reserved. Developed for Bangladesh E-Commerce.</p>
          <div className="flex items-center gap-2 text-emerald-500 text-xs font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Cash on Delivery Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
