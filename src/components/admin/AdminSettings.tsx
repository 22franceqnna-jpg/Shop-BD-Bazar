import React, { useState, useEffect } from 'react';
import { Settings, Save, Truck, Store, Phone, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { StoreSettings } from '../../types/index';
import { api } from '../../services/api';

interface AdminSettingsProps {
  settings: StoreSettings | null;
  onSettingsUpdated: (newSettings: StoreSettings) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onSettingsUpdated }) => {
  const [storeName, setStoreName] = useState(settings?.store_name || 'SHOP BD BAZAR');
  const [tagline, setTagline] = useState(settings?.tagline || '');
  const [heroHeadline, setHeroHeadline] = useState(settings?.hero_headline || '');
  const [heroSubtext, setHeroSubtext] = useState(settings?.hero_subtext || '');
  const [heroBadge, setHeroBadge] = useState(settings?.hero_badge || '');

  // Delivery Charges
  const [insideDhaka, setInsideDhaka] = useState(String(settings?.delivery_charge_inside_dhaka ?? 70));
  const [otherDhaka, setOtherDhaka] = useState(String(settings?.delivery_charge_other_dhaka ?? 100));
  const [outsideDhaka, setOutsideDhaka] = useState(String(settings?.delivery_charge_outside_dhaka ?? 120));

  // Contacts
  const [phone, setPhone] = useState(settings?.phone || '+880 1712-345678');
  const [whatsapp, setWhatsapp] = useState(settings?.whatsapp_number || '+880 1712-345678');
  const [email, setEmail] = useState(settings?.email || 'support@shopbdbazar.com');
  const [address, setAddress] = useState(settings?.address || 'House 24, Road 4, Dhanmondi, Dhaka 1205, Bangladesh');
  const [facebook, setFacebook] = useState(settings?.facebook_url || 'https://facebook.com');
  const [instagram, setInstagram] = useState(settings?.instagram_url || 'https://instagram.com');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setStoreName(settings.store_name);
      setTagline(settings.tagline);
      setHeroHeadline(settings.hero_headline);
      setHeroSubtext(settings.hero_subtext);
      setHeroBadge(settings.hero_badge);
      setInsideDhaka(String(settings.delivery_charge_inside_dhaka));
      setOtherDhaka(String(settings.delivery_charge_other_dhaka));
      setOutsideDhaka(String(settings.delivery_charge_outside_dhaka));
      setPhone(settings.phone);
      setWhatsapp(settings.whatsapp_number);
      setEmail(settings.email);
      setAddress(settings.address);
      setFacebook(settings.facebook_url);
      setInstagram(settings.instagram_url);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload: Partial<StoreSettings> = {
        store_name: storeName.trim(),
        tagline: tagline.trim(),
        hero_headline: heroHeadline.trim(),
        hero_subtext: heroSubtext.trim(),
        hero_badge: heroBadge.trim(),
        delivery_charge_inside_dhaka: parseInt(insideDhaka, 10) || 70,
        delivery_charge_other_dhaka: parseInt(otherDhaka, 10) || 100,
        delivery_charge_outside_dhaka: parseInt(outsideDhaka, 10) || 120,
        phone: phone.trim(),
        whatsapp_number: whatsapp.trim(),
        email: email.trim(),
        address: address.trim(),
        facebook_url: facebook.trim(),
        instagram_url: instagram.trim()
      };

      const updated = await api.updateSettings(payload);
      onSettingsUpdated(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update store settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Store & Delivery Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure nationwide delivery charges, hotline phone numbers, and brand content
        </p>
      </div>

      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings successfully saved and published!</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Delivery Charges (Core Requirement) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <Truck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Bangladesh Delivery Charge Configuration (ডেলিভারি চার্জ)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Inside Dhaka City (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={insideDhaka}
                  onChange={(e) => setInsideDhaka(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Default: ৳70</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Other Dhaka City Areas (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={otherDhaka}
                  onChange={(e) => setOtherDhaka(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Suburbs (Savar, Keraniganj, etc.): ৳100</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Outside Dhaka / Nationwide (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={outsideDhaka}
                  onChange={(e) => setOutsideDhaka(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:bg-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">All other 63 districts: ৳120</span>
            </div>
          </div>
        </div>

        {/* Store Brand Info */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <Store className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Store Identity & Hero Messaging
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Announcement Badge</label>
              <input
                type="text"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                placeholder="CASH ON DELIVERY ALL OVER BANGLADESH"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Hero Main Headline</label>
              <input
                type="text"
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                placeholder="Premium Fashion & Lifestyle In Bangladesh"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Hero Subtext Description</label>
              <textarea
                rows={2}
                value={heroSubtext}
                onChange={(e) => setHeroSubtext(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Hotline Contact Info */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
            <Phone className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Hotline & Support Coordinates
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Customer Care Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Facebook Page URL</label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Store / Warehouse Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black shadow-md cursor-pointer transition-all disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
