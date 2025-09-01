import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, User, LoginForm, RegisterForm } from '@/types';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

interface AuthActions {
  login: (data: LoginForm) => Promise<boolean>;
  register: (data: RegisterForm) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      login: async (data: LoginForm): Promise<boolean> => {
        try {
          set({ isLoading: true });
          
          const response = await apiService.login(data);
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            
            toast.success(`歡迎回來，${user.name}！`);
            return true;
          }
          
          toast.error(response.error?.message || '登入失敗');
          set({ isLoading: false });
          return false;
          
        } catch (error: any) {
          const message = error.response?.data?.error?.message || '登入失敗，請檢查網路連接';
          toast.error(message);
          set({ isLoading: false });
          return false;
        }
      },

      register: async (data: RegisterForm): Promise<boolean> => {
        try {
          set({ isLoading: true });
          
          const response = await apiService.register(data);
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            
            toast.success(`歡迎加入，${user.name}！`);
            return true;
          }
          
          toast.error(response.error?.message || '註冊失敗');
          set({ isLoading: false });
          return false;
          
        } catch (error: any) {
          const message = error.response?.data?.error?.message || '註冊失敗，請檢查網路連接';
          toast.error(message);
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        // 呼叫 API 登出 (不等待回應)
        apiService.logout().catch(() => {
          // 忽略登出 API 錯誤
        });
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        toast.success('已成功登出');
      },

      refreshProfile: async (): Promise<void> => {
        try {
          const { token } = get();
          if (!token) return;
          
          const response = await apiService.getProfile();
          
          if (response.success && response.data) {
            set({ user: response.data.user });
          }
        } catch (error) {
          // 靜默失敗 - 不顯示錯誤訊息
          console.error('Failed to refresh profile:', error);
        }
      },

      updateProfile: async (data: Partial<User>): Promise<boolean> => {
        try {
          set({ isLoading: true });
          
          const response = await apiService.updateProfile(data);
          
          if (response.success && response.data) {
            set({ 
              user: response.data.user,
              isLoading: false 
            });
            
            toast.success('個人資料更新成功');
            return true;
          }
          
          toast.error(response.error?.message || '更新失敗');
          set({ isLoading: false });
          return false;
          
        } catch (error: any) {
          const message = error.response?.data?.error?.message || '更新失敗';
          toast.error(message);
          set({ isLoading: false });
          return false;
        }
      },

      changePassword: async (currentPassword: string, newPassword: string): Promise<boolean> => {
        try {
          set({ isLoading: true });
          
          const response = await apiService.changePassword({
            currentPassword,
            newPassword,
          });
          
          if (response.success) {
            set({ isLoading: false });
            toast.success('密碼修改成功');
            return true;
          }
          
          toast.error(response.error?.message || '密碼修改失敗');
          set({ isLoading: false });
          return false;
          
        } catch (error: any) {
          const message = error.response?.data?.error?.message || '密碼修改失敗';
          toast.error(message);
          set({ isLoading: false });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);