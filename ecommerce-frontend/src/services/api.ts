import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  Product,
  OrderRequest,
  Order,
} from '../types';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // FastAPI OAuth2 expects form data
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/api/auth/login`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await axios.post<User>(
      `${API_BASE_URL}/api/auth/register`,
      data
    );
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (skip: number = 0, limit: number = 100): Promise<Product[]> => {
    const response = await api.get<Product[]>('/api/products/', {
      params: { skip, limit },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/api/products/${id}`);
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  create: async (data: OrderRequest): Promise<Order> => {
    const response = await api.post<Order>('/api/orders/', data);
    return response.data;
  },

  getAll: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/api/orders/');
    return response.data;
  },

  getById: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/api/orders/${id}`);
    return response.data;
  },
};

export default api;
