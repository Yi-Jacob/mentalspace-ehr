
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Users, Shield, Settings, Eye, UserCog, BookOpen, Clock, TrendingUp, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoleManagement from '@/components/staff/RoleManagement';
import StaffWorkflowView from '@/components/staff/StaffWorkflowView';
import StaffAccessManagement from '@/components/staff/StaffAccessManagement';
import StaffSupervisionView from '@/components/staff/StaffSupervisionView';
import StaffAuditLogs from '@/components/staff/StaffAuditLogs';
import TimeTrackingView from '@/components/staff/TimeTrackingView';
import PerformanceView from '@/components/staff/PerformanceView';
import TrainingCertificationView from '@/components/staff/TrainingCertificationView';

const StaffPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAddTeamMember = () => {
    navigate('/staff/add');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-xl">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                Staff Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your team with style and efficiency</p>
            </div>
          </div>
          <Button 
            onClick={handleAddTeamMember}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Team Member
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-9 bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-xl p-2">
            <TabsTrigger value="workflow" className="flex items-center space-x-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all">
              <Settings className="h-4 w-4" />
              <span>Workflow</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center space-x-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all">
              <Users className="h-4 w-4" />
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
            <StaffWorkflowView />
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
      </div>
    </div>
  );
};

export default StaffPage;
