// User Types
export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: number;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

// Order Types
export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  name: string;
}

export interface OrderRequest {
  items: OrderItem[];
  shipping_address: string;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

// Cart Item (local state)
export interface CartItem {
  product: Product;
  quantity: number;
}
