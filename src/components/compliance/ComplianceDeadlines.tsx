import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Calendar, Bell, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ComplianceDeadlines: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'met' | 'overdue'>('all');

  const { data: deadlines, isLoading } = useQuery({
    queryKey: ['compliance-deadlines', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('compliance_deadlines')
        .select(`
          *,
          provider:users(first_name, last_name)
        `)
        .order('deadline_date', { ascending: true });

      const now = new Date();
      
      if (statusFilter === 'pending') {
        query = query.eq('is_met', false).gte('deadline_date', now.toISOString());
      } else if (statusFilter === 'met') {
        query = query.eq('is_met', true);
      } else if (statusFilter === 'overdue') {
        query = query.eq('is_met', false).lt('deadline_date', now.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: exceptionRequests } = useQuery({
    queryKey: ['deadline-exception-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deadline_exception_requests')
        .select(`
          *,
          provider:users(first_name, last_name),
          reviewed_by_user:users!deadline_exception_requests_reviewed_by_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const getDeadlineStatus = (deadline: any) => {
    const now = new Date();
    const deadlineDate = new Date(deadline.deadline_date);
    
    if (deadline.is_met) {
      return { status: 'met', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    } else if (deadlineDate < now) {
      return { status: 'overdue', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    } else {
      const hoursUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (hoursUntilDeadline <= 24) {
        return { status: 'urgent', color: 'bg-orange-100 text-orange-800', icon: AlertTriangle };
      } else {
        return { status: 'pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      }
    }
  };

  const getReminderStatus = (deadline: any) => {
    const reminders = [];
    if (deadline.reminder_sent_24h) reminders.push('24h');
    if (deadline.reminder_sent_48h) reminders.push('48h');
    if (deadline.reminder_sent_72h) reminders.push('72h');
    return reminders;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading compliance deadlines...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={(value: 'all' | 'pending' | 'met' | 'overdue') => setStatusFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Deadlines</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="met">Met</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="flex items-center space-x-2">
          <Bell className="h-4 w-4" />
          <span>Send Reminders</span>
        </Button>
      </div>

      {/* Deadlines List */}
      <div className="space-y-4">
        {deadlines?.map((deadline) => {
          const statusInfo = getDeadlineStatus(deadline);
          const StatusIcon = statusInfo.icon;
          const reminders = getReminderStatus(deadline);
          
          return (
            <Card key={deadline.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-lg">
                        {deadline.provider?.first_name} {deadline.provider?.last_name}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <StatusIcon className="h-4 w-4" />
                        <Badge className={statusInfo.color}>
                          {statusInfo.status}
                        </Badge>
                      </div>
                      <Badge variant="outline">
                        {deadline.deadline_type.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          <strong>Deadline:</strong> {new Date(deadline.deadline_date).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <strong>Pending Notes:</strong> {deadline.notes_pending}
                      </div>
                      <div>
                        <strong>Completed Notes:</strong> {deadline.notes_completed}
                      </div>
                      <div>
                        <strong>Created:</strong> {new Date(deadline.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {reminders.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600">
                          <strong>Reminders sent:</strong> {reminders.join(', ')} before deadline
                        </span>
                        {deadline.supervisor_notified && (
                          <Badge variant="outline" className="text-purple-600">
                            Supervisor Notified
                          </Badge>
                        )}
                      </div>
                    )}

                    {!deadline.is_met && statusInfo.status === 'overdue' && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 text-red-800">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="font-medium">Deadline Missed</span>
                        </div>
                        <p className="text-red-700 text-sm mt-1">
                          This deadline was missed on {new Date(deadline.deadline_date).toLocaleString()}. 
                          {deadline.notes_pending > 0 && ` ${deadline.notes_pending} notes remain unsigned.`}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Notes
                    </Button>
                    {!deadline.is_met && (
                      <Button size="sm" className="flex items-center space-x-1">
                        <Bell className="h-3 w-3" />
                        <span>Send Reminder</span>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Exception Requests Section */}
      {exceptionRequests && exceptionRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Deadline Extension Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exceptionRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">
                      {request.provider?.first_name} {request.provider?.last_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Extension until: {new Date(request.requested_extension_until).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Reason: {request.reason}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {request.status}
                    </Badge>
                    {request.status === 'pending' && (
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">Approve</Button>
                        <Button size="sm" variant="outline">Reject</Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {deadlines?.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No compliance deadlines found</h3>
          <p className="text-gray-600 mb-4">
            {statusFilter !== 'all'
              ? `No ${statusFilter} deadlines found.`
              : 'Compliance deadlines will appear here as they are created.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ComplianceDeadlines;
