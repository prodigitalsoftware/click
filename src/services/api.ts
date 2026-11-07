import axios from 'axios';
import {
  Product,
  Category,
  User,
  Order,
  Payment,
  Review,
  StoreSettings,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('navaseal_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData: { name: string; email: string; password: string; phone?: string }) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },
  resetPassword: async (data: { email: string; newPassword: string }) => {
    const res = await api.post('/auth/reset-password', data);
    return res.data;
  },
};

export const productAPI = {
  getProducts: async (params?: any) => {
    const res = await api.get<{ success: boolean; products: Product[]; pagination: any }>('/products', { params });
    return res.data;
  },
  getProductById: async (id: string) => {
    const res = await api.get<{ success: boolean; product: Product; related: Product[] }>(`/products/${id}`);
    return res.data;
  },
  createReview: async (productId: string, review: { rating: number; comment: string; userName?: string }) => {
    const res = await api.post(`/products/${productId}/reviews`, review);
    return res.data;
  },
  getReviews: async (productId: string) => {
    const res = await api.get<{ success: boolean; reviews: Review[] }>(`/products/${productId}/reviews`);
    return res.data;
  },
  createProduct: async (productData: Partial<Product>) => {
    const res = await api.post('/products', productData);
    return res.data;
  },
  updateProduct: async (id: string, productData: Partial<Product>) => {
    const res = await api.put(`/products/${id}`, productData);
    return res.data;
  },
  deleteProduct: async (id: string) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};

export const categoryAPI = {
  getCategories: async (params?: any) => {
    const res = await api.get<{ success: boolean; categories: Category[] }>('/categories', { params });
    return res.data;
  },
  createCategory: async (categoryData: Partial<Category>) => {
    const res = await api.post('/categories', categoryData);
    return res.data;
  },
  updateCategory: async (id: string, categoryData: Partial<Category>) => {
    const res = await api.put(`/categories/${id}`, categoryData);
    return res.data;
  },
  deleteCategory: async (id: string) => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },
};

export const orderAPI = {
  createOrder: async (data: {
    items: { productId: string; quantity: number }[];
    customerDetails: { name: string; email: string; phone: string; telegram?: string; note?: string };
    currency?: 'USD' | 'KHR';
    paymentMethod?: string;
  }) => {
    const res = await api.post<{ success: boolean; order: Order; message?: string }>('/orders', data);
    return res.data;
  },
  getMyOrders: async () => {
    const res = await api.get<{ success: boolean; orders: Order[] }>('/orders/my-orders');
    return res.data;
  },
  getOrderById: async (id: string) => {
    const res = await api.get<{ success: boolean; order: Order }>(`/orders/${id}`);
    return res.data;
  },
  downloadProduct: async (orderId: string, productId: string, token?: string) => {
    const res = await api.get<{ success: boolean; productName: string; downloadUrl: string; accessInfo: string }>(
      `/orders/${orderId}/download/${productId}`,
      { params: { token } }
    );
    return res.data;
  },
};

export const paymentAPI = {
  createKHQR: async (orderId: string) => {
    const res = await api.post<{ success: boolean; payment: Payment; message?: string }>('/payments/khqr/create', { orderId });
    return res.data;
  },
  checkStatus: async (paymentId: string) => {
    const res = await api.post<{ success: boolean; paid: boolean; status: string; message: string; payment: any }>(
      '/payments/khqr/check',
      { paymentId }
    );
    return res.data;
  },
  simulatePayment: async (paymentId: string) => {
    const res = await api.post<{ success: boolean; message: string; payment: Payment }>('/payments/khqr/simulate', {
      paymentId,
    });
    return res.data;
  },
};

export const adminAPI = {
  getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },
  getUsers: async (params?: any) => {
    const res = await api.get<{ success: boolean; users: User[]; pagination: any }>('/admin/users', { params });
    return res.data;
  },
  updateUserStatus: async (id: string, status: 'active' | 'suspended') => {
    const res = await api.put(`/admin/users/${id}/status`, { status });
    return res.data;
  },
  getOrders: async (params?: any) => {
    const res = await api.get<{ success: boolean; orders: Order[]; pagination: any }>('/admin/orders', { params });
    return res.data;
  },
  updateOrderStatus: async (id: string, data: { orderStatus?: string; paymentStatus?: string }) => {
    const res = await api.put(`/admin/orders/${id}/status`, data);
    return res.data;
  },
  refundOrder: async (id: string) => {
    const res = await api.post(`/admin/orders/${id}/refund`);
    return res.data;
  },
  getPayments: async (params?: any) => {
    const res = await api.get<{ success: boolean; payments: Payment[]; pagination: any }>('/admin/payments', { params });
    return res.data;
  },
  getSettings: async () => {
    const res = await api.get<{ success: boolean; settings: StoreSettings }>('/admin/settings');
    return res.data;
  },
  updateSettings: async (settings: Partial<StoreSettings>) => {
    const res = await api.put('/admin/settings', settings);
    return res.data;
  },
  uploadImage: async (formData: FormData) => {
    const res = await api.post<{ success: boolean; url: string }>('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export const publicAPI = {
  getSettings: async () => {
    const res = await api.get<{ success: boolean; settings: StoreSettings }>('/settings');
    return res.data;
  },
};

export default api;
