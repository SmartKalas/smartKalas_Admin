import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../services/api';
import type { CreateAdvertisementInput, UpdateAdvertisementInput } from '../types';
import { Loader2, Save, X } from 'lucide-react';

export default function AdvertisementFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<CreateAdvertisementInput>({
    title: '',
    content: '',
    imageUrl: '',
    linkUrl: '',
    type: 'NATIVE',
    position: 'HOME',
    isActive: true,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (isEditMode && id) {
      loadAdvertisement(id);
    }
  }, [id, isEditMode]);

  const loadAdvertisement = async (adId: string) => {
    try {
      setFetching(true);
      const response = await apiClient.getAdvertisement(adId);
      if (response.success && response.data) {
        const ad = response.data;
        setFormData({
          title: ad.title || '',
          content: ad.content || '',
          imageUrl: ad.imageUrl || '',
          linkUrl: ad.linkUrl || '',
          type: ad.type || 'NATIVE',
          position: ad.position || 'HOME',
          isActive: ad.isActive ?? true,
          startDate: ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : '',
          endDate: ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : '',
        });
      }
    } catch (error) {
      console.error('Error loading advertisement:', error);
      setError('Failed to load advertisement');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        imageUrl: formData.imageUrl || undefined,
        linkUrl: formData.linkUrl || undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
      };

      if (isEditMode && id) {
        const response = await apiClient.updateAdvertisement(id, submitData);
        if (response.success) {
          navigate('/advertisements');
        } else {
          setError(response.error?.message || 'Failed to update advertisement');
        }
      } else {
        const response = await apiClient.createAdvertisement(submitData);
        if (response.success) {
          navigate('/advertisements');
        } else {
          setError(response.error?.message || 'Failed to create advertisement');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Advertisement' : 'Create Advertisement'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Update advertisement details' : 'Create a new sponsored advertisement'}
            </p>
          </div>
          <button
            onClick={() => navigate('/advertisements')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <X className="h-5 w-5" />
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Sponsored Ad"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Learn how to improve your study habits and time management skills."
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="BANNER">Banner</option>
              <option value="INTERSTITIAL">Interstitial</option>
              <option value="NATIVE">Native</option>
            </select>
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
              Position <span className="text-red-500">*</span>
            </label>
            <select
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="HOME">Home</option>
              <option value="SUBJECT_DETAIL">Subject Detail</option>
              <option value="ANALYTICS">Analytics</option>
              <option value="SETTINGS">Settings</option>
            </select>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="linkUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Link URL
            </label>
            <input
              id="linkUrl"
              type="url"
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="https://example.com/learn-more"
            />
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">When active, this advertisement will be displayed in the app</p>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/advertisements')}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {isEditMode ? 'Update Advertisement' : 'Create Advertisement'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

