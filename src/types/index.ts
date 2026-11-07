export type ProductType = 'course' | 'software' | 'account' | 'prompt' | 'ebook' | 'service';

export interface Category {
  _id: string;
  name: string;
  nameKh?: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  status: 'active' | 'inactive';
  productCount?: number;
}

export interface Specification {
  key: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  nameKh?: string;
  slug: string;
  description: string;
  descriptionKh?: string;
  price: number;
  discountPrice?: number;
  category: Category | string;
  images: string[];
  type: ProductType;
  digitalDownloadUrl?: string;
  digitalAccessInfo?: string;
  stock: number;
  featured: boolean;
  status: 'published' | 'draft';
  rating: number;
  numReviews: number;
  specifications: Specification[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  status: 'active' | 'suspended';
  orderCount?: number;
  totalSpent?: number;
  createdAt?: string;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  nameKh?: string;
  price: number;
  quantity: number;
  image?: string;
  digitalDownloadUrl?: string;
  digitalAccessInfo?: string;
  type?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user?: string | User;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    telegram?: string;
    note?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  currency: 'USD' | 'KHR';
  paymentMethod: 'KHQR' | 'SIMULATION';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'completed' | 'cancelled';
  transactionRef?: string;
  downloadToken?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  order: string | Order;
  provider: 'BAKONG_KHQR' | 'SIMULATION';
  transactionId: string;
  md5?: string;
  amount: number;
  currency: 'USD' | 'KHR';
  qrCode: string;
  qrString: string;
  paymentStatus: 'pending' | 'successful' | 'failed' | 'expired';
  providerResponse?: any;
  expiresAt: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  user?: string;
  userName: string;
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface StoreSettings {
  _id?: string;
  storeName: string;
  storeNameKh: string;
  storeLogo: string;
  contactEmail: string;
  contactPhone: string;
  telegramSupportUrl: string;
  storeAnnouncement: string;
  storeAnnouncementKh: string;
  currency: 'USD' | 'KHR';
  exchangeRateUSDToKHR: number;
  bakongAccountId: string;
  bakongMerchantName: string;
  bakongMerchantCity: string;
  isSandboxMode: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

