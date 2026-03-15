import React, { useState, useEffect } from 'react';
import { Upload, X, Check, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { logoService, type LogoConfig } from '../services/logoService';
import { useAuthStore } from '../store/authStore';

interface LogoManagerProps {
  onLogoUpdate?: (logoUrl: string) => void;
}

export default function LogoManager({ onLogoUpdate }: LogoManagerProps) {
  const [logoConfig, setLogoConfig] = useState<LogoConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const { } = useAuthStore();

  useEffect(() => {
    loadLogoConfig();
  }, []);

  const loadLogoConfig = async () => {
    try {
      setLoading(true);
      const config = await logoService.getLogoConfig();
      setLogoConfig(config);
      setUrlInput(config.logoUrl);
    } catch (err) {
      setError('Failed to load logo configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!logoService.validateFileType(file)) {
      setError('Invalid file type. Only PNG, JPG, JPEG, and SVG files are allowed.');
      return;
    }

    // Validate file size
    if (!logoService.validateFileSize(file)) {
      setError('File size exceeds 5MB limit.');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setSuccess(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      // Get token from localStorage directly
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const result = await logoService.uploadLogoWithToken(selectedFile, token);
      
      setSuccess('Logo uploaded successfully!');
      setLogoConfig(prev => prev ? { ...prev, logoUrl: result.url } : null);
      setUrlInput(result.url);
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Notify parent component
      if (onLogoUpdate) {
        onLogoUpdate(result.url);
      }

      // Reset file input
      const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setError(err.message || 'Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlUpdate = async () => {
    if (!urlInput.trim()) {
      setError('Logo URL is required');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      // Get token from localStorage directly
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const result = await logoService.updateLogoUrlWithToken(urlInput.trim(), token);
      
      setSuccess('Logo URL updated successfully!');
      setLogoConfig(result);
      
      // Notify parent component
      if (onLogoUpdate) {
        onLogoUpdate(result.logoUrl);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update logo URL');
    } finally {
      setUploading(false);
    }
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading logo configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Logo Display */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Logo</h3>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {logoConfig?.logoUrl ? (
              <img 
                src={logoConfig.logoUrl} 
                alt="Current Logo" 
                className="w-full h-full object-contain"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600">
              {logoConfig?.logoUrl ? 'Logo is currently set' : 'No logo configured'}
            </p>
            {logoConfig?.updatedAt && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {new Date(logoConfig.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Upload New Logo */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Logo</h3>
        
        {previewUrl ? (
          <div className="mb-4">
            <div className="relative inline-block">
              <img 
                src={previewUrl} 
                alt="Logo Preview" 
                className="w-32 h-32 object-contain border border-gray-200 rounded-lg"
              />
              <button
                onClick={clearFileSelection}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {selectedFile && (
              <div className="mt-2 text-sm text-gray-600">
                <p>{selectedFile.name}</p>
                <p>{logoService.formatFileSize(selectedFile.size)}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <label className="block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, JPEG, SVG (MAX. 5MB)
                </p>
              </div>
              <input
                id="logo-upload"
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        )}

        {selectedFile && (
          <div className="flex space-x-2">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                'Upload Logo'
              )}
            </button>
            <button
              onClick={clearFileSelection}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Update Logo URL */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Logo URL</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleUrlUpdate}
            disabled={uploading || !urlInput.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              'Update URL'
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <Check className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700">{success}</span>
        </div>
      )}
    </div>
  );
}
