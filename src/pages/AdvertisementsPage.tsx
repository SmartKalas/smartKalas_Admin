import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/api';
import type { Advertisement } from '../types';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Megaphone } from 'lucide-react';

export default function AdvertisementsPage() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadAdvertisements();
  }, []);

  const loadAdvertisements = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAdvertisements();
      if (response.success && response.data) {
        setAdvertisements(response.data);
      }
    } catch (error) {
      console.error('Error loading advertisements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await apiClient.updateAdvertisement(id, {
        isActive: !currentStatus,
      });
      if (response.success) {
        loadAdvertisements();
      }
    } catch (error) {
      console.error('Error toggling advertisement:', error);
      alert('Failed to update advertisement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await apiClient.deleteAdvertisement(id);
      if (response.success) {
        loadAdvertisements();
      }
    } catch (error) {
      console.error('Error deleting advertisement:', error);
      alert('Failed to delete advertisement');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advertisements</h1>
          <p className="text-gray-600 mt-1">Manage your sponsored content</p>
        </div>
        <Link
          to="/advertisements/new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="h-5 w-5" />
          Create Advertisement
        </Link>
      </div>

      {advertisements.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center border border-gray-200">
          <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No advertisements</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first advertisement</p>
          <Link
            to="/advertisements/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="h-5 w-5" />
            Create Advertisement
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {advertisements.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ad.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{ad.content}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {ad.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(ad.id, ad.isActive)}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                        ad.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ad.isActive ? (
                        <>
                          <Eye className="h-3 w-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Clicks: {ad.clicks || 0}</div>
                    <div>Impressions: {ad.impressions || 0}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ad.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/advertisements/${ad.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        disabled={deletingId === ad.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {deletingId === ad.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

