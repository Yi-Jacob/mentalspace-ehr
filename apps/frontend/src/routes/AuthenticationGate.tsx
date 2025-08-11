import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSidebarContext } from '@/hooks/useSidebarContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { cn } from '@/utils/utils';
import { Button } from '@/components/basic/button';
import { Menu } from 'lucide-react';

interface AuthenticationGateProps {
  children?: React.ReactNode;
}

const AuthenticationGate: React.FC<AuthenticationGateProps> = ({ children }) => {
  const { user, loading, error } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebarContext();
  const isMobile = useIsMobile();

  if (loading) {
    return <LoadingSpinner message="Loading your session..." />;
  }

  if ((!user || error) && !loading) {
    return <Navigate to="/auth/login" replace />;
     
  }

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      
      {/* Mobile Menu Button */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-30 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg rounded-xl"
            title="Open Menu"
          >
            <Menu size={20} />
          </Button>
        </div>
      )}
      
      <main 
        className={cn(
          "flex-1 transition-all duration-300 min-h-screen",
          isCollapsed ? "ml-16" : "ml-64",
          "p-4 sm:p-6",
          isMobile && "ml-0 pt-20"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticationGate;
