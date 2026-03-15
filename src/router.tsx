import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import AdvertisementsPage from './pages/AdvertisementsPage';
import AdvertisementFormPage from './pages/AdvertisementFormPage';
import UsersPage from './pages/UsersPage';
import SubjectsPage from './pages/SubjectsPage';
import AttendanceRecordsPage from './pages/AttendanceRecordsPage';
import SettingsPage from './pages/SettingsPage';
import BroadcastPage from './pages/BroadcastPage';
import { useAuthStore } from './store/authStore';

// Protected Route Component
function ProtectedRoute() {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: 'advertisements',
            element: <AdvertisementsPage />,
          },
          {
            path: 'advertisements/new',
            element: <AdvertisementFormPage />,
          },
          {
            path: 'advertisements/:id/edit',
            element: <AdvertisementFormPage />,
          },
          {
            path: 'users',
            element: <UsersPage />,
          },
          {
            path: 'subjects',
            element: <SubjectsPage />,
          },
          {
            path: 'attendance-records',
            element: <AttendanceRecordsPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
          {
            path: 'broadcast',
            element: <BroadcastPage />,
          },
        ],
      },
    ],
  },
]);

