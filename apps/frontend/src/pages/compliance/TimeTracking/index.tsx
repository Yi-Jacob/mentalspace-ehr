import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Card, CardContent } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/basic/dialog';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Clock, Play, Pause, Plus, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { complianceService } from '@/services/complianceService';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { USER_ROLES } from '@/types/enums/staffEnum';

const TimeTracking: React.FC = () => {
  const { user } = useAuth();
  const [showTimeEntryModal, setShowTimeEntryModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedTimeEntry, setSelectedTimeEntry] = useState<any>(null);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7); // One week ago
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setHours(23, 59, 59, 999); // One week ago
    return date.toISOString().split('T')[0];
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // TODO: Get current user ID from auth context
  const currentUserId = user?.id;

  const { data: timeEntries, isLoading } = useQuery({
    queryKey: ['time-entries', startDate, endDate],
    queryFn: async () => {
      return complianceService.getAll(startDate, endDate);
    },
  });

  const { data: activeTimeEntry } = useQuery({
    queryKey: ['active-time-entry', currentUserId],
    queryFn: async () => {
      return complianceService.getActiveTimeEntry(currentUserId);
    },
    refetchInterval: 30000, // Refetch every 30 seconds to keep status updated
  });

  const createTimeEntryMutation = useMutation({
    mutationFn: async (entryData: any) => {
      return complianceService.create(entryData);
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
      return complianceService.clockIn(currentUserId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      queryClient.invalidateQueries({ queryKey: ['active-time-entry'] });
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
      return complianceService.clockOut(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      queryClient.invalidateQueries({ queryKey: ['active-time-entry'] });
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

  const approveTimeEntryMutation = useMutation({
    mutationFn: async (entryId: string) => {
      return complianceService.approveTimeEntry(entryId, user?.id || '');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      toast({
        title: 'Success',
        description: 'Time entry approved successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve time entry',
        variant: 'destructive',
      });
    },
  });

  const askForUpdateMutation = useMutation({
    mutationFn: async ({ entryId, updateNotes }: { entryId: string; updateNotes?: string }) => {
      return complianceService.askForUpdateTimeEntry(entryId, user?.id || '', updateNotes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      setShowRejectModal(false);
      setSelectedTimeEntry(null);
      toast({
        title: 'Success',
        description: 'Update request sent successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send update request',
        variant: 'destructive',
      });
    },
  });

  const deleteTimeEntryMutation = useMutation({
    mutationFn: async (entryId: string) => {
      return complianceService.delete(entryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      toast({
        title: 'Success',
        description: 'Time entry deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete time entry',
        variant: 'destructive',
      });
    },
  });

  const handleSaveTimeEntry = (formData: FormData) => {
    const entryDate = formData.get('entry_date') as string;
    const clockInTime = formData.get('clock_in_time') as string;
    const clockOutTime = formData.get('clock_out_time') as string;
    const breakStartTime = formData.get('break_start_time') as string;
    const breakEndTime = formData.get('break_end_time') as string;

    // Validation: Clock out time must be after clock in time
    if (clockInTime && clockOutTime && clockInTime >= clockOutTime) {
      toast({
        title: 'Validation Error',
        description: 'Clock out time must be after clock in time',
        variant: 'destructive',
      });
      return;
    }

    // Validation: Break end time must be after break start time
    if (breakStartTime && breakEndTime && breakStartTime >= breakEndTime) {
      toast({
        title: 'Validation Error',
        description: 'Break end time must be after break start time',
        variant: 'destructive',
      });
      return;
    }

    // Combine date with time for clock in/out and break times
    const entryData = {
      userId: currentUserId,
      entryDate: entryDate,
      clockInTime: clockInTime ? `${entryDate}T${clockInTime}` : undefined,
      clockOutTime: clockOutTime ? `${entryDate}T${clockOutTime}` : undefined,
      breakStartTime: breakStartTime ? `${entryDate}T${breakStartTime}` : undefined,
      breakEndTime: breakEndTime ? `${entryDate}T${breakEndTime}` : undefined,
      notes: formData.get('notes') || null,
    };

    createTimeEntryMutation.mutate(entryData);
  };

  const handleApprove = (entryId: string) => {
    approveTimeEntryMutation.mutate(entryId);
  };

  const handleAskForUpdate = (entry: any) => {
    setSelectedTimeEntry(entry);
    setShowRejectModal(true);
  };

  const handleAskForUpdateSubmit = (formData: FormData) => {
    const updateNotes = formData.get('update_notes') as string;
    if (selectedTimeEntry) {
      askForUpdateMutation.mutate({
        entryId: selectedTimeEntry.id,
        updateNotes: updateNotes || undefined,
      });
    }
  };

  const handleDelete = (entryId: string) => {
    if (window.confirm('Are you sure you want to delete this time entry? This action cannot be undone.')) {
      deleteTimeEntryMutation.mutate(entryId);
    }
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
    return (
      <PageLayout variant="gradient">
        <PageHeader
          icon={Clock}
          title="Time Tracking"
          description="Monitor provider time entries and work hours"
        />
        <div className="text-center py-8">Loading time entries...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Clock}
        title="Time Tracking"
        description="Monitor provider time entries and work hours"
      />

      <div className="space-y-6">
        {/* Status Indicator */}
        {activeTimeEntry && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-green-600 animate-pulse" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Currently Clocked In</h3>
                <p className="text-sm text-green-600">
                  Started at {formatTime(activeTimeEntry.clockInTime)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="start-date" className="text-sm font-medium">From:</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="end-date" className="text-sm font-medium">To:</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            {activeTimeEntry ? (
              <Button 
                onClick={() => clockOutMutation.mutate(activeTimeEntry.id)}
                disabled={clockOutMutation.isPending}
                variant="destructive"
                className="flex items-center space-x-2"
              >
                <Pause className="h-4 w-4" />
                <span>Clock Out</span>
              </Button>
            ) : (
              <Button 
                onClick={() => clockInMutation.mutate()}
                disabled={clockInMutation.isPending}
                className="flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Clock In</span>
              </Button>
            )}
            
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
                      id="entry_date"
                      name="entry_date"
                      type="date"
                      required
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clock_in_time">Clock In Time</Label>
                      <Input
                        id="clock_in_time"
                        name="clock_in_time"
                        type="time"
                        required
                        defaultValue="09:00"
                        onChange={(e) => {
                          const clockOutInput = document.getElementById('clock_out_time') as HTMLInputElement;
                          if (clockOutInput && e.target.value && clockOutInput.value && e.target.value >= clockOutInput.value) {
                            clockOutInput.setCustomValidity('Clock out time must be after clock in time');
                          } else if (clockOutInput) {
                            clockOutInput.setCustomValidity('');
                          }
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="clock_out_time">Clock Out Time</Label>
                      <Input
                        id="clock_out_time"
                        name="clock_out_time"
                        type="time"
                        defaultValue="17:00"
                        onChange={(e) => {
                          const clockInInput = document.getElementById('clock_in_time') as HTMLInputElement;
                          if (clockInInput && e.target.value && clockInInput.value && clockInInput.value >= e.target.value) {
                            e.target.setCustomValidity('Clock out time must be after clock in time');
                          } else {
                            e.target.setCustomValidity('');
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="break_start_time">Break Start</Label>
                      <Input
                        id="break_start_time"
                        name="break_start_time"
                        type="time"
                        onChange={(e) => {
                          const breakEndInput = document.getElementById('break_end_time') as HTMLInputElement;
                          if (breakEndInput && e.target.value && breakEndInput.value && e.target.value >= breakEndInput.value) {
                            breakEndInput.setCustomValidity('Break end time must be after break start time');
                          } else if (breakEndInput) {
                            breakEndInput.setCustomValidity('');
                          }
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="break_end_time">Break End</Label>
                      <Input
                        id="break_end_time"
                        name="break_end_time"
                        type="time"
                        onChange={(e) => {
                          const breakStartInput = document.getElementById('break_start_time') as HTMLInputElement;
                          if (breakStartInput && e.target.value && breakStartInput.value && breakStartInput.value >= e.target.value) {
                            e.target.setCustomValidity('Break end time must be after break start time');
                          } else {
                            e.target.setCustomValidity('');
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
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
            const totalHours = entry.totalHours || calculateHours(entry.clockInTime, entry.clockOutTime);
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
                          ) : entry.notes && entry.notes.includes('[Admin Request for Update') ? (
                            <>
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                              <Badge className="bg-orange-100 text-orange-800">
                                Update Requested
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

                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm text-gray-600">
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
                          <strong>Total Hours:</strong> {totalHours?.toFixed(2)}
                        </div>
                        {entry.regularHours !== undefined && (
                          <div>
                            <strong>Regular Hours:</strong> {entry.regularHours?.toFixed(2)}
                          </div>
                        )}
                        {entry.eveningHours !== undefined && entry.eveningHours > 0 && (
                          <div>
                            <strong>Evening Hours:</strong> {entry.eveningHours?.toFixed(2)}
                          </div>
                        )}
                        {entry.weekendHours !== undefined && entry.weekendHours > 0 && (
                          <div>
                            <strong>Weekend Hours:</strong> {entry.weekendHours?.toFixed(2)}
                          </div>
                        )}
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
                          <div className="text-gray-700 text-sm whitespace-pre-wrap">
                            {entry.notes.split('\n').map((line, index) => {
                              // Check if this line is an admin request
                              if (line.includes('[Admin Request for Update')) {
                                return (
                                  <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-2 my-2 rounded">
                                    <p className="text-yellow-800 font-medium text-xs mb-1">Admin Request for Update</p>
                                    <p className="text-yellow-700 text-sm">{line}</p>
                                  </div>
                                );
                              }
                              return <p key={index}>{line}</p>;
                            })}
                          </div>
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
                      {user?.roles?.includes(USER_ROLES.PRACTICE_ADMINISTRATOR) && !entry.isApproved && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApprove(entry.id)}
                            disabled={approveTimeEntryMutation.isPending}
                            className="flex items-center space-x-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            <span>Approve</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAskForUpdate(entry)}
                            disabled={askForUpdateMutation.isPending}
                            className="flex items-center space-x-1"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            <span>Ask for Update</span>
                          </Button>
                        </>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(entry.id)}
                        disabled={deleteTimeEntryMutation.isPending}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-3 w-3" />
                        <span>Delete</span>
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
              No time entries for {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
            </p>
            {!activeTimeEntry ? (
              <Button onClick={() => clockInMutation.mutate()}>
                <Play className="h-4 w-4 mr-2" />
                Clock In
              </Button>
            ) : (
              <Button 
                onClick={() => clockOutMutation.mutate(activeTimeEntry.id)}
                variant="destructive"
              >
                <Pause className="h-4 w-4 mr-2" />
                Clock Out
              </Button>
            )}
          </div>
        )}

        {/* Ask for Update Modal */}
        <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ask for Update</DialogTitle>
            </DialogHeader>
            {selectedTimeEntry && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Employee:</strong> {selectedTimeEntry.user?.firstName} {selectedTimeEntry.user?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Date:</strong> {new Date(selectedTimeEntry.entryDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Time:</strong> {formatTime(selectedTimeEntry.clockInTime)} - {formatTime(selectedTimeEntry.clockOutTime)}
                  </p>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleAskForUpdateSubmit(new FormData(e.currentTarget));
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="update_notes">Update Request Notes</Label>
                    <Textarea
                      id="update_notes"
                      name="update_notes"
                      placeholder="Please provide specific feedback on what needs to be updated in this time entry..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowRejectModal(false);
                        setSelectedTimeEntry(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="default"
                      disabled={askForUpdateMutation.isPending}
                    >
                      {askForUpdateMutation.isPending ? 'Sending...' : 'Send Update Request'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default TimeTracking;
