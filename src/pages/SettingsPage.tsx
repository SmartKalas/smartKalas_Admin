import { useState } from 'react';
import { Settings, ToggleLeft, ToggleRight, AlertCircle, CheckCircle } from 'lucide-react';
import LogoManager from '../components/LogoManager';

interface AppSettings {
  appMode: 'active' | 'maintenance';
  photoAttendance: boolean;
  notifications: boolean;
  analytics: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>({
    appMode: 'active',
    photoAttendance: true,
    notifications: true,
    analytics: true,
  });
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleToggle = (key: keyof AppSettings) => {
    if (key === 'appMode') {
      setSettings((prev) => ({
        ...prev,
        appMode: prev.appMode === 'active' ? 'maintenance' : 'active',
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveStatus('saving');
    
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setLoading(false);
    }
  };

  const featureToggles = [
    {
      key: 'photoAttendance' as keyof AppSettings,
      label: 'Photo Attendance',
      description: 'Enable photo capture for attendance records',
      enabled: settings.photoAttendance,
    },
    {
      key: 'notifications' as keyof AppSettings,
      label: 'Push Notifications',
      description: 'Send push notifications to users',
      enabled: settings.notifications,
    },
    {
      key: 'analytics' as keyof AppSettings,
      label: 'Analytics Tracking',
      description: 'Track user analytics and events',
      enabled: settings.analytics,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage app configuration and feature toggles</p>
      </div>

      {/* Logo Management */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Logo Management</h2>
        <LogoManager />
      </div>

      {/* App Mode */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">App Mode</h2>
            <p className="text-sm text-gray-600">
              {settings.appMode === 'maintenance' 
                ? 'App is in maintenance mode. Users will see a maintenance message.'
                : 'App is active. All features are available to users.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${
              settings.appMode === 'active' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {settings.appMode === 'active' ? 'Active' : 'Maintenance'}
            </span>
            <button
              onClick={() => handleToggle('appMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.appMode === 'active' ? 'bg-green-600' : 'bg-yellow-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.appMode === 'active' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        {settings.appMode === 'maintenance' && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Maintenance mode is enabled. Users will be redirected to a maintenance page.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Feature Toggles */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Feature Toggles</h2>
        <div className="space-y-4">
          {featureToggles.map((feature) => (
            <div key={feature.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{feature.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
              </div>
              <button
                onClick={() => handleToggle(feature.key)}
                className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  feature.enabled ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    feature.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {saveStatus === 'saved' && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Settings saved</span>
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Failed to save settings</span>
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={loading || saveStatus === 'saving'}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

