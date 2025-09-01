import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import LoginPage from '@/pages/LoginPage';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardPage from '@/pages/DashboardPage';
import ProjectsPage from '@/pages/ProjectsPage';
import SuppliersPage from '@/pages/SuppliersPage';
import MaterialsPage from '@/pages/MaterialsPage';
import InquiriesPage from '@/pages/InquiriesPage';
import PurchasesPage from '@/pages/PurchasesPage';
import ProgressPage from '@/pages/ProgressPage';
import ReportsPage from '@/pages/ReportsPage';
import ProfilePage from '@/pages/ProfilePage';

// 受保護的路由組件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, token } = useAuthStore();
  
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { isAuthenticated, token, refreshProfile } = useAuthStore();

  // 應用初始化時刷新用戶資料
  useEffect(() => {
    if (isAuthenticated && token) {
      refreshProfile();
    }
  }, [isAuthenticated, token, refreshProfile]);

  return (
    <Routes>
      {/* 公開路由 */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } 
      />
      
      {/* 受保護的路由 */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="materials" element={<MaterialsPage />} />
        <Route path="inquiries" element={<InquiriesPage />} />
        <Route path="purchases" element={<PurchasesPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* 預設重定向 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;