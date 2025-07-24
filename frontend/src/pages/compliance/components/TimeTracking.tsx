import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Play, Pause, Plus, CheckCircle, AlertTriangle } from 'lucide-react';
import { timeTrackingApi } from '@/services/complianceService';
import { useToast } from '@/hooks/use-toast';

const TimeTracking: React.FC = () => {
  const [showTimeEntryModal, setShowTimeEntryModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: timeEntries, isLoading } = useQuery({
    queryKey: ['time-entries', selectedDate],
    queryFn: async () => {
      return timeTrackingApi.getAll(selectedDate);
    },
  });

  const createTimeEntryMutation = useMutation({
    mutationFn: async (entryData: any) => {
      return timeTrackingApi.create(entryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      setShowTimeEntryModal(false);
      toast({
        title: 'Success',
        description: 'Time entry created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create time entry',
        variant: 'destructive',
      });
    },
  });

  const clockInMutation = useMutation({
    mutationFn: async () => {
      // TODO: Get current user ID from auth context
      const userId = 'current-user-id'; // This should come from auth context
      return timeTrackingApi.clockIn(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      toast({
        title: 'Success',
        description: 'Clocked in successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to clock in',
        variant: 'destructive',
      });
    },
  });

  const clockOutMutation = useMutation({
    mutationFn: async (entryId: string) => {
      return timeTrackingApi.clockOut(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      toast({
        title: 'Success',
        description: 'Clocked out successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to clock out',
        variant: 'destructive',
      });
    },
  });

  const handleSaveTimeEntry = (formData: FormData) => {
    const entryData = {
      userId: 'current-user-id', // TODO: Get from auth context
      entryDate: formData.get('entry_date'),
      clockInTime: formData.get('clock_in_time'),
      clockOutTime: formData.get('clock_out_time'),
      breakStartTime: formData.get('break_start_time') || null,
      breakEndTime: formData.get('break_end_time') || null,
      notes: formData.get('notes') || null,
    };

    createTimeEntryMutation.mutate(entryData);
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'Not set';
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateHours = (clockIn: string | null, clockOut: string | null) => {
    if (!clockIn || !clockOut) return 0;
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    return Math.round(((end.getTime() - start.getTime()) / (1000 * 60 * 60)) * 100) / 100;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading time entries...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-48"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={() => clockInMutation.mutate()}
            disabled={clockInMutation.isPending}
            className="flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Clock In</span>
          </Button>
          
          <Dialog open={showTimeEntryModal} onOpenChange={setShowTimeEntryModal}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Manual Entry</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manual Time Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSaveTimeEntry(new FormData(e.currentTarget));
              }} className="space-y-4">
                <div>
                  <Label htmlFor="entry_date">Entry Date</Label>
                  <Input
                    name="entry_date"
                    type="date"
                    required
                    defaultValue={selectedDate}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clock_in_time">Clock In Time</Label>
                    <Input
                      name="clock_in_time"
                      type="datetime-local"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="clock_out_time">Clock Out Time</Label>
                    <Input
                      name="clock_out_time"
                      type="datetime-local"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="break_start_time">Break Start</Label>
                    <Input
                      name="break_start_time"
                      type="datetime-local"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="break_end_time">Break End</Label>
                    <Input
                      name="break_end_time"
                      type="datetime-local"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    name="notes"
                    placeholder="Any additional notes..."
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowTimeEntryModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createTimeEntryMutation.isPending}>
                    {createTimeEntryMutation.isPending ? 'Saving...' : 'Save Entry'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Time Entries List */}
      <div className="space-y-4">
        {timeEntries?.map((entry) => {
          const totalHours = calculateHours(entry.clockInTime, entry.clockOutTime);
          const isActiveEntry = entry.clockInTime && !entry.clockOutTime;
          
          return (
            <Card key={entry.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-lg">
                        {entry.user?.firstName} {entry.user?.lastName}
                      </h4>
                      <div className="flex items-center space-x-1">
                        {isActiveEntry ? (
                          <>
                            <Clock className="h-4 w-4 text-green-600 animate-pulse" />
                            <Badge className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          </>
                        ) : entry.isApproved ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <Badge className="bg-blue-100 text-blue-800">
                              Approved
                            </Badge>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Pending Approval
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Date:</strong> {new Date(entry.entryDate).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Clock In:</strong> {formatTime(entry.clockInTime)}
                      </div>
                      <div>
                        <strong>Clock Out:</strong> {formatTime(entry.clockOutTime)}
                      </div>
                      <div>
                        <strong>Total Hours:</strong> {totalHours.toFixed(2)}
                      </div>
                    </div>

                    {(entry.breakStartTime || entry.breakEndTime) && (
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <strong>Break Start:</strong> {formatTime(entry.breakStartTime)}
                        </div>
                        <div>
                          <strong>Break End:</strong> {formatTime(entry.breakEndTime)}
                        </div>
                      </div>
                    )}

                    {entry.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-700 text-sm">{entry.notes}</p>
                      </div>
                    )}

                    {entry.isApproved && entry.approvedByUser && (
                      <div className="text-sm text-gray-600">
                        <strong>Approved by:</strong> {entry.approvedByUser.firstName} {entry.approvedByUser.lastName}
                        {entry.approvedAt && (
                          <span> on {new Date(entry.approvedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {isActiveEntry && (
                      <Button
                        onClick={() => clockOutMutation.mutate(entry.id)}
                        disabled={clockOutMutation.isPending}
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <Pause className="h-3 w-3" />
                        <span>Clock Out</span>
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {timeEntries?.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No time entries found</h3>
          <p className="text-gray-600 mb-4">
            No time entries for {new Date(selectedDate).toLocaleDateString()}
          </p>
          <Button onClick={() => clockInMutation.mutate()}>
            <Play className="h-4 w-4 mr-2" />
            Clock In
          </Button>
        </div>
      )}
    </div>
  );
};

export default TimeTracking;
