import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  PhoneCall,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
  Eye,
  AlertCircle,
  Banknote,
  Printer
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/index';
import { api } from '../../services/api';

interface AdminOrdersProps {
  orders: Order[];
  onOrderUpdated: () => void;
  initialSelectedOrder?: Order | null;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  onOrderUpdated,
  initialSelectedOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(initialSelectedOrder || null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialSelectedOrder) {
      setSelectedOrder(initialSelectedOrder);
    }
  }, [initialSelectedOrder]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product_name_snapshot.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    setError(null);
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      onOrderUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Customer Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review incoming orders, verify phone addresses, and update courier delivery statuses
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by Order #, Customer, Phone, City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(
            (st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter.toLowerCase() === st.toLowerCase()
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {st === 'all' ? `All (${orders.length})` : st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Address (BD)</th>
                <th className="px-4 py-3">Product Snapshot</th>
                <th className="px-4 py-3">Total (৳)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Order ID */}
                    <td className="px-4 py-3.5 font-bold text-emerald-800 whitespace-nowrap">
                      #{order.order_id}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{order.customer_name}</div>
                      <a
                        href={`tel:${order.phone}`}
                        className="text-[11px] text-emerald-700 font-mono hover:underline flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{order.phone}</span>
                      </a>
                    </td>

                    {/* Address */}
                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="font-semibold text-slate-800">
                        {order.upazila}, {order.district}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate" title={order.address}>
                        {order.address}
                      </div>
                    </td>

                    {/* Product Snapshot */}
                    <td className="px-4 py-3.5 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate">
                        {order.product_name_snapshot}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {order.selected_size && <span>Size: {order.selected_size} </span>}
                        {order.selected_color && <span>• {order.selected_color} </span>}
                        <span>• Qty: {order.quantity}</span>
                      </div>
                    </td>

                    {/* Grand Total */}
                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-slate-900">
                        ৳{order.total.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        (Deliv: ৳{order.delivery_charge})
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="px-4 py-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        disabled={updatingId === order.id}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer focus:outline-hidden ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Action View */}
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="View Full Order Snapshot"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Snapshot Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase">
                  Order Details Snapshot
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">
                  Order #{selectedOrder.order_id}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Status Selector & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)
                  }
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer ${getStatusBadge(
                    selectedOrder.status
                  )}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Method
                </label>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 p-2 bg-white rounded-xl border border-slate-200">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Cash on Delivery (COD)</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-200">
                Customer & Delivery Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Customer Name:</span>
                  <span className="font-bold text-slate-900">{selectedOrder.customer_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Primary Mobile Phone:</span>
                  <a
                    href={`tel:${selectedOrder.phone}`}
                    className="font-bold text-emerald-700 flex items-center gap-1 hover:underline"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{selectedOrder.phone}</span>
                  </a>
                </div>
                {selectedOrder.alternative_phone && (
                  <div>
                    <span className="text-slate-500 block">Alternative Phone:</span>
                    <a
                      href={`tel:${selectedOrder.alternative_phone}`}
                      className="font-bold text-slate-800 hover:underline"
                    >
                      {selectedOrder.alternative_phone}
                    </a>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 block">Geographic Location:</span>
                  <span className="font-bold text-slate-900">
                    {selectedOrder.upazila}, {selectedOrder.district}, {selectedOrder.division}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">Full Street / Courier Address:</span>
                  <span className="font-bold text-slate-900 block p-2.5 bg-slate-50 rounded-xl border border-slate-200 mt-1">
                    {selectedOrder.address} {selectedOrder.area ? `(Area: ${selectedOrder.area})` : ''}
                  </span>
                </div>
                {selectedOrder.note && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block">Customer Special Instructions / Note:</span>
                    <span className="font-semibold text-slate-800 italic block p-2 bg-amber-50/70 border border-amber-200 rounded-xl mt-1">
                      "{selectedOrder.note}"
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Snapshot (Protected from product edits) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-200">
                Purchased Items Snapshot (Historical Data)
              </h3>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{selectedOrder.product_name_snapshot}</h4>
                    <div className="flex items-center gap-2 text-slate-500 mt-1">
                      {selectedOrder.selected_size && (
                        <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          Size: {selectedOrder.selected_size}
                        </span>
                      )}
                      {selectedOrder.selected_color && (
                        <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          Color: {selectedOrder.selected_color}
                        </span>
                      )}
                      <span>Quantity: x{selectedOrder.quantity}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    ৳{(selectedOrder.price_snapshot * selectedOrder.quantity).toLocaleString()}
                  </span>
                </div>

                <hr className="border-slate-200 my-2" />

                <div className="space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Products Subtotal:</span>
                    <span className="font-bold">৳{(selectedOrder.price_snapshot * selectedOrder.quantity).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge:</span>
                    <span className="font-bold text-emerald-800">৳{selectedOrder.delivery_charge}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-900 pt-1">
                    <span>Grand Total Due:</span>
                    <span className="text-emerald-700">৳{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
