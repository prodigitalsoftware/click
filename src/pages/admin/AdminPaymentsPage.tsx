import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, RefreshCw, CheckCircle, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { adminAPI, paymentAPI } from '../../services/api';

export const AdminPaymentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments', statusFilter],
    queryFn: () => adminAPI.getPayments({ status: statusFilter !== 'all' ? statusFilter : undefined }),
  });

  const checkMutation = useMutation({
    mutationFn: (paymentId: string) => paymentAPI.checkStatus(paymentId),
    onSuccess: (res) => {
      alert(res.message || 'Payment status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-payments'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">KHQR Payment Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Official Bakong EMVCo transactions, MD5 hashes, and status verifications
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 bg-white outline-none"
        >
          <option value="all">All Payment Statuses</option>
          <option value="successful">Successful</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Provider</th>
                <th className="p-4">Status</th>
                <th className="p-4">Expires</th>
                <th className="p-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : data?.payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                data?.payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-gray-900">{p.transactionId}</td>
                    <td className="p-4 font-mono text-gray-600">
                      #{typeof p.order === 'object' ? (p.order as any).orderNumber : p.order}
                    </td>
                    <td className="p-4 font-black text-gray-900">
                      ${p.amount.toFixed(2)} {p.currency}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700">
                        {p.provider}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.paymentStatus === 'successful'
                            ? 'bg-emerald-50 text-emerald-700'
                            : p.paymentStatus === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-[11px]">
                      {new Date(p.expiresAt).toLocaleTimeString()}
                    </td>
                    <td className="p-4 text-right">
                      {p.paymentStatus === 'pending' && (
                        <button
                          onClick={() => checkMutation.mutate(p._id)}
                          disabled={checkMutation.isPending}
                          className="px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 font-bold hover:bg-brand-100 transition-colors inline-flex items-center gap-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Verify with Bakong</span>
                        </button>
                      )}
                      {p.paymentStatus === 'successful' && (
                        <span className="text-emerald-600 font-semibold inline-flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

