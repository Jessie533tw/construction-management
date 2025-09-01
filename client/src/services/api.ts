import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, LoginForm, RegisterForm, User } from '@/types';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 請求攔截器 - 添加認證 token
    this.api.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 回應攔截器 - 處理認證錯誤
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token 過期或無效，清除認證狀態
          useAuthStore.getState().logout();
          toast.error('登入已過期，請重新登入');
        } else if (error.response?.status >= 500) {
          toast.error('伺服器錯誤，請稍後再試');
        }
        return Promise.reject(error);
      }
    );
  }

  // 認證相關 API
  async login(data: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.api.post('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterForm): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    const response = await this.api.put('/auth/profile', data);
    return response.data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> {
    const response = await this.api.put('/auth/change-password', data);
    return response.data;
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await this.api.post('/auth/refresh');
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.api.post('/auth/logout');
    return response.data;
  }

  // 專案相關 API
  async getProjects(): Promise<ApiResponse<{ projects: any[] }>> {
    const response = await this.api.get('/projects');
    return response.data;
  }

  // 廠商相關 API
  async getSuppliers(): Promise<ApiResponse<{ suppliers: any[] }>> {
    const response = await this.api.get('/suppliers');
    return response.data;
  }

  // 材料相關 API
  async getMaterials(): Promise<ApiResponse<{ materials: any[] }>> {
    const response = await this.api.get('/materials');
    return response.data;
  }

  // 詢價相關 API
  async getInquiries(): Promise<ApiResponse<{ inquiries: any[] }>> {
    const response = await this.api.get('/inquiries');
    return response.data;
  }

  // 採購相關 API
  async getPurchases(): Promise<ApiResponse<{ purchases: any[] }>> {
    const response = await this.api.get('/purchases');
    return response.data;
  }

  // 進度相關 API
  async getProgress(): Promise<ApiResponse<{ progress: any[] }>> {
    const response = await this.api.get('/progress');
    return response.data;
  }

  // 報表相關 API
  async getReports(): Promise<ApiResponse<{ reports: any[] }>> {
    const response = await this.api.get('/reports');
    return response.data;
  }

  // 通知相關 API
  async getNotifications(): Promise<ApiResponse<{ notifications: any[] }>> {
    const response = await this.api.get('/notifications');
    return response.data;
  }
}

export const apiService = new ApiService();