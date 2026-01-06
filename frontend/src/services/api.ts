import axios from 'axios';
import type {
  Client,
  Invoice,
  CreateInvoiceDTO,
  CreateClientDTO,
  AuthResponse,
  LoginDTO,
  RegisterDTO,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (data: RegisterDTO): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginDTO): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
};

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    const response = await api.get<Client[]>('/clients');
    return response.data;
  },

  getById: async (id: string): Promise<Client> => {
    const response = await api.get<Client>(`/clients/${id}`);
    return response.data;
  },

  create: async (data: CreateClientDTO): Promise<Client> => {
    const response = await api.post<Client>('/clients', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateClientDTO>): Promise<Client> => {
    const response = await api.put<Client>(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};

export const invoiceService = {
  getAll: async (filters?: {
    status?: string;
    clientId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Invoice[]> => {
    const response = await api.get<Invoice[]>('/invoices', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  create: async (data: CreateInvoiceDTO): Promise<Invoice> => {
    const response = await api.post<Invoice>('/invoices', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateInvoiceDTO & { status?: Invoice['status'] }>): Promise<Invoice> => {
    const response = await api.put<Invoice>(`/invoices/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/invoices/${id}`);
  },
};

export default api;

