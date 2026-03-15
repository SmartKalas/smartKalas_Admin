import { useState } from 'react';
import { Send, AlertCircle, CheckCircle, Users } from 'lucide-react';
import { apiClient } from '../services/api';

interface BroadcastMessage {
  title: string;
  message: string;
  targetAudience: 'all' | 'active' | 'inactive';
}

export default function BroadcastPage() {
  const [formData, setFormData] = useState<BroadcastMessage>({
    title: '',
    message: '',
    targetAudience: 'all',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('sending');
    setStatusMessage('');

    try {
      const response = await apiClient.sendBroadcast({
        title: formData.title,
        message: formData.message,
        targetAudience: formData.targetAudience,
      });

      if (response.success) {
        setStatus('sent');
        setStatusMessage(`Broadcast sent to ${formData.targetAudience === 'all' ? 'all users' : formData.targetAudience + ' users'}`);
        setFormData({ title: '', message: '', targetAudience: 'all' });
        
        setTimeout(() => {
          setStatus('idle');
          setStatusMessage('');
        }, 3000);
      } else {
        throw new Error(response.error?.message || 'Failed to send broadcast');
      }
    } catch (error: any) {
      setStatus('error');
      setStatusMessage(error.message || 'Failed to send broadcast');
      setTimeout(() => {
        setStatus('idle');
        setStatusMessage('');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Broadcast Messages</h1>
        <p className="text-gray-600 mt-1">Send push notifications to users</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Enter notification title"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Enter notification message"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.message.length} characters
            </p>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience
            </label>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Users', description: 'Send to all registered users' },
                { value: 'active', label: 'Active Users', description: 'Users who logged in within last 30 days' },
                { value: 'inactive', label: 'Inactive Users', description: 'Users who haven\'t logged in for 30+ days' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition ${
                    formData.targetAudience === option.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="targetAudience"
                    value={option.value}
                    checked={formData.targetAudience === option.value}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{option.label}</span>
                      {option.value === 'all' && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`p-4 rounded-lg border ${
              status === 'sent' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {status === 'sent' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <p className={`text-sm font-medium ${
                  status === 'sent' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {statusMessage}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => setFormData({ title: '', message: '', targetAudience: 'all' })}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.message}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Broadcast
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Recent Broadcasts */}
      <div className="mt-8 bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Broadcasts</h2>
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm">No recent broadcasts</p>
        </div>
      </div>
    </div>
  );
}

