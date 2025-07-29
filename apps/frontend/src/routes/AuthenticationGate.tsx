import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';

interface AuthenticationGateProps {
  children: React.ReactNode;
}

const AuthenticationGate: React.FC<AuthenticationGateProps> = ({ children }) => {
  const { user, loading, error } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading your session..." />;
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
