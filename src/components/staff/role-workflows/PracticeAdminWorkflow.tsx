
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Settings, Shield, FileText, Clock } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

const PracticeAdminWorkflow: React.FC = () => {
  const { canManageUsers, canAssignRoles, canViewAuditLogs } = usePermissions();

  const quickActions = [
    {
      title: 'Add New Staff',
      description: 'Create new user accounts and assign roles',
      icon: Users,
      action: 'add_staff',
      enabled: canManageUsers()
    },
    {
      title: 'Manage Roles',
      description: 'Assign and modify user roles',
      icon: Shield,
      action: 'manage_roles',
      enabled: canAssignRoles()
    },
    {
      title: 'System Settings',
      description: 'Configure practice-wide settings',
      icon: Settings,
      action: 'system_settings',
      enabled: true
    },
    {
      title: 'Audit Reports',
      description: 'View system audit logs and reports',
      icon: FileText,
      action: 'audit_reports',
      enabled: canViewAuditLogs()
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Practice Administrator Dashboard</h2>
          <p className="text-gray-600">Manage users, roles, and system settings</p>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          Administrator
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Card key={action.action} className={!action.enabled ? 'opacity-50' : 'hover:shadow-md transition-shadow cursor-pointer'}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <action.icon className="h-4 w-4" />
                <span>{action.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 mb-3">{action.description}</p>
              <Button 
                size="sm" 
                disabled={!action.enabled}
                className="w-full"
              >
                {action.enabled ? 'Access' : 'No Permission'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Administrative Activities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">New staff member added</p>
                <p className="text-sm text-gray-600">Dr. Smith assigned Clinician role</p>
              </div>
              <Badge variant="outline">Today</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">Role permissions updated</p>
                <p className="text-sm text-gray-600">Clinical Administrator role modified</p>
              </div>
              <Badge variant="outline">Yesterday</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PracticeAdminWorkflow;
