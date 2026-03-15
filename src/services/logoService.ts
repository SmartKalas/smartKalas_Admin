import { API_BASE_URL } from '../config/api';

export interface LogoConfig {
  logoUrl: string;
  updatedAt: string;
  variants?: {
    appIcon?: string;
    login?: string;
    sidebar?: string;
    favicon?: string;
  };
}

export interface LogoUploadResult {
  url: string;
  fileName: string;
  size: number;
  contentType: string;
}

class LogoService {
  private baseUrl = API_BASE_URL;

  /**
   * Get current logo configuration
   */
  async getLogoConfig(): Promise<LogoConfig> {
    const response = await fetch(`${this.baseUrl}/api/logo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch logo configuration');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Upload new logo
   */
  async uploadLogo(file: File): Promise<LogoUploadResult> {
    const token = this.getAuthToken();
    return this.uploadLogoWithToken(file, token);
  }

  /**
   * Upload new logo with provided token
   */
  async uploadLogoWithToken(file: File, token: string): Promise<LogoUploadResult> {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await fetch(`${this.baseUrl}/api/logo/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload logo');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Update logo URL directly
   */
  async updateLogoUrl(logoUrl: string): Promise<LogoConfig> {
    const token = this.getAuthToken();
    return this.updateLogoUrlWithToken(logoUrl, token);
  }

  /**
   * Update logo URL directly with provided token
   */
  async updateLogoUrlWithToken(logoUrl: string, token: string): Promise<LogoConfig> {
    const response = await fetch(`${this.baseUrl}/api/logo/url`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ logoUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update logo URL');
    }

    const data = await response.json();
    return data.data;
  }

  /**
   * Delete logo from storage
   */
  async deleteLogo(fileName: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/logo/${fileName}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete logo');
    }
  }

  /**
   * Get authentication token from auth store
   */
  private getAuthToken(): string {
    // Try to get token from localStorage first (for server-side compatibility)
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('auth-token');
      if (token) return token;
    }
    
    // For client-side, we need to access the store differently
    // This is a workaround for the service class - in practice, 
    // the token should be passed from the component using the auth store
    throw new Error('Authentication token must be provided from component context');
  }

  /**
   * Validate file type
   */
  validateFileType(file: File): boolean {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    return allowedTypes.includes(file.type);
  }

  /**
   * Validate file size (5MB max)
   */
  validateFileSize(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const logoService = new LogoService();
