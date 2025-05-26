
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Users, Shield, UserCheck, Settings } from 'lucide-react';
import { useStaffRoles } from '@/hooks/useStaffRoles';
import StaffList from './StaffList';
import RoleManagement from './RoleManagement';
import PatientAccessManagement from './PatientAccessManagement';
import SupervisionManagement from './SupervisionManagement';
import AuditLogs from './AuditLogs';
import CreateStaffModal from './CreateStaffModal';

const StaffManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('staff');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { hasRole } = useStaffRoles();

  const canManageStaff = hasRole('Practice Administrator');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-2">
            Manage staff profiles, roles, and permissions
          </p>
        </div>
        {canManageStaff && (
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="staff" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Staff</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Roles</span>
          </TabsTrigger>
          <TabsTrigger value="access" className="flex items-center space-x-2">
            <UserCheck className="h-4 w-4" />
            <span>Patient Access</span>
          </TabsTrigger>
          <TabsTrigger value="supervision" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Supervision</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Audit Logs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          <StaffList />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RoleManagement />
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <PatientAccessManagement />
        </TabsContent>

        <TabsContent value="supervision" className="space-y-4">
          <SupervisionManagement />
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <AuditLogs />
        </TabsContent>
      </Tabs>

      <CreateStaffModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default StaffManagementPage;
