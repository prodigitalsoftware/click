import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  CreditCard,
  Settings,
  ArrowLeft,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Access Restricted</h2>
        <p className="text-xs text-gray-500 mt-1 max-w-sm">
          You must be signed in as an administrator to access the NAVASEALSTORE Admin Portal.
        </p>
        <Link
          to="/"
          className="mt-6 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors shadow-sm"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  const navLinks = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', path: '/admin/users', icon: Users },
    { name: 'KHQR Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex flex-col justify-between flex-shrink-0">
        <div>
          {/* Logo & Portal title */}
          <div className="p-6 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                NV
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-gray-900">
                  NAVASEAL<span className="text-brand-600">ADMIN</span>
                </span>
                <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider -mt-1">
                  Control Center
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-brand-600" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-400" />
            <span>Back to Storefront</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
};

