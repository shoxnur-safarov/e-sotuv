export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  brand: string;
  category?: string;
  description?: string;
  stock: number;
  badge?: string | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: number;
  totalAmount: number;
  status: "PENDING" | "SHIPPED" | "DELIVERED";
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: string;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface User {
  id: number;
  email: string;
  role: "ADMIN" | "MANAGER" | "USER";
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}