import React, { useState } from 'react';
import { User, Lock, KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const AdminProfile: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Admin Profile & Security
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your administrative credentials and password authentication
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl">
            S
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Shakil0099</h2>
            <p className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md inline-block mt-0.5">
              Super Administrator
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-500 block">Username:</span>
            <span className="font-bold text-slate-900 font-mono">Shakil0099</span>
          </div>
          <div>
            <span className="text-slate-500 block">Access Privileges:</span>
            <span className="font-bold text-emerald-700">Full Store Access</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <Lock className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
            Change Admin Password
          </h3>
        </div>

        {success && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Password updated successfully! Next login requires your new password.</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Current Password (বর্তমান পাসওয়ার্ড)
            </label>
            <input
              type="password"
              required
              placeholder="Enter current password (default: Shakil9900)"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              New Password (নতুন পাসওয়ার্ড)
            </label>
            <input
              type="password"
              required
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Confirm New Password (নতুন পাসওয়ার্ড নিশ্চিত করুন)
            </label>
            <input
              type="password"
              required
              placeholder="Re-type new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
