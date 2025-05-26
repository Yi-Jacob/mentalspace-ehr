
import React from 'react';
import { useEnhancedStaffRoles } from '@/hooks/useEnhancedStaffRoles';
import PracticeAdminWorkflow from './PracticeAdminWorkflow';
import ClinicianWorkflow from './ClinicianWorkflow';
import SupervisorWorkflow from './SupervisorWorkflow';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const RoleWorkflowRouter: React.FC = () => {
  const { hasRole, userRoles, rolesLoading } = useEnhancedStaffRoles();

  if (rolesLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Determine primary workflow based on role hierarchy
  if (hasRole('Practice Administrator')) {
    return <PracticeAdminWorkflow />;
  }

  if (hasRole('Supervisor')) {
    return <SupervisorWorkflow />;
  }

  if (hasRole('Clinician') || hasRole('Clinical Administrator')) {
    return <ClinicianWorkflow />;
  }

  // If user has other roles but no primary clinical roles
  if (userRoles && userRoles.length > 0) {
    return (
      <Card>
        <CardContent className="flex items-center space-x-3 p-6">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <div>
            <p className="font-medium">Limited Access</p>
            <p className="text-sm text-gray-600">
              Your current roles don't provide access to clinical workflows. Contact your administrator for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No roles assigned
  return (
    <Card>
      <CardContent className="flex items-center space-x-3 p-6">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <div>
          <p className="font-medium">No Roles Assigned</p>
          <p className="text-sm text-gray-600">
            You don't have any roles assigned. Contact your Practice Administrator to get started.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleWorkflowRouter;
