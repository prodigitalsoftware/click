import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { TelegramChatButton } from './components/TelegramChatButton';
import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { AccountPage } from './pages/AccountPage';

// Admin Pages
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/40 text-gray-900">
      <ScrollToTop />

      {/* Show Customer Storefront Header & Navbar when not in Admin panel */}
      {!isAdminRoute && (
        <>
          <Header />
          <Navbar />
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          {/* Customer Storefront Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          <Route path="/account" element={<AccountPage />} />

          {/* Admin Protected Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </main>

      {/* Customer Footer, Cart Drawer, Auth Modal, Floating Telegram Button */}
      {!isAdminRoute && (
        <>
          <Footer />
          <CartDrawer />
          <TelegramChatButton />
        </>
      )}

      {/* Global Auth Modal accessible everywhere */}
      <AuthModal />
    </div>
  );
};

export default App;

