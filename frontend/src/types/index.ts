export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceLineItem {
  id?: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  created_at?: string;
}

export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';

export interface Invoice {
  id: string;
  client_id: string;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  payment_terms: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  discount_amount: number;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  line_items: InvoiceLineItem[];
  client?: Client;
}

export interface CreateInvoiceDTO {
  client_id: string;
  issue_date: string;
  due_date: string;
  payment_terms: string;
  tax_rate: number;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  notes?: string;
  line_items: CreateLineItemDTO[];
}

export interface CreateLineItemDTO {
  description: string;
  quantity: number;
  rate: number;
}

export interface CreateClientDTO {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

