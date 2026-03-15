export interface Advertisement {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  type: 'BANNER' | 'INTERSTITIAL' | 'NATIVE';
  position: 'HOME' | 'SUBJECT_DETAIL' | 'ANALYTICS' | 'SETTINGS';
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  targetAudience?: Record<string, any>;
  clicks: number;
  impressions: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdvertisementInput {
  title: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  type: 'BANNER' | 'INTERSTITIAL' | 'NATIVE';
  position: 'HOME' | 'SUBJECT_DETAIL' | 'ANALYTICS' | 'SETTINGS';
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  targetAudience?: Record<string, any>;
}

export interface UpdateAdvertisementInput {
  title?: string;
  content?: string;
  imageUrl?: string;
  linkUrl?: string;
  type?: 'BANNER' | 'INTERSTITIAL' | 'NATIVE';
  position?: 'HOME' | 'SUBJECT_DETAIL' | 'ANALYTICS' | 'SETTINGS';
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  targetAudience?: Record<string, any>;
}

