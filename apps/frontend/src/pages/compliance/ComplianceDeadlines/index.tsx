
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
import { schedulingService, Appointment } from '@/services/schedulingService';
import { format, addDays, isAfter, isBefore, differenceInHours } from 'date-fns';

const ComplianceDeadlines: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // Get sessions with deadlines
  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['session-deadlines', statusFilter, providerFilter],
    queryFn: () => schedulingService.getAppointments({ 
      status: 'Completed',
      hasSession: true,
      providerId: providerFilter === 'all' ? undefined : providerFilter
    }),
  });

  // Filter sessions based on status
  const filteredSessions = sessions?.filter(session => {
    if (statusFilter === 'all') return true;
    return session.deadlineStatus?.status === statusFilter;
  }) || [];

  // Mark session as completed (note signed)
  const markAsCompletedMutation = useMutation({
    mutationFn: (sessionId: string) => schedulingService.signNote(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session-deadlines'] });
    },
  });

  const handleMarkAsCompleted = (sessionId: string) => {
    markAsCompletedMutation.mutate(sessionId);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'met':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />Met</Badge>;
      case 'overdue':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
      case 'urgent':
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Due Soon</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  // Calculate summary statistics
  const summaryStats = filteredSessions ? {
    total: filteredSessions.length,
    met: filteredSessions.filter(s => s.deadlineStatus?.status === 'met').length,
    overdue: filteredSessions.filter(s => s.deadlineStatus?.status === 'overdue').length,
    dueSoon: filteredSessions.filter(s => s.deadlineStatus?.status === 'urgent').length,
  } : null;

  // Define columns for the table
  const columns: TableColumn<Appointment>[] = [
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
      key: 'clientName',
      header: 'Client',
      accessor: (item) => (
        <span className="font-medium">
          {item.clients ? `${item.clients.firstName} ${item.clients.lastName}` : 'Unknown'}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'sessionType',
      header: 'Session Type',
      accessor: (item) => (
        <Badge variant="outline" className="text-xs">
          {item.appointmentType}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'startTime',
      header: 'Session Date',
      accessor: (item) => (
        <div>
          <div className="font-medium">{formatDate(item.startTime)}</div>
          <div className="text-xs text-gray-500">{formatTime(item.startTime)}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'deadline',
      header: 'Deadline',
      accessor: (item) => (
        <div>
          <div className="font-medium">{item.deadline ? formatDate(item.deadline) : 'N/A'}</div>
          <div className="text-xs text-gray-500">{item.deadline ? formatTime(item.deadline) : ''}</div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (item) => getStatusBadge(item.deadlineStatus?.status || 'pending'),
      sortable: true,
    },
    {
      key: 'noteStatus',
      header: 'Note Status',
      accessor: (item) => (
        <Badge variant={item.isNoteSigned ? "default" : "secondary"}>
          {item.isNoteSigned ? 'Signed' : 'Unsigned'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (item) => (
        <div className="flex space-x-2">
          {!item.isNoteSigned && !item.isLocked && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleMarkAsCompleted(item.id)}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Mark Completed
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {/* TODO: View session details */}}
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
          description="Manage note completion deadlines and compliance requirements"
        />
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading compliance deadlines...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout variant="gradient">
        <PageHeader
          icon={AlertTriangle}
          title="Compliance Deadlines"
          description="Manage note completion deadlines and compliance requirements"
        />
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading sessions</h3>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'An error occurred while loading sessions.'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={AlertTriangle}
        title="Compliance Deadlines"
        description="Manage note completion deadlines and compliance requirements"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="urgent">Due Soon</SelectItem>
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
                    {sessions?.map((session) => (
                      <SelectItem key={session.providerId} value={session.providerId}>
                        {session.provider ? `${session.provider.firstName} ${session.provider.lastName}` : 'Unknown'}
                      </SelectItem>
                    ))}
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
                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
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
                    <p className="text-sm font-medium text-gray-600">Notes Signed</p>
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

        {/* Sessions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Note Completion Deadlines</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table
              data={filteredSessions}
              columns={columns}
              sortable
              searchable
              pagination
              pageSize={10}
              emptyMessage={
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
                  <p className="text-gray-600 mb-4">
                    {statusFilter === 'all' 
                      ? 'No sessions have been scheduled yet.'
                      : `No ${statusFilter} sessions found with the current filters.`
                    }
                  </p>
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
