import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../services/api';

interface User {
  id: string;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.login(email, password);
          
          if (response.success && response.data?.user) {
            const user = response.data.user;
            
            // Check if user is admin
            if (user.role !== 'ADMIN') {
              // Clear token if not admin
              localStorage.removeItem('auth-token');
              throw new Error('Access denied. Admin privileges required.');
            }

            // Verify token was stored
            const token = localStorage.getItem('auth-token');
            if (!token) {
              throw new Error('Failed to store authentication token');
            }

            set({
              user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error(response.error?.message || 'Login failed');
          }
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await apiClient.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      checkAuth: () => {
        const token = localStorage.getItem('auth-token');
        set({
          isAuthenticated: !!token,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

