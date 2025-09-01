
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Calendar, Clock, CheckCircle, XCircle, Plus, Filter } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Badge } from '@/components/basic/badge';
import { Table, TableColumn } from '@/components/basic/table';
import { complianceService, ComplianceDeadline } from '@/services/complianceService';
import { format, addDays, isAfter, isBefore, differenceInHours } from 'date-fns';

const ComplianceDeadlines: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [deadlineTypeFilter, setDeadlineTypeFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // Get compliance deadlines
  const { data: deadlines, isLoading } = useQuery({
    queryKey: ['compliance-deadlines', statusFilter, providerFilter, deadlineTypeFilter],
    queryFn: () => complianceService.getAllComplianceDeadlines(statusFilter, providerFilter),
  });

  // Mark deadline as met mutation
  const markAsMetMutation = useMutation({
    mutationFn: (deadlineId: string) => complianceService.markDeadlineAsMet(deadlineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-deadlines'] });
    },
  });

  const handleMarkAsMet = (deadlineId: string) => {
    markAsMetMutation.mutate(deadlineId);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm');
  };

  const getDeadlineStatus = (deadline: ComplianceDeadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline.deadlineDate);
    
    if (deadline.isMet) {
      return { status: 'met', label: 'Met', variant: 'default' as const };
    }
    
    if (isAfter(now, deadlineDate)) {
      return { status: 'overdue', label: 'Overdue', variant: 'destructive' as const };
    }
    
    const hoursUntilDeadline = differenceInHours(deadlineDate, now);
    if (hoursUntilDeadline <= 24) {
      return { status: 'urgent', label: 'Due Soon', variant: 'destructive' as const };
    }
    
    if (hoursUntilDeadline <= 72) {
      return { status: 'warning', label: 'Due This Week', variant: 'secondary' as const };
    }
    
    return { status: 'pending', label: 'Upcoming', variant: 'outline' as const };
  };

  const getReminderStatus = (deadline: ComplianceDeadline) => {
    const reminders = [];
    if (deadline.reminderSent24h) reminders.push('24h');
    if (deadline.reminderSent48h) reminders.push('48h');
    if (deadline.reminderSent72h) reminders.push('72h');
    return reminders.length > 0 ? reminders.join(', ') : 'None';
  };

  // Calculate summary statistics
  const summaryStats = deadlines ? {
    total: deadlines.length,
    met: deadlines.filter(d => d.isMet).length,
    overdue: deadlines.filter(d => !d.isMet && isAfter(new Date(), new Date(d.deadlineDate))).length,
    dueSoon: deadlines.filter(d => {
      if (d.isMet) return false;
      const hoursUntilDeadline = differenceInHours(new Date(d.deadlineDate), new Date());
      return hoursUntilDeadline <= 24 && hoursUntilDeadline > 0;
    }).length,
  } : null;

  // Define columns for the table
  const columns: TableColumn<ComplianceDeadline>[] = [
    {
      key: 'providerName',
      header: 'Provider',
      accessor: (item) => (
        <span className="font-medium">
          {item.provider ? `${item.provider.firstName} ${item.provider.lastName}` : 'Unknown'}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'deadlineType',
      header: 'Type',
      accessor: (item) => (
        <Badge variant="outline" className="text-xs">
          {item.deadlineType}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'deadlineDate',
      header: 'Deadline',
      accessor: (item) => (
        <div>
          <div className="font-medium">{formatDate(item.deadlineDate)}</div>
          <div className="text-xs text-gray-500">{formatTime(item.deadlineDate)}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (item) => {
        const status = getDeadlineStatus(item);
        return (
          <Badge variant={status.variant}>
            {status.status === 'met' && <CheckCircle className="h-3 w-3 mr-1" />}
            {status.status === 'overdue' && <XCircle className="h-3 w-3 mr-1" />}
            {status.status === 'urgent' && <AlertTriangle className="h-3 w-3 mr-1" />}
            {status.label}
          </Badge>
        );
      },
      sortable: true,
    },
    {
      key: 'progress',
      header: 'Progress',
      accessor: (item) => {
        const total = (item.notesPending || 0) + (item.notesCompleted || 0);
        const completed = item.notesCompleted || 0;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{completed}/{total}</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'reminders',
      header: 'Reminders',
      accessor: (item) => (
        <span className="text-xs text-gray-600">
          {getReminderStatus(item)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (item) => (
        <div className="flex space-x-2">
          {!item.isMet && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleMarkAsMet(item.id)}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Mark Met
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {/* TODO: View details */}}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <PageLayout variant="gradient">
        <PageHeader
          icon={AlertTriangle}
          title="Compliance Deadlines"
          description="Manage regulatory deadlines and compliance requirements"
        />
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading compliance deadlines...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={AlertTriangle}
        title="Compliance Deadlines"
        description="Manage regulatory deadlines and compliance requirements"
      />

      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="met">Met</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Provider</label>
                <Select value={providerFilter} onValueChange={setProviderFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Providers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Providers</SelectItem>
                    {deadlines?.map((deadline) => (
                      <SelectItem key={deadline.providerId} value={deadline.providerId}>
                        {deadline.provider ? `${deadline.provider.firstName} ${deadline.provider.lastName}` : 'Unknown'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Deadline Type</label>
                <Select value={deadlineTypeFilter} onValueChange={setDeadlineTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="note_completion">Note Completion</SelectItem>
                    <SelectItem value="treatment_plan_review">Treatment Plan Review</SelectItem>
                    <SelectItem value="supervision">Supervision</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        {summaryStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Deadlines</p>
                    <p className="text-2xl font-bold text-blue-600">{summaryStats.total}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Met</p>
                    <p className="text-2xl font-bold text-green-600">{summaryStats.met}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">{summaryStats.overdue}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Due Soon</p>
                    <p className="text-2xl font-bold text-orange-600">{summaryStats.dueSoon}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Deadlines Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Compliance Deadlines</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Deadline
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table
              data={deadlines || []}
              columns={columns}
              sortable
              searchable
              pagination
              pageSize={10}
              emptyMessage={
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No compliance deadlines found</h3>
                  <p className="text-gray-600 mb-4">
                    {statusFilter === 'all' 
                      ? 'No compliance deadlines have been set up yet.'
                      : `No ${statusFilter} deadlines found with the current filters.`
                    }
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Deadline
                  </Button>
                </div>
              }
            />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ComplianceDeadlines;
