
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const WorkScheduleManagement = () => {
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [showAddException, setShowAddException] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: schedules, isLoading: schedulesLoading } = useQuery({
    queryKey: ['provider-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('provider_schedules')
        .select('*')
        .order('day_of_week')
        .order('start_time');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: exceptions, isLoading: exceptionsLoading } = useQuery({
    queryKey: ['schedule-exceptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedule_exceptions')
        .select('*')
        .order('exception_date');
      
      if (error) throw error;
      return data;
    },
  });

  const dayMapping = {
    monday: 'Monday',
    tuesday: 'Tuesday', 
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Work Schedule Management</h2>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAddSchedule(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
          <Button variant="outline" onClick={() => setShowAddException(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Add Exception
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regular Schedules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Weekly Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {schedulesLoading ? (
              <div className="text-center py-4">Loading schedules...</div>
            ) : schedules?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No weekly schedule set</p>
                <p className="text-sm">Add your regular working hours</p>
              </div>
            ) : (
              <div className="space-y-4">
                {schedules?.map((schedule) => (
                  <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">
                        {dayMapping[schedule.day_of_week as keyof typeof dayMapping]}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(schedule.status)}>
                          {schedule.status.replace('_', ' ')}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>Working Hours:</span>
                        <span className="font-medium">
                          {schedule.start_time} - {schedule.end_time}
                        </span>
                      </div>
                      
                      {schedule.break_start_time && schedule.break_end_time && (
                        <div className="flex items-center justify-between">
                          <span>Break:</span>
                          <span className="font-medium">
                            {schedule.break_start_time} - {schedule.break_end_time}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span>Available:</span>
                        <span className={`inline-flex items-center ${schedule.is_available ? 'text-green-600' : 'text-red-600'}`}>
                          {schedule.is_available ? (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          {schedule.is_available ? 'Yes' : 'No'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Effective:</span>
                        <span>
                          {format(new Date(schedule.effective_from), 'MMM d, yyyy')}
                          {schedule.effective_until && ` - ${format(new Date(schedule.effective_until), 'MMM d, yyyy')}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule Exceptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Schedule Exceptions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {exceptionsLoading ? (
              <div className="text-center py-4">Loading exceptions...</div>
            ) : exceptions?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No schedule exceptions</p>
                <p className="text-sm">Add holidays, time off, or special hours</p>
              </div>
            ) : (
              <div className="space-y-4">
                {exceptions?.map((exception) => (
                  <div key={exception.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">
                        {format(new Date(exception.exception_date), 'MMM d, yyyy')}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={exception.is_unavailable ? 'destructive' : 'default'}>
                          {exception.is_unavailable ? 'Unavailable' : 'Modified Hours'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      {!exception.is_unavailable && exception.start_time && exception.end_time && (
                        <div className="flex items-center justify-between">
                          <span>Modified Hours:</span>
                          <span className="font-medium">
                            {exception.start_time} - {exception.end_time}
                          </span>
                        </div>
                      )}
                      
                      {exception.reason && (
                        <div className="flex items-center justify-between">
                          <span>Reason:</span>
                          <span className="font-medium">{exception.reason}</span>
                        </div>
                      )}
                      
                      {exception.approved_at && (
                        <div className="text-xs text-green-600">
                          Approved on {format(new Date(exception.approved_at), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {schedules?.filter(s => s.is_available).length || 0}
              </div>
              <div className="text-sm text-gray-600">Available Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {schedules?.filter(s => s.status === 'active').length || 0}
              </div>
              <div className="text-sm text-gray-600">Active Schedules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {exceptions?.filter(e => new Date(e.exception_date) >= new Date()).length || 0}
              </div>
              <div className="text-sm text-gray-600">Upcoming Exceptions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {schedules?.filter(s => s.status === 'pending_approval').length || 0}
              </div>
              <div className="text-sm text-gray-600">Pending Approval</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkScheduleManagement;
