
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/Sidebar';
import authenticatedRoutes from './authenticated-routes';

const AuthenticationGate = () => {
  const { user, loading, error, refreshSession } = useAuth();
  const location = useLocation();

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button onClick={refreshSession} variant="outline" className="flex-1">
              Retry
            </Button>
            <Button onClick={() => window.location.href = '/auth'} className="flex-1">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
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
