import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  LayoutDashboard,
  Megaphone,
  Users,
  LogOut,
  Menu,
  Settings,
  Radio,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { logoService } from '../services/logoService';
import DynamicFavicon from './DynamicFavicon';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Advertisements', href: '/advertisements', icon: Megaphone },
  { name: 'Broadcast', href: '/broadcast', icon: Radio },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('https://qjxbwbpitwhujoufsxgb.supabase.co/storage/v1/object/public/App/smartKalasLogo.png');

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const config = await logoService.getLogoConfig();
        setLogoUrl(config.logoUrl);
      } catch (error) {
        console.error('Failed to load logo config:', error);
        // Keep default logo on error
      }
    };

    loadLogo();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DynamicFavicon logoUrl={logoUrl} />
      
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:z-30">
        <SidebarContent location={location} onLogout={handleLogout} user={user} logoUrl={logoUrl} />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl z-50">
            <SidebarContent location={location} onLogout={handleLogout} user={user} logoUrl={logoUrl} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex h-16 flex-shrink-0 bg-white shadow-sm border-b border-gray-200">
          <button
            type="button"
            className="px-4 text-gray-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4 lg:px-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{user?.username || 'Admin'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  location,
  onLogout,
  user,
  logoUrl,
}: {
  location: { pathname: string };
  onLogout: () => void;
  user: { username: string; email: string } | null;
  logoUrl: string;
}) {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
            <img 
              src={logoUrl} 
              alt="SmartKalas Logo"
              className="h-6 w-6 rounded"
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">SmartKalas</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
            (item.href !== '/' && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-200 p-4 mt-auto">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-sm text-gray-700">
            <span className="font-medium">{user?.username || 'Admin'}</span>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

