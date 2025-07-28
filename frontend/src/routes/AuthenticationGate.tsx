import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';

const AuthenticationGate = () => {
  const { user, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your session...</p>
        </div>
      </div>
    );
  }

  if ((!user || error) && !loading) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 ml-16 lg:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticationGate;
