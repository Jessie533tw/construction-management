// 使用者相關類型
export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'STAFF' | 'ACCOUNTANT';
  department?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API 回應類型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}

// 專案相關類型
export interface Project {
  id: string;
  name: string;
  code: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  estimatedCost: number;
  actualCost: number;
  status: ProjectStatus;
  contractNumber?: string;
  clientName?: string;
  clientContact?: string;
  folderPath?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    username: string;
  };
  manager?: {
    id: string;
    name: string;
    username: string;
  };
  _count?: {
    budgets: number;
    inquiries: number;
    purchaseOrders: number;
  };
}

export type ProjectStatus = 
  | 'PLANNING'
  | 'BUDGETING' 
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED';

// 廠商類型
export interface Supplier {
  id: string;
  name: string;
  code: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  taxNumber?: string;
  bankAccount?: string;
  paymentTerms?: string;
  rating?: number;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 材料類型
export interface Material {
  id: string;
  name: string;
  code: string;
  category: string;
  unit: string;
  specification?: string;
  brand?: string;
  model?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 表單類型
export interface LoginForm {
  identifier: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
  name: string;
  department?: string;
  phone?: string;
}