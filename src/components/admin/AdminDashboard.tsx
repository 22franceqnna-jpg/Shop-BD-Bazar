import React from 'react';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  AlertTriangle,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { DashboardStats, Order } from '../../types/index';

interface AdminDashboardProps {
  stats: DashboardStats | null;
  onNavigateTab: (tab: string) => void;
  onSelectOrder: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  onNavigateTab,
  onSelectOrder
}) => {
  if (!stats) {
    return (
      <div className="p-8 text-center text-slate-500 animate-pulse">
        Loading dashboard metrics...
      </div>
    );
  }

  const orderStatsCards = [
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Confirmed Orders', value: stats.confirmedOrders, icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: 'Processing', value: stats.processingOrders, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { label: 'Shipped', value: stats.shippedOrders, icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { label: 'Delivered', value: stats.deliveredOrders, icon: PackageCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Cancelled', value: stats.cancelledOrders, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' }
  ];

  return (
    <div className="space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Store Performance Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time overview of orders, inventory, and sales performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('add-product')}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs cursor-pointer transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-2xs cursor-pointer transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>View All Orders</span>
          </button>
        </div>
      </div>

      {/* Primary Hero Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Total Sales (বিক্রি)
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              ৳{stats.totalSales.toLocaleString()}
            </h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              From confirmed & delivered orders
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Total Orders
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {stats.totalOrders}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              {stats.pendingOrders} pending confirmation
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Total Products
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {stats.totalProducts}
            </h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              {stats.activeProducts} currently active in catalog
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Out of Stock Alert */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Out of Stock
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {stats.outOfStockProducts}
            </h3>
            <p className="text-[11px] text-rose-600 font-bold mt-1">
              Require inventory restock
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Order Status Breakdown Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Order Status Breakdown
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {orderStatsCards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigateTab('orders')}
                className={`p-4 rounded-2xl border ${c.border} ${c.bg} cursor-pointer hover:shadow-sm transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${c.color}`} />
                  <span className={`text-xl font-black ${c.color}`}>{c.value}</span>
                </div>
                <p className="text-xs font-bold text-slate-800">{c.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500">Latest orders submitted with Cash on Delivery</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            <span>See All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No orders placed yet. As customers order with Cash on Delivery, they will appear here instantly!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Phone</th>
                  <th className="px-5 py-3">Product Snapshot</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Total (৳)</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-emerald-800">
                      #{order.order_id}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">
                      {order.customer_name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono">
                      {order.phone}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 line-clamp-1">
                        {order.product_name_snapshot}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {order.selected_size && <span>Size: {order.selected_size} </span>}
                        {order.selected_color && <span>• {order.selected_color} </span>}
                        <span>• Qty: {order.quantity}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {order.district}, {order.division}
                    </td>
                    <td className="px-5 py-3.5 font-extrabold text-slate-900">
                      ৳{order.total.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'Confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Processing'
                            ? 'bg-indigo-100 text-indigo-800'
                            : order.status === 'Shipped'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => {
                          onSelectOrder(order);
                          onNavigateTab('orders');
                        }}
                        className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
