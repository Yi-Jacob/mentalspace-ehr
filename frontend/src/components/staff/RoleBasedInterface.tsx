
import React from 'react';
import { useEnhancedStaffRoles } from '@/hooks/useEnhancedStaffRoles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, AlertTriangle } from 'lucide-react';
import { UserRole } from '@/types/staff';

interface RoleBasedInterfaceProps {
  children?: React.ReactNode;
  requiredRoles?: UserRole[];
  fallbackMessage?: string;
}

const RoleBasedInterface: React.FC<RoleBasedInterfaceProps> = ({
  children,
  requiredRoles = [],
  fallbackMessage = "You don't have permission to access this content.",
}) => {
  const { 
    userRoles, 
    rolesLoading, 
    hasRole, 
    hasAnyRole,
    canManageUsers,
    canAssignRoles 
  } = useEnhancedStaffRoles();

  if (rolesLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no specific roles required, show content
  if (requiredRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has any of the required roles
  const hasAccess = hasAnyRole(requiredRoles);

  if (!hasAccess) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{fallbackMessage}</AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

// Component to display current user's roles
export const CurrentUserRoles: React.FC = () => {
  const { userRoles, rolesLoading } = useEnhancedStaffRoles();

  if (rolesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Your Roles</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Loading roles...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Your Roles</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {userRoles && userRoles.length > 0 ? (
            userRoles.map((roleData, index) => (
              <Badge 
                key={`${roleData.role}-${index}`}
                variant="default"
                className="bg-blue-100 text-blue-800"
              >
                {roleData.role}
              </Badge>
            ))
          ) : (
            <p className="text-gray-500">No roles assigned</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Component for role-based content sections
export const RoleSection: React.FC<{
  roles: UserRole[];
  title: string;
  children: React.ReactNode;
}> = ({ roles, title, children }) => {
  const { hasAnyRole } = useEnhancedStaffRoles();

  if (!hasAnyRole(roles)) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Users className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
};

export default RoleBasedInterface;
