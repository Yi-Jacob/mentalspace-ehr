
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import AddStaffAction from '../AddStaffAction';
import ManageRolesAction from '../ManageRolesAction';
import SystemSettingsAction from '../SystemSettingsAction';
import AuditReportsAction from '../AuditReportsAction';
import SystemSettings from '../SystemSettings';

const PracticeAdminWorkflow: React.FC = () => {
  const { canManageUsers, canAssignRoles, canViewAuditLogs } = usePermissions();
  const [currentView, setCurrentView] = useState<'dashboard' | 'roles' | 'settings' | 'audit'>('dashboard');

  if (currentView === 'settings') {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to Dashboard
        </button>
        <SystemSettings />
      </div>
    );
  }

  if (currentView === 'roles') {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to Dashboard
        </button>
        <div className="text-center py-8">
          <p className="text-gray-600">Role management interface will be available here.</p>
          <p className="text-gray-500 text-sm">Use the "Roles" tab in the main navigation for now.</p>
        </div>
      </div>
    );
  }

  if (currentView === 'audit') {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to Dashboard
        </button>
        <div className="text-center py-8">
          <p className="text-gray-600">Audit reports interface will be available here.</p>
          <p className="text-gray-500 text-sm">Use the "Audit Logs" or "Audit Trail" tabs in the main navigation for now.</p>
        </div>
      </div>
    );
  }

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
        <AddStaffAction />
        <ManageRolesAction onNavigate={() => setCurrentView('roles')} />
        <SystemSettingsAction onNavigate={() => setCurrentView('settings')} />
        <AuditReportsAction onNavigate={() => setCurrentView('audit')} />
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
