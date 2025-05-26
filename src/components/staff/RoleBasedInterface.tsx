
import React from 'react';
import { useEnhancedStaffRoles } from '@/hooks/useEnhancedStaffRoles';
import { UserRole } from '@/types/staff';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Calendar, FileText, DollarSign } from 'lucide-react';

const RoleBasedInterface: React.FC = () => {
  const {
    userRoles,
    rolesLoading,
    hasRole,
    isClinicalAdministrator,
    canSupervise,
    canBillInsurance,
    hasScheduleAccess,
    canCreateNoteType
  } = useEnhancedStaffRoles();

  if (rolesLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activeRoles = userRoles?.filter(role => role.is_active) || [];

  const getRoleCapabilities = (role: UserRole) => {
    const capabilities: string[] = [];

    switch (role) {
      case 'Practice Administrator':
        capabilities.push('User Management', 'System Configuration', 'Audit Logs', 'Role Assignment');
        break;
      case 'Clinician':
        capabilities.push('Clinical Notes', 'Patient Records', 'Treatment Plans', 'Schedule Management');
        break;
      case 'Clinical Administrator':
        capabilities.push('All Patient Access', 'Note Deletion', 'Access Management', 'Clinical Policies');
        break;
      case 'Supervisor':
        capabilities.push('Supervisee Notes', 'Co-signing', 'Note Reopening', 'Supervision Sessions');
        break;
      case 'Practice Scheduler':
        capabilities.push('All Schedules', 'Appointment Management', 'Basic Patient Info', 'Limited Notes');
        break;
      case 'Practice Biller':
        capabilities.push('All Billing', 'Claims Management', 'Reports', 'Payment Processing');
        break;
      case 'Biller for Assigned Patients Only':
        capabilities.push('Patient Billing', 'Copay Collection', 'Insurance Verification');
        break;
      case 'Intern':
      case 'Assistant':
      case 'Associate':
        capabilities.push('Clinical Notes (Supervised)', 'Patient Records', 'No Direct Billing');
        break;
    }

    return capabilities;
  };

  const getStatusIndicators = () => {
    const indicators = [];

    if (isClinicalAdministrator()) {
      indicators.push({ type: 'success', text: 'Clinical Admin (Valid)' });
    } else if (hasRole('Clinical Administrator') && !hasRole('Clinician')) {
      indicators.push({ type: 'error', text: 'Clinical Admin (Missing Clinician Role)' });
    }

    if (canSupervise()) {
      indicators.push({ type: 'info', text: 'Supervision Enabled' });
    }

    if (!canBillInsurance() && (hasRole('Intern') || hasRole('Assistant') || hasRole('Associate'))) {
      indicators.push({ type: 'warning', text: 'Requires Supervisor for Billing' });
    }

    return indicators;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Your Role Capabilities</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {activeRoles.map((role) => (
              <Badge key={role.id} variant="secondary" className="px-3 py-1">
                {role.role}
              </Badge>
            ))}
          </div>

          {getStatusIndicators().map((indicator, index) => (
            <Badge 
              key={index}
              variant={indicator.type === 'error' ? 'destructive' : 'secondary'}
              className={
                indicator.type === 'success' ? 'bg-green-100 text-green-800' :
                indicator.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                indicator.type === 'info' ? 'bg-blue-100 text-blue-800' : ''
              }
            >
              {indicator.text}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Schedule Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={hasScheduleAccess() ? 'default' : 'secondary'}>
              {hasScheduleAccess() ? 'Enabled' : 'No Access'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Clinical Notes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={canCreateNoteType('clinical') ? 'default' : 'secondary'}>
              {canCreateNoteType('clinical') ? 'Full Access' : 'Limited/No Access'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Billing</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={canBillInsurance() ? 'default' : 'secondary'}>
              {canBillInsurance() ? 'Direct Billing' : 'Supervised Only'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Supervision</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={canSupervise() ? 'default' : 'secondary'}>
              {canSupervise() ? 'Can Supervise' : 'No Supervision'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {activeRoles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <CardTitle className="text-lg">{role.role}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {getRoleCapabilities(role.role as UserRole).map((capability, index) => (
                  <Badge key={index} variant="outline">
                    {capability}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoleBasedInterface;
