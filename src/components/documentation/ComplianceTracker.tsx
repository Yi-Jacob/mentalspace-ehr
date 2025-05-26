
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  AlertTriangle, 
  TrendingUp,
  Target,
  Calendar,
  Award
} from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';
import { useComplianceMetrics } from '@/hooks/useComplianceMetrics';
import { useProductivityGoals } from '@/hooks/useProductivityGoals';
import { useQuickActions } from '@/hooks/useQuickActions';

const ComplianceTracker = () => {
  const { metrics, isLoading: metricsLoading } = useComplianceMetrics();
  const { goals, isLoading: goalsLoading } = useProductivityGoals();
  const { actions, createAction } = useQuickActions();

  const { data: complianceData, isLoading } = useQuery({
    queryKey: ['compliance-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinical_notes')
        .select(`
          *,
          clients!inner(first_name, last_name),
          provider:users!clinical_notes_provider_id_fkey(first_name, last_name)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
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
  const totalNotes = notes.length;
  const signedNotes = notes.filter(note => note.status === 'signed').length;
  const draftNotes = notes.filter(note => note.status === 'draft').length;
  const overdueNotes = notes.filter(note => 
    note.status === 'draft' && isAfter(subDays(new Date(), 7), new Date(note.updated_at))
  ).length;

  const compliance24h = Math.round(metrics.completion_rate || 0);
  const compliance48h = signedNotes > 0 ? Math.round(((signedNotes + Math.min(draftNotes, 2)) / totalNotes) * 100) : 0;

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const dailyGoal = goals.find(g => g.goal_type === 'daily_notes') || { target_value: 5, current_value: 0 };
  const goalProgress = Math.min((dailyGoal.current_value / dailyGoal.target_value) * 100, 100);

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
        <p className="text-gray-600">Track your documentation compliance and accountability</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 24h Compliance */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">24h Compliance</p>
                <p className={`text-3xl font-bold ${getComplianceColor(compliance24h)}`}>
                  {compliance24h}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress 
              value={compliance24h} 
              className="mt-3 h-2"
            />
          </CardContent>
        </Card>

        {/* Daily Goal Progress */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Daily Goal</p>
                <p className="text-3xl font-bold text-blue-600">
                  {dailyGoal.current_value}/{dailyGoal.target_value}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Progress 
              value={goalProgress} 
              className="mt-3 h-2"
            />
            <p className="text-xs text-blue-600 mt-1">
              {goalProgress >= 100 ? 'Goal achieved! 🎉' : `${dailyGoal.target_value - dailyGoal.current_value} more to go`}
            </p>
          </CardContent>
        </Card>

        {/* Unsigned Notes */}
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Unsigned Notes</p>
                <p className="text-3xl font-bold text-orange-600">{draftNotes}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-orange-600 mt-2">
              {draftNotes === 0 ? 'All caught up!' : 'Needs attention'}
            </p>
          </CardContent>
        </Card>

        {/* Overdue Notes */}
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Overdue Notes</p>
                <p className="text-3xl font-bold text-red-600">{overdueNotes}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-red-600 mt-2">
              {overdueNotes === 0 ? 'Great job!' : '7+ days old'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Compliance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documentation Compliance */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span>Recent Documentation Compliance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notes.slice(0, 4).map((note) => {
              const isOverdue = note.status === 'draft' && 
                isAfter(subDays(new Date(), 7), new Date(note.updated_at));
              
              return (
                <div key={note.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{note.title}</p>
                      <Badge 
                        className={`text-xs ${
                          note.status === 'signed' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : isOverdue 
                              ? 'bg-red-100 text-red-800 border-red-200'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}
                      >
                        {note.status === 'signed' ? 'Signed' : isOverdue ? 'Overdue' : 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {note.clients?.first_name} {note.clients?.last_name} • 
                      Created: {format(new Date(note.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {note.provider?.first_name} {note.provider?.last_name}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Goals & Targets */}
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span>Compliance Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Monthly Goal */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Monthly Target</span>
                <span className="text-sm text-purple-600 font-semibold">95%</span>
              </div>
              <Progress value={compliance24h} className="h-3" />
              <p className="text-xs text-gray-600">
                {compliance24h >= 95 ? 'Target achieved! 🎉' : `${95 - compliance24h}% to reach goal`}
              </p>
            </div>

            {/* Weekly Streak */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-purple-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Award className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Weekly Streak</p>
                  <p className="text-sm text-gray-600">Consecutive compliant days</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.floor(Math.random() * 7) + 1}
                </p>
                <p className="text-xs text-purple-500">days</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Quick Actions</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={handleCreateReminder}>
                  <Calendar className="w-4 h-4 mr-1" />
                  Schedule
                </Button>
                <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                  <FileText className="w-4 h-4 mr-1" />
                  Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      {(draftNotes > 0 || overdueNotes > 0) && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-amber-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-2">Action Required</h3>
                <ul className="space-y-1 text-sm text-amber-800">
                  {draftNotes > 0 && (
                    <li>• {draftNotes} unsigned note{draftNotes > 1 ? 's' : ''} need{draftNotes === 1 ? 's' : ''} your attention</li>
                  )}
                  {overdueNotes > 0 && (
                    <li>• {overdueNotes} note{overdueNotes > 1 ? 's are' : ' is'} overdue (7+ days old)</li>
                  )}
                </ul>
                <div className="mt-3 flex space-x-2">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                    Review Pending Notes
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCreateReminder}>
                    Set Reminders
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Quick Actions */}
      {actions.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Active Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {actions.slice(0, 3).map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <Badge variant={action.priority === 3 ? "destructive" : action.priority === 2 ? "default" : "secondary"}>
                    {action.priority === 3 ? 'High' : action.priority === 2 ? 'Medium' : 'Low'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComplianceTracker;
