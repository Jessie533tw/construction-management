import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { LoginForm, RegisterForm } from '@/types';

// 表單驗證 schema
const loginSchema = z.object({
  identifier: z.string().min(1, '請輸入用戶名或電子郵件'),
  password: z.string().min(1, '請輸入密碼'),
});

const registerSchema = z.object({
  email: z.string().email('無效的電子郵件格式'),
  username: z.string().min(3, '用戶名至少需要 3 個字符'),
  password: z.string().min(6, '密碼至少需要 6 個字符'),
  confirmPassword: z.string(),
  name: z.string().min(1, '請輸入姓名'),
  department: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '密碼不一致',
  path: ['confirmPassword'],
});

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoading } = useAuthStore();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginForm & RegisterForm & { confirmPassword: string }>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const onSubmit = async (data: LoginForm & RegisterForm) => {
    if (isLogin) {
      const success = await login({
        identifier: data.identifier,
        password: data.password,
      });
      if (success) {
        reset();
      }
    } else {
      const { confirmPassword, ...registerData } = data as any;
      const success = await register(registerData);
      if (success) {
        reset();
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo 和標題 */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            建設發包管理系統
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? '登入您的帳戶' : '建立新帳戶'}
          </p>
        </div>

        {/* 表單 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="card p-8">
            <div className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      電子郵件 *
                    </label>
                    <input
                      {...registerField('email')}
                      type="email"
                      className="input mt-1"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      用戶名 *
                    </label>
                    <input
                      {...registerField('username')}
                      type="text"
                      className="input mt-1"
                      placeholder="用戶名"
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      姓名 *
                    </label>
                    <input
                      {...registerField('name')}
                      type="text"
                      className="input mt-1"
                      placeholder="您的姓名"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      部門
                    </label>
                    <input
                      {...registerField('department')}
                      type="text"
                      className="input mt-1"
                      placeholder="部門（可選）"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      電話
                    </label>
                    <input
                      {...registerField('phone')}
                      type="tel"
                      className="input mt-1"
                      placeholder="電話號碼（可選）"
                    />
                  </div>
                </>
              )}

              {isLogin && (
                <div>
                  <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                    用戶名或電子郵件
                  </label>
                  <input
                    {...registerField('identifier')}
                    type="text"
                    className="input mt-1"
                    placeholder="用戶名或電子郵件"
                  />
                  {errors.identifier && (
                    <p className="mt-1 text-sm text-red-600">{errors.identifier.message}</p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  密碼
                </label>
                <input
                  {...registerField('password')}
                  type="password"
                  className="input mt-1"
                  placeholder="密碼"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    確認密碼
                  </label>
                  <input
                    {...registerField('confirmPassword')}
                    type="password"
                    className="input mt-1"
                    placeholder="再次輸入密碼"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    處理中...
                  </div>
                ) : (
                  isLogin ? '登入' : '註冊'
                )}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
              >
                {isLogin ? '還沒有帳戶？立即註冊' : '已有帳戶？立即登入'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}