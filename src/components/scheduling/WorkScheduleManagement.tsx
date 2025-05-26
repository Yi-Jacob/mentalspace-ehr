
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Plus, Edit, Trash2, CheckCircle, XCircle, Users, TrendingUp, Sparkles } from 'lucide-react';
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
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'pending_approval':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
      case 'approved':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      case 'rejected':
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-white to-purple-50/30 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white shadow-lg">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Work Schedule Management
            </h2>
            <p className="text-gray-600 mt-1">Manage your working hours and availability</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={() => setShowAddSchedule(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowAddException(true)}
            className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border-purple-200 hover:border-purple-300 transition-all duration-200"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Add Exception
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regular Schedules */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Clock className="h-5 w-5" />
              <span>Weekly Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {schedulesLoading ? (
              <div className="text-center py-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                  <div className="text-gray-600 font-medium">Loading schedules...</div>
                </div>
              </div>
            ) : schedules?.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">No weekly schedule set</h3>
                <p className="text-sm">Add your regular working hours to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {schedules?.map((schedule) => (
                  <div 
                    key={schedule.id} 
                    className="border-0 rounded-xl p-4 bg-gradient-to-r from-white to-purple-50/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 transform group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {dayMapping[schedule.day_of_week as keyof typeof dayMapping]}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStatusColor(schedule.status)} border font-medium px-3 py-1`}>
                          {schedule.status.replace('_', ' ')}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-purple-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="flex items-center justify-between p-2 bg-blue-50/50 rounded-lg">
                        <span className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span>Working Hours:</span>
                        </span>
                        <span className="font-semibold text-blue-700">
                          {schedule.start_time} - {schedule.end_time}
                        </span>
                      </div>
                      
                      {schedule.break_start_time && schedule.break_end_time && (
                        <div className="flex items-center justify-between p-2 bg-orange-50/50 rounded-lg">
                          <span className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            <span>Break:</span>
                          </span>
                          <span className="font-semibold text-orange-700">
                            {schedule.break_start_time} - {schedule.break_end_time}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between p-2 bg-green-50/50 rounded-lg">
                        <span className="flex items-center space-x-2">
                          <span>Available:</span>
                        </span>
                        <span className={`inline-flex items-center font-semibold ${schedule.is_available ? 'text-green-600' : 'text-red-600'}`}>
                          {schedule.is_available ? (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          {schedule.is_available ? 'Yes' : 'No'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400 p-2 bg-gray-50/50 rounded-lg">
                        <span>Effective:</span>
                        <span className="font-medium">
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
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-pink-50/30 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-xl">
              <Calendar className="h-5 w-5" />
              <span>Schedule Exceptions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {exceptionsLoading ? (
              <div className="text-center py-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
                  <div className="text-gray-600 font-medium">Loading exceptions...</div>
                </div>
              </div>
            ) : exceptions?.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold mb-2">No schedule exceptions</h3>
                <p className="text-sm">Add holidays, time off, or special hours</p>
              </div>
            ) : (
              <div className="space-y-4">
                {exceptions?.map((exception) => (
                  <div 
                    key={exception.id} 
                    className="border-0 rounded-xl p-4 bg-gradient-to-r from-white to-pink-50/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 transform group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {format(new Date(exception.exception_date), 'MMM d, yyyy')}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={`font-medium px-3 py-1 ${
                            exception.is_unavailable 
                              ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300' 
                              : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300'
                          }`}
                        >
                          {exception.is_unavailable ? 'Unavailable' : 'Modified Hours'}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-pink-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-2">
                      {!exception.is_unavailable && exception.start_time && exception.end_time && (
                        <div className="flex items-center justify-between p-2 bg-blue-50/50 rounded-lg">
                          <span className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span>Modified Hours:</span>
                          </span>
                          <span className="font-semibold text-blue-700">
                            {exception.start_time} - {exception.end_time}
                          </span>
                        </div>
                      )}
                      
                      {exception.reason && (
                        <div className="flex items-center justify-between p-2 bg-purple-50/50 rounded-lg">
                          <span className="flex items-center space-x-2">
                            <span>Reason:</span>
                          </span>
                          <span className="font-semibold text-purple-700">{exception.reason}</span>
                        </div>
                      )}
                      
                      {exception.approved_at && (
                        <div className="text-xs text-green-600 p-2 bg-green-50/50 rounded-lg font-medium">
                          ✓ Approved on {format(new Date(exception.approved_at), 'MMM d, yyyy')}
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
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-indigo-50/30 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <TrendingUp className="h-5 w-5" />
            <span>Schedule Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {schedules?.filter(s => s.is_available).length || 0}
              </div>
              <div className="text-sm text-blue-700 font-medium">Available Days</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {schedules?.filter(s => s.status === 'active').length || 0}
              </div>
              <div className="text-sm text-green-700 font-medium">Active Schedules</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {exceptions?.filter(e => new Date(e.exception_date) >= new Date()).length || 0}
              </div>
              <div className="text-sm text-yellow-700 font-medium">Upcoming Exceptions</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {schedules?.filter(s => s.status === 'pending_approval').length || 0}
              </div>
              <div className="text-sm text-orange-700 font-medium">Pending Approval</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkScheduleManagement;
