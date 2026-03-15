import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { BookOpen, User, Calendar, AlertCircle, TrendingUp } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  code: string | null;
  totalClasses: number;
  attendedClasses: number;
  requiredPercentage: number;
  color: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

interface SubjectListResponse {
  subjects: Subject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function SubjectsPage() {
  const [data, setData] = useState<SubjectListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadSubjects();
  }, [page]);

  const loadSubjects = async () => {
    try {
      setError(null);
      const response = await apiClient.getSubjects(page, 50);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError('Failed to load subjects');
      }
    } catch (error: any) {
      console.error('Error loading subjects:', error);
      setError(error.message || 'Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculatePercentage = (subject: Subject): number => {
    if (subject.totalClasses === 0) return 0;
    return Math.min(100, Math.round((subject.attendedClasses / subject.totalClasses) * 100));
  };

  const getStatusColor = (percentage: number, required: number): string => {
    if (percentage >= required + 5) return 'text-green-600';
    if (percentage >= required) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Subject Management</h1>
        <p className="text-gray-600 mt-1">View all subjects created by users</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.subjects.map((subject) => {
                const percentage = calculatePercentage(subject);
                return (
                  <tr key={subject.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center mr-3"
                          style={{ backgroundColor: subject.color || '#6366f1' }}
                        >
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                          {subject.code && (
                            <div className="text-sm text-gray-500">{subject.code}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{subject.user.username}</div>
                          <div className="text-sm text-gray-500">{subject.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {subject.attendedClasses} / {subject.totalClasses}
                      </div>
                      <div className={`text-sm font-semibold ${getStatusColor(percentage, subject.requiredPercentage)}`}>
                        {percentage}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-gray-400" />
                        <span className={`text-sm font-medium ${
                          percentage >= subject.requiredPercentage
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {percentage >= subject.requiredPercentage ? 'On Track' : 'At Risk'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Required: {subject.requiredPercentage}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {formatDate(subject.createdAt)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {data && data.pagination.totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing page {data.pagination.page} of {data.pagination.totalPages} 
              ({data.pagination.total} total subjects)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page >= data.pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




