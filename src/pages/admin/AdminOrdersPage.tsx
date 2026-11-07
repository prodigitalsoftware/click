import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Filter,
  Eye,
  RotateCcw,
  CheckCircle,
  Clock,
  X,
  CreditCard,
  User,
  Package,
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { Order } from '../../types';

export const AdminOrdersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', searchTerm, paymentFilter, orderFilter],
    queryFn: () =>
      adminAPI.getOrders({
        search: searchTerm || undefined,
        paymentStatus: paymentFilter !== 'all' ? paymentFilter : undefined,
        orderStatus: orderFilter !== 'all' ? orderFilter : undefined,
        limit: 50,
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      adminAPI.updateOrderStatus(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      if (selectedOrder) {
        setSelectedOrder(null);
      }
    },
  });

  const refundMutation = useMutation({
    mutationFn: (id: string) => adminAPI.refundOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      if (selectedOrder) {
        setSelectedOrder(null);
      }
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Order Management</h1>
        <p className="text-xs text-gray-500 mt-1">Review orders, verify payment status, and manage refunds</p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order number, customer name, email, phone, or transaction ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
          />
        </div>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="w-full sm:w-auto py-2 px-3 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-white outline-none"
        >
          <option value="all">All Payment Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    Loading orders...
                  </td>
                </tr>
              ) : data?.orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                data?.orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-gray-900">#{ord.orderNumber}</td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">{ord.customerDetails.name}</p>
                      <p className="text-gray-400 text-[11px]">{ord.customerDetails.email}</p>
                    </td>
                    <td className="p-4 font-semibold text-gray-600">{ord.items.length} items</td>
                    <td className="p-4 font-black text-gray-900">${ord.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ord.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : ord.paymentStatus === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-gray-700 font-medium">{ord.orderStatus}</span>
                    </td>
                    <td className="p-4 text-gray-400 text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 font-bold hover:bg-brand-100 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Actions Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-gray-100 p-6 space-y-5 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">
                  Order Details #{selectedOrder.orderNumber}
                </h3>
                <span className="text-[11px] text-gray-400 font-mono">
                  Ref: {selectedOrder.transactionRef || 'N/A'}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-gray-50 space-y-1.5">
              <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-600" />
                <span>Customer Information</span>
              </h4>
              <p>Name: <strong className="text-gray-900">{selectedOrder.customerDetails.name}</strong></p>
              <p>Email: <strong className="text-gray-900">{selectedOrder.customerDetails.email}</strong></p>
              <p>Phone: <strong className="text-gray-900">{selectedOrder.customerDetails.phone}</strong></p>
              {selectedOrder.customerDetails.telegram && (
                <p>Telegram: <strong className="text-sky-600">{selectedOrder.customerDetails.telegram}</strong></p>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-800 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-brand-600" />
                <span>Purchased Products</span>
              </h4>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                {selectedOrder.items.map((it, i) => (
                  <div key={i} className="p-3 flex justify-between items-center bg-white">
                    <div>
                      <p className="font-bold text-gray-900">{it.name}</p>
                      <p className="text-[10px] text-gray-400">Qty: {it.quantity}</p>
                    </div>
                    <span className="font-bold">${(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status change actions */}
            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                {selectedOrder.paymentStatus !== 'paid' && (
                  <button
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: selectedOrder._id,
                        updates: { paymentStatus: 'paid', orderStatus: 'completed' },
                      })
                    }
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Mark as Paid (Manual)
                  </button>
                )}

                {selectedOrder.paymentStatus === 'paid' && (
                  <button
                    onClick={() => {
                      if (confirm('Issue a refund for this order?')) {
                        refundMutation.mutate(selectedOrder._id);
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 font-bold hover:bg-rose-100"
                  >
                    Issue Refund
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 font-bold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

