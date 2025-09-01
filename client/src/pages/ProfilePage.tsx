import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';

const profileSchema = z.object({
  name: z.string().min(1, '姓名不能為空'),
  department: z.string().optional(),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, '請輸入當前密碼'),
  newPassword: z.string().min(6, '新密碼至少需要 6 個字符'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '新密碼不一致',
  path: ['confirmPassword'],
});

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, updateProfile, changePassword, isLoading } = useAuthStore();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      department: user?.department || '',
      phone: user?.phone || '',
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onUpdateProfile = async (data: any) => {
    const success = await updateProfile(data);
    if (success) {
      profileForm.reset(data);
    }
  };

  const onChangePassword = async (data: any) => {
    const success = await changePassword(data.currentPassword, data.newPassword);
    if (success) {
      passwordForm.reset();
    }
  };

  const tabs = [
    { id: 'profile', name: '個人資料' },
    { id: 'security', name: '安全設定' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">個人設定</h1>

      {/* 分頁 */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">電子郵件</label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="input mt-1 bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">電子郵件無法修改</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">用戶名</label>
                  <input
                    type="text"
                    value={user?.username}
                    disabled
                    className="input mt-1 bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">用戶名無法修改</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">姓名 *</label>
                  <input
                    {...profileForm.register('name')}
                    className="input mt-1"
                  />
                  {profileForm.formState.errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">部門</label>
                  <input
                    {...profileForm.register('department')}
                    className="input mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">角色</label>
                  <input
                    type="text"
                    value={user?.role}
                    disabled
                    className="input mt-1 bg-gray-50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">電話</label>
                  <input
                    {...profileForm.register('phone')}
                    className="input mt-1"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '更新中...' : '保存更改'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
              <div className="max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700">當前密碼</label>
                  <input
                    {...passwordForm.register('currentPassword')}
                    type="password"
                    className="input mt-1"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">新密碼</label>
                  <input
                    {...passwordForm.register('newPassword')}
                    type="password"
                    className="input mt-1"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">確認新密碼</label>
                  <input
                    {...passwordForm.register('confirmPassword')}
                    type="password"
                    className="input mt-1"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '修改中...' : '修改密碼'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}