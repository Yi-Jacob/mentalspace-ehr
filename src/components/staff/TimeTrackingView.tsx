
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Clock, Calendar } from 'lucide-react';
import { useTimeTracking } from '@/hooks/useTimeTracking';
import { format } from 'date-fns';

const TimeTrackingView: React.FC = () => {
  const { timeEntries, isLoading, startTimer, stopTimer, isStarting, isStopping } = useTimeTracking();
  const [newEntry, setNewEntry] = useState({
    activity_type: 'client_session',
    description: '',
    client_id: '',
  });

  const activeEntry = timeEntries?.find(entry => entry.status === 'active');

  const handleStartTimer = () => {
    startTimer.mutate({
      activity_type: newEntry.activity_type,
      description: newEntry.description,
      client_id: newEntry.client_id || undefined,
    });
  };

  const handleStopTimer = () => {
    if (activeEntry) {
      stopTimer.mutate({ id: activeEntry.id });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDuration = (hours?: number) => {
    if (!hours) return '0h 0m';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Timer */}
      {activeEntry && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <Clock className="h-5 w-5" />
              <span>Active Timer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{activeEntry.activity_type}</p>
                <p className="text-sm text-gray-600">{activeEntry.description}</p>
                <p className="text-xs text-gray-500">
                  Started: {format(new Date(activeEntry.start_time), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <Button 
                onClick={handleStopTimer} 
                disabled={isStopping}
                className="bg-red-600 hover:bg-red-700"
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop Timer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start New Timer */}
      {!activeEntry && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Start New Timer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="activity_type">Activity Type</Label>
                <Select 
                  value={newEntry.activity_type}
                  onValueChange={(value) => setNewEntry(prev => ({ ...prev, activity_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client_session">Client Session</SelectItem>
                    <SelectItem value="documentation">Documentation</SelectItem>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  value={newEntry.description}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description..."
                />
              </div>
            </div>
            <Button 
              onClick={handleStartTimer} 
              disabled={isStarting}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Timer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Time Entries History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Recent Time Entries</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeEntries?.slice(0, 10).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(entry.status)}>
                      {entry.status}
                    </Badge>
                    <span className="font-medium">{entry.activity_type}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(entry.start_time), 'MMM dd, yyyy HH:mm')}
                    {entry.end_time && ` - ${format(new Date(entry.end_time), 'HH:mm')}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatDuration(entry.total_hours)}</p>
                  {entry.is_billable && (
                    <Badge variant="outline" className="text-xs">Billable</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeTrackingView;
