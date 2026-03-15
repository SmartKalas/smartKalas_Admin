import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App
