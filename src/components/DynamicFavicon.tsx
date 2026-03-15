import { useEffect } from 'react';
import { logoService } from '../services/logoService';

interface DynamicFaviconProps {
  logoUrl?: string;
}

export default function DynamicFavicon({ logoUrl }: DynamicFaviconProps) {
  useEffect(() => {
    const updateFavicon = async () => {
      try {
        const config = logoUrl 
          ? { logoUrl }
          : await logoService.getLogoConfig();
        
        // Update favicon
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) {
          favicon.href = config.logoUrl;
        }
        
        // Create or update apple-touch-icon
        let appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
        if (!appleTouchIcon) {
          appleTouchIcon = document.createElement('link');
          appleTouchIcon.rel = 'apple-touch-icon';
          document.head.appendChild(appleTouchIcon);
        }
        appleTouchIcon.href = config.logoUrl;
      } catch (error) {
        console.error('Failed to update favicon:', error);
      }
    };

    updateFavicon();
  }, [logoUrl]);

  return null; // This component doesn't render anything
}
