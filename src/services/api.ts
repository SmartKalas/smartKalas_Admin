import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
  };
  message?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    // Load token from localStorage on initialization
    this.loadAuthToken();

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.authToken || localStorage.getItem('auth-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('auth-token');
          this.authToken = null;
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private async request<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<T>({
        method,
        url: endpoint,
        data,
      });

      return response.data as ApiResponse<T>;
    } catch (error: any) {
      // Handle network errors (no response from server)
      if (!error.response) {
        const networkError: ApiResponse<T> = {
          success: false,
          error: {
            message: error.message?.includes('Network Error') || error.code === 'ERR_NETWORK'
              ? 'Unable to connect to the server. Please check if the backend is running.'
              : error.message || 'Network error occurred',
            statusCode: 0,
          },
        };
        throw new Error(networkError.error?.message || 'Network error');
      }
      
      // Handle HTTP errors (server responded with error)
      if (error.response?.data) {
        const apiError = error.response.data as ApiResponse<T>;
        if (apiError.error?.message) {
          throw new Error(apiError.error.message);
        }
        return apiError;
      }
      
      throw error;
    }
  }

  private loadAuthToken() {
    this.authToken = localStorage.getItem('auth-token');
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    const response = await this.request('post', API_ENDPOINTS.LOGIN, {
      email,
      password,
    });

    if (response.success && response.data) {
      // Store token - Supabase session structure
      const session = response.data.session;
      let token: string | null = null;
      
      if (session?.access_token) {
        token = session.access_token;
      } else if (session?.accessToken) {
        token = session.accessToken;
      } else if (response.data.token) {
        token = response.data.token;
      } else if (response.data.access_token) {
        token = response.data.access_token;
      }
      
      if (token) {
        localStorage.setItem('auth-token', token);
        this.authToken = token; // Also store in instance
      } else {
        console.warn('No token found in login response:', response.data);
      }
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('post', API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Ignore errors on logout
      console.warn('Logout request failed:', error);
    } finally {
      localStorage.removeItem('auth-token');
      this.authToken = null;
    }
  }

  // Advertisement methods
  async getAdvertisements(): Promise<ApiResponse<any[]>> {
    return this.request('get', API_ENDPOINTS.ADVERTISEMENTS);
  }

  async getAdvertisement(id: string): Promise<ApiResponse<any>> {
    return this.request('get', API_ENDPOINTS.ADVERTISEMENT_BY_ID(id));
  }

  async createAdvertisement(data: any): Promise<ApiResponse<any>> {
    return this.request('post', API_ENDPOINTS.ADVERTISEMENTS, data);
  }

  async updateAdvertisement(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request('put', API_ENDPOINTS.ADVERTISEMENT_BY_ID(id), data);
  }

  async deleteAdvertisement(id: string): Promise<ApiResponse<void>> {
    return this.request('delete', API_ENDPOINTS.ADVERTISEMENT_BY_ID(id));
  }

  // Admin methods
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request('get', API_ENDPOINTS.ADMIN_DASHBOARD_STATS);
  }

  async getUsers(page = 1, limit = 50): Promise<ApiResponse<any>> {
    return this.request('get', `${API_ENDPOINTS.ADMIN_USERS}?page=${page}&limit=${limit}`);
  }

  async getSubjects(page = 1, limit = 50): Promise<ApiResponse<any>> {
    return this.request('get', `${API_ENDPOINTS.ADMIN_SUBJECTS}?page=${page}&limit=${limit}`);
  }

  async getAttendanceRecords(page = 1, limit = 50): Promise<ApiResponse<any>> {
    return this.request('get', `${API_ENDPOINTS.ADMIN_ATTENDANCE_RECORDS}?page=${page}&limit=${limit}`);
  }

  async getActivity(userId?: string, limit = 100): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    params.append('limit', limit.toString());
    return this.request('get', `${API_ENDPOINTS.ADMIN_ACTIVITY}?${params.toString()}`);
  }

  async getSystemHealth(): Promise<ApiResponse<any>> {
    return this.request('get', API_ENDPOINTS.ADMIN_SYSTEM_HEALTH);
  }

  async getAnalytics(): Promise<ApiResponse<any>> {
    return this.request('get', API_ENDPOINTS.ADMIN_ANALYTICS);
  }

  // Notification methods
  async sendBroadcast(data: {
    title: string;
    message: string;
    targetAudience: 'all' | 'active' | 'inactive';
    data?: any;
  }): Promise<ApiResponse<any>> {
    return this.request('post', '/notifications/broadcast', data);
  }

  async sendClassReminders(): Promise<ApiResponse<any>> {
    return this.request('post', '/notifications/class-reminders');
  }

  async sendAttendanceAlerts(): Promise<ApiResponse<any>> {
    return this.request('post', '/notifications/attendance-alerts');
  }

  async getUserNotifications(page = 1, limit = 20): Promise<ApiResponse<any>> {
    return this.request('get', `/notifications?page=${page}&limit=${limit}`);
  }
}

export const apiClient = new ApiClient();

