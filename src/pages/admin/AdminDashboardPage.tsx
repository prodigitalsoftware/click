import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { adminAPI } from '../../services/api';

export const AdminDashboardPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminAPI.getDashboardStats(),
  });

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-gray-500 animate-pulse">Loading dashboard metrics...</div>;
  }

  const { stats, monthlySales, topProducts, recentOrders } = data || {
    stats: { totalRevenue: 0, totalOrders: 0, paidOrders: 0, pendingOrders: 0, totalCustomers: 0, totalProducts: 0 },
    monthlySales: [],
    topProducts: [],
    recentOrders: [],
  };

  const maxSale = Math.max(...monthlySales.map((m: any) => m.sales), 100);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-xs text-gray-500 mt-1">Live performance metrics and revenue analytics</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
          <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>≈ {(stats.totalRevenue * 4100).toLocaleString()} ៛ KHR</span>
          </p>
        </div>

        {/* Paid Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Paid Orders</span>
            <div className="p-2 rounded-xl bg-blue-50 text-brand-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">{stats.paidOrders}</p>
          <p className="text-[11px] text-gray-400">
            Out of {stats.totalOrders} total orders
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Orders</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600">{stats.pendingOrders}</p>
          <p className="text-[11px] text-gray-400">Awaiting KHQR payment scan</p>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider">Customers</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-gray-900">{stats.totalCustomers}</p>
          <p className="text-[11px] text-gray-400">{stats.totalProducts} products listed</p>
        </div>
      </div>

      {/* Sales Chart & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Sales Visual Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-gray-900">Monthly Revenue Trend</h3>
              <p className="text-xs text-gray-400">USD Sales volume over past 6 months</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700">
              2026 Season
            </span>
          </div>

          <div className="h-52 flex items-end justify-between gap-4 pt-6 pb-2 px-2 border-b border-gray-100">
            {monthlySales.map((item: any, idx: number) => {
              const heightPercent = Math.round((item.sales / maxSale) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${item.sales}
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[40px] bg-gradient-to-t from-brand-600 to-blue-400 rounded-t-xl group-hover:from-brand-700 group-hover:to-blue-500 transition-all duration-300 shadow-xs"
                  />
                  <span className="text-[11px] font-bold text-gray-400">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-gray-900">Top Rated Products</h3>
            <Link to="/admin/products" className="text-xs text-brand-600 font-bold hover:underline">
              Manage
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {topProducts.map((prod: any) => (
              <div key={prod._id} className="py-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate">{prod.name}</p>
                  <p className="text-gray-400 text-[10px]">
                    ⭐ {prod.rating} ({prod.numReviews} reviews)
                  </p>
                </div>
                <span className="font-extrabold text-brand-700 flex-shrink-0">
                  ${prod.discountPrice ?? prod.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-gray-900">Recent Customer Orders</h3>
            <p className="text-xs text-gray-400">Live transaction stream with payment status</p>
          </div>
          <Link to="/admin/orders" className="text-xs text-brand-600 font-bold hover:underline">
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((ord: any) => (
                <tr key={ord._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-gray-900">#{ord.orderNumber}</td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-900">{ord.customerDetails?.name}</p>
                    <p className="text-gray-400 text-[11px]">{ord.customerDetails?.email}</p>
                  </td>
                  <td className="p-4 font-bold text-gray-900">${ord.total.toFixed(2)}</td>
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
                  <td className="p-4 text-gray-400 text-[11px]">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

