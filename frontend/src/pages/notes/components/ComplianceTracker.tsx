
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';
import { subDays, isAfter } from 'date-fns';
import { useComplianceMetrics } from '@/hooks/useComplianceMetrics';
import { useProductivityGoals } from '@/hooks/useProductivityGoals';
import { useQuickActions } from '@/hooks/useQuickActions';
import ComplianceStatsGrid from './compliance/ComplianceStatsGrid';
import RecentComplianceList from './compliance/RecentComplianceList';
import ComplianceGoals from './compliance/ComplianceGoals';
import ActionRequiredCard from './compliance/ActionRequiredCard';
import ActiveActionsCard from './compliance/ActiveActionsCard';

const ComplianceTracker = () => {
  const { metrics, isLoading: metricsLoading } = useComplianceMetrics();
  const { goals, isLoading: goalsLoading } = useProductivityGoals();
  const { actions, createAction } = useQuickActions();

  const { data: complianceData, isLoading } = useQuery({
    queryKey: ['compliance-data'],
    queryFn: async () => {
      const response = await noteService.getNotes();
      return response.notes;
    },
  });

  if (isLoading || metricsLoading || goalsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const notes = complianceData || [];
  const signedNotes = notes.filter(note => note.status === 'signed').length;
  const draftNotes = notes.filter(note => note.status === 'draft').length;
  const overdueNotes = notes.filter(note => 
    note.status === 'draft' && isAfter(subDays(new Date(), 7), new Date(note.updatedAt))
  ).length;

  const compliance24h = Math.round(metrics.completion_rate || 0);
  const dailyGoal = goals.find(g => g.goal_type === 'daily_notes') || { target_value: 5, current_value: 0 };

  const handleCreateReminder = () => {
    createAction({
      action_type: 'review_draft',
      title: 'Review Pending Notes',
      description: `You have ${draftNotes} draft notes that need attention`,
      priority: overdueNotes > 0 ? 3 : 2,
      due_date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Compliance Dashboard
        </h2>
        <p className="text-gray-600">Track your notes compliance and accountability</p>
      </div>

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
  );
};

export default ComplianceTracker;
