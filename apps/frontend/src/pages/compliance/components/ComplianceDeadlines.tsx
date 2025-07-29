
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/basic/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { AlertTriangle, Calendar, Bell, CheckCircle, Clock } from 'lucide-react';
import { complianceService } from '@/services/complianceService';

const ComplianceDeadlines: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'met' | 'overdue'>('all');

  const { data: deadlines, isLoading } = useQuery({
    queryKey: ['compliance-deadlines', statusFilter],
    queryFn: async () => {
      return complianceService.getAll(statusFilter);
    },
  });

  const { data: exceptionRequests } = useQuery({
    queryKey: ['deadline-exception-requests'],
    queryFn: async () => {
      // TODO: Implement deadline exceptions API
      return [];
    },
  });

  const getDeadlineStatus = (deadline: any) => {
    const now = new Date();
    const deadlineDate = new Date(deadline.deadlineDate);
    
    if (deadline.isMet) {
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
    if (deadline.reminderSent24h) reminders.push('24h');
    if (deadline.reminderSent48h) reminders.push('48h');
    if (deadline.reminderSent72h) reminders.push('72h');
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
                        {deadline.provider?.firstName} {deadline.provider?.lastName}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <StatusIcon className="h-4 w-4" />
                        <Badge className={statusInfo.color}>
                          {statusInfo.status}
                        </Badge>
                      </div>
                      <Badge variant="outline">
                        {deadline.deadlineType.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          <strong>Deadline:</strong> {new Date(deadline.deadlineDate).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <strong>Pending Notes:</strong> {deadline.notesPending}
                      </div>
                      <div>
                        <strong>Completed Notes:</strong> {deadline.notesCompleted}
                      </div>
                      <div>
                        <strong>Created:</strong> {new Date(deadline.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {reminders.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600">
                          <strong>Reminders sent:</strong> {reminders.join(', ')} before deadline
                        </span>
                        {deadline.supervisorNotified && (
                          <Badge variant="outline" className="text-purple-600">
                            Supervisor Notified
                          </Badge>
                        )}
                      </div>
                    )}

                    {!deadline.isMet && statusInfo.status === 'overdue' && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 text-red-800">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="font-medium">Deadline Missed</span>
                        </div>
                        <p className="text-red-700 text-sm mt-1">
                          This deadline was missed on {new Date(deadline.deadlineDate).toLocaleString()}. 
                          {deadline.notesPending > 0 && ` ${deadline.notesPending} notes remain unsigned.`}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Notes
                    </Button>
                    {!deadline.isMet && (
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
