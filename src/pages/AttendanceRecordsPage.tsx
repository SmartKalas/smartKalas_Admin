import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { ClipboardList, User, BookOpen, Calendar, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  note: string | null;
  photoUrl: string | null;
  createdAt: string;
  subject: {
    id: string;
    name: string;
    code: string | null;
    user: {
      id: string;
      username: string;
      email: string;
    };
  };
}

interface AttendanceListResponse {
  records: AttendanceRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AttendanceRecordsPage() {
  const [data, setData] = useState<AttendanceListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    loadRecords();
  }, [page]);

  const loadRecords = async () => {
    try {
      setError(null);
      const response = await apiClient.getAttendanceRecords(page, 50);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError('Failed to load attendance records');
      }
    } catch (error: any) {
      console.error('Error loading attendance records:', error);
      setError(error.message || 'Failed to load attendance records');
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

  const getStatusColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800';
      case 'ABSENT':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      case 'EXTRA':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Attendance Records</h1>
        <p className="text-gray-600 mt-1">View all attendance records across all subjects</p>
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
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.subject.name}</div>
                        {record.subject.code && (
                          <div className="text-sm text-gray-500">{record.subject.code}</div>
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
                        <div className="text-sm font-medium text-gray-900">{record.subject.user.username}</div>
                        <div className="text-sm text-gray-500">{record.subject.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      {formatDate(record.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                    >
                      {record.note || record.photoUrl ? (
                        <>
                          {record.photoUrl && <ImageIcon className="h-4 w-4" />}
                          View Details
                        </>
                      ) : (
                        'View'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data && data.pagination.totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing page {data.pagination.page} of {data.pagination.totalPages} 
              ({data.pagination.total} total records)
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

      {/* Record Details Modal */}
      {selectedRecord && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" 
          onClick={() => setSelectedRecord(null)}
        >
          <div 
            className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Attendance Record Details</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <p className="mt-1 text-sm text-gray-900">{selectedRecord.subject.name} {selectedRecord.subject.code && `(${selectedRecord.subject.code})`}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Student</label>
                <p className="mt-1 text-sm text-gray-900">{selectedRecord.subject.user.username} ({selectedRecord.subject.user.email})</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(selectedRecord.date)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <p className="mt-2">
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(selectedRecord.status)}`}>
                    {selectedRecord.status}
                  </span>
                </p>
              </div>
              {selectedRecord.note && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Note</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRecord.note}</p>
                </div>
              )}
              {selectedRecord.photoUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Photo</label>
                  <div className="mt-2">
                    <img 
                      src={selectedRecord.photoUrl} 
                      alt="Attendance photo" 
                      className="max-w-full h-auto rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




