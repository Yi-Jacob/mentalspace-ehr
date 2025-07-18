
import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface PermissionCheckerProps {
  children: React.ReactNode;
  category: string;
  action: string;
  scope?: string;
  fallback?: React.ReactNode;
  showAlert?: boolean;
}

const PermissionChecker: React.FC<PermissionCheckerProps> = ({
  children,
  category,
  action,
  scope = 'all',
  fallback = null,
  showAlert = true
}) => {
  const { hasPermission, permissionsLoading } = usePermissions();

  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const hasAccess = hasPermission(category, action, scope);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showAlert) {
      return (
        <Alert className="border-orange-200 bg-orange-50">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this feature. Contact your administrator if you believe this is an error.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
  }

  return <>{children}</>;
};

export default PermissionChecker;
