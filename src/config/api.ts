// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  
  // Advertisements
  ADVERTISEMENTS: '/advertisements',
  ADVERTISEMENT_BY_ID: (id: string) => `/advertisements/${id}`,
  ADVERTISEMENT_CLICK: (id: string) => `/advertisements/${id}/click`,
  ACTIVE_ADVERTISEMENT: (position: string) => `/advertisements/active/${position}`,
  
  // Admin
  ADMIN_DASHBOARD_STATS: '/admin/dashboard/stats',
  ADMIN_USERS: '/admin/users',
  ADMIN_SUBJECTS: '/admin/subjects',
  ADMIN_ATTENDANCE_RECORDS: '/admin/attendance-records',
  ADMIN_ACTIVITY: '/admin/activity',
  ADMIN_SYSTEM_HEALTH: '/admin/system/health',
  ADMIN_ANALYTICS: '/admin/analytics',
};

