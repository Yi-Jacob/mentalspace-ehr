import React from 'react';
import { Button } from '@/components/basic/button';
import { Plus, Stethoscope, Shield, Settings, Eye, UserCog, BookOpen, Clock, TrendingUp, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import PageTabs from '@/components/basic/PageTabs';
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
            Create Staff
          </Button>
        }
      />

      <PageTabs
        defaultValue="workflow"
        items={[
          {
            id: 'workflow',
            label: 'Workflow',
            icon: Settings,
            content: <StaffWorkflowView />
          },
          {
            id: 'staff',
            label: 'Staff',
            icon: Stethoscope,
            content: <StaffList />
          },
          {
            id: 'roles',
            label: 'Roles',
            icon: Shield,
            content: <RoleManagement />
          },
          {
            id: 'access',
            label: 'Access',
            icon: Eye,
            content: <StaffAccessManagement />
          },
          {
            id: 'supervision',
            label: 'Supervision',
            icon: UserCog,
            content: <StaffSupervisionView />
          },
          {
            id: 'time',
            label: 'Time',
            icon: Clock,
            content: <TimeTrackingView />
          },
          {
            id: 'performance',
            label: 'Performance',
            icon: TrendingUp,
            content: <PerformanceView />
          },
          {
            id: 'training',
            label: 'Training',
            icon: GraduationCap,
            content: <TrainingCertificationView />
          },
          {
            id: 'logs',
            label: 'Logs',
            icon: BookOpen,
            content: <StaffAuditLogs />
          }
        ]}
      />
    </PageLayout>
  );
};

export default StaffPage; 