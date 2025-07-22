import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Stethoscope, Shield, Settings, Eye, UserCog, BookOpen, Clock, TrendingUp, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import StaffList from './components/StaffList';
import RoleManagement from './components/RoleManagement';
import StaffWorkflowView from './components/StaffWorkflowView';
import StaffAccessManagement from './components/StaffAccessManagement';
import StaffSupervisionView from './components/StaffSupervisionView';
import StaffAuditLogs from './components/StaffAuditLogs';
import TimeTrackingView from './components/TimeTrackingView';
import PerformanceView from './components/PerformanceView';
import TrainingCertificationView from './components/TrainingCertificationView';

const StaffPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAddTeamMember = () => {
    navigate('/staff/create');
  };

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Stethoscope}
        title="Staff Management"
        description="Manage your team with style and efficiency"
        action={
          <Button 
            onClick={handleAddTeamMember}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Staff
          </Button>
        }
      />

        {/* Tabs */}
        <Tabs defaultValue="workflow" className="space-y-6">
          <TabsList className="grid w-full grid-cols-9 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-xl p-2">
            <TabsTrigger value="workflow" className="flex items-center space-x-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all">
              <Settings className="h-4 w-4" />
              <span>Workflow</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center space-x-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all">
              <Stethoscope className="h-4 w-4" />
              <span>Staff</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center space-x-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-lg transition-all">
              <Shield className="h-4 w-4" />
              <span>Roles</span>
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center space-x-2 data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-lg transition-all">
              <Eye className="h-4 w-4" />
              <span>Access</span>
            </TabsTrigger>
            <TabsTrigger value="supervision" className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-lg transition-all">
              <UserCog className="h-4 w-4" />
              <span>Supervision</span>
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center space-x-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white rounded-lg transition-all">
              <Clock className="h-4 w-4" />
              <span>Time</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center space-x-2 data-[state=active]:bg-pink-500 data-[state=active]:text-white rounded-lg transition-all">
              <TrendingUp className="h-4 w-4" />
              <span>Performance</span>
            </TabsTrigger>
            <TabsTrigger value="training" className="flex items-center space-x-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-lg transition-all">
              <GraduationCap className="h-4 w-4" />
              <span>Training</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center space-x-2 data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-lg transition-all">
              <BookOpen className="h-4 w-4" />
              <span>Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workflow" className="space-y-6">
            <StaffWorkflowView />
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <StaffList />
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <RoleManagement />
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <StaffAccessManagement />
          </TabsContent>

          <TabsContent value="supervision" className="space-y-6">
            <StaffSupervisionView />
          </TabsContent>

          <TabsContent value="time" className="space-y-6">
            <TimeTrackingView />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceView />
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <TrainingCertificationView />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <StaffAuditLogs />
          </TabsContent>
        </Tabs>
    </PageLayout>
  );
};

export default StaffPage; 