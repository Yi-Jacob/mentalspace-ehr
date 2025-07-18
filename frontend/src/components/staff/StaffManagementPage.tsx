
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Users, Shield, UserCheck, Settings, Workflow, Eye, Sparkles } from 'lucide-react';
import { useStaffRoles } from '@/hooks/useStaffRoles';
import StaffList from './StaffList';
import RoleManagement from './RoleManagement';
import PatientAccessManagement from './PatientAccessManagement';
import SupervisionManagement from './SupervisionManagement';
import AuditLogs from './AuditLogs';
import CreateStaffModal from './CreateStaffModal';
import RoleWorkflowRouter from './role-workflows/RoleWorkflowRouter';
import SupervisionWorkflow from './workflows/SupervisionWorkflow';
import AuditTrail from './audit/AuditTrail';
import AdminRoleRestorer from './AdminRoleRestorer';

const StaffManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workflow');
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { hasRole, rolesLoading } = useStaffRoles();

  const canManageStaff = hasRole('Practice Administrator');

  // Show loading state while checking roles
  if (rolesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading your permissions...</p>
        </div>
      </div>
    );
  }

  // Show role restorer if user doesn't have admin privileges
  if (!canManageStaff) {
    return <AdminRoleRestorer />;
  }

  const handleAddStaff = () => {
    navigate('/staff/add');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Modern Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-200/50 transform rotate-3 group-hover:rotate-6 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              {/* Floating accent */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                Staff Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Manage your team with style and efficiency
              </p>
            </div>
          </div>
          
          <Button 
            onClick={handleAddStaff} 
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-6 py-3"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Team Member
          </Button>
        </div>

        {/* Modern Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <TabsList className="grid w-full grid-cols-7 bg-transparent gap-2">
              <TabsTrigger 
                value="workflow" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Workflow className="h-4 w-4" />
                <span className="hidden sm:inline">Workflow</span>
              </TabsTrigger>
              <TabsTrigger 
                value="staff" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Staff</span>
              </TabsTrigger>
              <TabsTrigger 
                value="roles" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Roles</span>
              </TabsTrigger>
              <TabsTrigger 
                value="access" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <UserCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Access</span>
              </TabsTrigger>
              <TabsTrigger 
                value="supervision" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Supervision</span>
              </TabsTrigger>
              <TabsTrigger 
                value="audit" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Logs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="trail" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Trail</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content with modern styling */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <TabsContent value="workflow" className="space-y-4 mt-0">
              <RoleWorkflowRouter />
            </TabsContent>

            <TabsContent value="staff" className="space-y-4 mt-0">
              <StaffList />
            </TabsContent>

            <TabsContent value="roles" className="space-y-4 mt-0">
              <RoleManagement />
            </TabsContent>

            <TabsContent value="access" className="space-y-4 mt-0">
              <PatientAccessManagement />
            </TabsContent>

            <TabsContent value="supervision" className="space-y-4 mt-0">
              <SupervisionWorkflow />
            </TabsContent>

            <TabsContent value="audit" className="space-y-4 mt-0">
              <AuditLogs />
            </TabsContent>

            <TabsContent value="trail" className="space-y-4 mt-0">
              <AuditTrail />
            </TabsContent>
          </div>
        </Tabs>

        <CreateStaffModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    </div>
  );
};

export default StaffManagementPage;
