
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';
import { subDays, isAfter } from 'date-fns';
import { useComplianceMetrics } from '@/hooks/useComplianceMetrics';
import { useProductivityGoals } from '@/hooks/useProductivityGoals';
import { useQuickActions } from '@/hooks/useQuickActions';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import LoadingWithError from '@/components/LoadingWithError';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import { BarChart3 } from 'lucide-react';
import ComplianceStatsGrid from '../components/compliance/ComplianceStatsGrid';
import RecentComplianceList from '../components/compliance/RecentComplianceList';
import ComplianceGoals from '../components/compliance/ComplianceGoals';
import ActionRequiredCard from '../components/compliance/ActionRequiredCard';
import ActiveActionsCard from '../components/compliance/ActiveActionsCard';

const NoteCompliancePage = () => {
  const { metrics, isLoading: metricsLoading } = useComplianceMetrics();
  const { goals, isLoading: goalsLoading } = useProductivityGoals();
  const { actions, createAction } = useQuickActions();

  const { data: complianceData, isLoading, error, refetch } = useQuery({
    queryKey: ['compliance-data'],
    queryFn: async () => {
      const response = await noteService.getNotes();
      return response.notes;
    },
  });

  const notes = complianceData || [];
  const signedNotes = notes.filter(note => note.status === 'signed').length;
  const draftNotes = notes.filter(note => note.status === 'draft').length;
  const overdueNotes = notes.filter(note => 
    note.status === 'draft' && isAfter(subDays(new Date(), 7), new Date(note.updatedAt))
  ).length;

  const compliance24h = Math.round(metrics.completion_rate || 0);
  const foundGoal = goals.find(g => g.goalType === 'daily_notes');
  const dailyGoal = foundGoal 
    ? { target_value: foundGoal.targetValue, current_value: foundGoal.currentValue || 0 }
    : { target_value: 5, current_value: 0 };

  const handleCreateReminder = () => {
    createAction({
      actionType: 'review_draft',
      title: 'Review Pending Notes',
      description: `You have ${draftNotes} draft notes that need attention`,
      priority: overdueNotes > 0 ? 3 : 2,
      dueDate: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={BarChart3}
        title="Note Compliance Dashboard"
        description="Track your notes compliance and accountability metrics"
      />
      
      <EnhancedErrorBoundary 
        componentName="NoteCompliancePage"
        showErrorDetails={process.env.NODE_ENV === 'development'}
        enableRetry={true}
      >
        <LoadingWithError
          isLoading={isLoading || metricsLoading || goalsLoading}
          error={error}
          onRetry={() => refetch()}
          errorTitle="Failed to load compliance data"
          errorDescription="There was an issue loading your compliance metrics. Please try again."
          loadingComponent={<LoadingSpinner message="Loading compliance data..." />}
        >
          <div className="space-y-6">
            {/* Main Stats Grid */}
            <ComplianceStatsGrid
              compliance24h={compliance24h}
              dailyGoal={dailyGoal}
              draftNotes={draftNotes}
              overdueNotes={overdueNotes}
            />

            {/* Detailed Compliance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentComplianceList notes={notes} />
              <ComplianceGoals 
                compliance24h={compliance24h}
                onCreateReminder={handleCreateReminder}
              />
            </div>

            {/* Action Items */}
            <ActionRequiredCard
              draftNotes={draftNotes}
              overdueNotes={overdueNotes}
              onCreateReminder={handleCreateReminder}
            />

            {/* Active Quick Actions */}
            <ActiveActionsCard actions={actions} />
          </div>
        </LoadingWithError>
      </EnhancedErrorBoundary>
    </PageLayout>
  );
};

export default NoteCompliancePage;
