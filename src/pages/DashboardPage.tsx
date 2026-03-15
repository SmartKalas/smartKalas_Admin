import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { Users, BookOpen, ClipboardList, TrendingUp, HardDrive, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalSubjects: number;
  totalAttendanceRecords: number;
  avgAttendancePercentage: number;
  storageUsed: number;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalSubjects: 0,
    totalAttendanceRecords: 0,
    avgAttendancePercentage: 0,
    storageUsed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setError(null);
      const response = await apiClient.getDashboardStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError('Failed to load dashboard statistics');
      }
    } catch (error: any) {
      console.error('Error loading stats:', error);
      setError(error.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (cardName: string) => {
    if (cardName === 'Total Subjects') {
      navigate('/subjects');
    } else if (cardName === 'Attendance Records') {
      navigate('/attendance-records');
    }
  };

  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      description: 'Registered users',
      onClick: () => navigate('/users'),
    },
    {
      name: 'Total Subjects',
      value: stats.totalSubjects.toLocaleString(),
      icon: BookOpen,
      color: 'bg-green-500',
      description: 'Subjects created',
      onClick: () => handleCardClick('Total Subjects'),
    },
    {
      name: 'Attendance Records',
      value: stats.totalAttendanceRecords.toLocaleString(),
      icon: ClipboardList,
      color: 'bg-purple-500',
      description: 'Total records',
      onClick: () => handleCardClick('Attendance Records'),
    },
    {
      name: 'Avg Attendance %',
      value: `${stats.avgAttendancePercentage.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'bg-orange-500',
      description: 'Average across all subjects',
      onClick: undefined,
    },
    {
      name: 'Storage Used',
      value: `${stats.storageUsed.toFixed(2)} MB`,
      icon: HardDrive,
      color: 'bg-indigo-500',
      description: 'From Supabase',
      onClick: undefined,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome to the SmartKalas Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.name}
            onClick={stat.onClick}
            className={`bg-white rounded-lg shadow p-6 border border-gray-200 transition ${
              stat.onClick 
                ? 'hover:shadow-lg cursor-pointer transform hover:scale-[1.02]' 
                : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                {stat.description && (
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                )}
              </div>
              <div className={`${stat.color} rounded-lg p-3 ml-4`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

