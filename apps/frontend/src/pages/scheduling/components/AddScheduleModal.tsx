
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Switch } from '@/components/basic/switch';
import { Calendar } from '@/components/basic/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/basic/popover';
import { CalendarIcon, Clock, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { schedulingService } from '@/services/schedulingService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import PageTabs from '@/components/basic/PageTabs';

interface AddScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DayScheduleData {
  day_of_week: string;
  start_time: string;
  end_time: string;
  break_start_time: string;
  break_end_time: string;
  is_available: boolean;
  effective_from: Date;
  effective_until: Date;
}

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ open, onOpenChange }) => {
  const [activeTab, setActiveTab] = useState('monday');
  const [schedulesData, setSchedulesData] = useState<Record<string, DayScheduleData>>({
    monday: {
      day_of_week: 'monday',
      start_time: '09:00',
      end_time: '18:00',
      break_start_time: '12:00',
      break_end_time: '13:00',
      is_available: true,
      effective_from: new Date(),
      effective_until: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
    },
    tuesday: {
      day_of_week: 'tuesday',
      start_time: '09:00',
      end_time: '18:00',
      break_start_time: '12:00',
      break_end_time: '13:00',
      is_available: true,
      effective_from: new Date(),
      effective_until: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
    },
    wednesday: {
      day_of_week: 'wednesday',
      start_time: '09:00',
      end_time: '18:00',
      break_start_time: '12:00',
      break_end_time: '13:00',
      is_available: true,
      effective_from: new Date(),
      effective_until: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
    },
    thursday: {
      day_of_week: 'thursday',
      start_time: '09:00',
      end_time: '18:00',
      break_start_time: '12:00',
      break_end_time: '13:00',
      is_available: true,
      effective_from: new Date(),
      effective_until: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
    },
    friday: {
      day_of_week: 'friday',
      start_time: '09:00',
      end_time: '18:00',
      break_start_time: '12:00',
      break_end_time: '13:00',
      is_available: true,
      effective_from: new Date(),
      effective_until: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
    },
    saturday: {
      day_of_week: 'saturday',
      start_time: '00:00',
      end_time: '00:00',
      break_start_time: '00:00',
      break_end_time: '00:00',
      is_available: false,
      effective_from: new Date(),
      effective_until: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
    },
    sunday: {
      day_of_week: 'sunday',
      start_time: '00:00',
      end_time: '00:00',
      break_start_time: '00:00',
      break_end_time: '00:00',
      is_available: false,
      effective_from: new Date(),
      effective_until: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
    }
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();



  const createAllSchedulesMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const schedules = Object.values(schedulesData).map(schedule => ({
        dayOfWeek: schedule.day_of_week,
        startTime: schedule.start_time,
        endTime: schedule.end_time,
        breakStartTime: schedule.break_start_time || null,
        breakEndTime: schedule.break_end_time || null,
        isAvailable: schedule.is_available,
        effectiveFrom: schedule.effective_from.toISOString().split('T')[0],
        effectiveUntil: schedule.effective_until?.toISOString().split('T')[0] || null,
        status: 'active', // Default status for all schedules
      }));

      return await schedulingService.createProviderSchedules(schedules);
    },
    onSuccess: () => {
      toast({
        title: "All Schedules Created",
        description: "All work schedules have been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['provider-schedules'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create some schedules. Please try again.",
        variant: "destructive",
      });
      console.error('Create all schedules error:', error);
    },
  });

  const resetForm = () => {
    setSchedulesData({
      monday: {
        day_of_week: 'monday',
        start_time: '09:00',
        end_time: '18:00',
        break_start_time: '12:00',
        break_end_time: '13:00',
        is_available: true,
        effective_from: new Date(),
        effective_until: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
      },
      tuesday: {
        day_of_week: 'tuesday',
        start_time: '09:00',
        end_time: '18:00',
        break_start_time: '12:00',
        break_end_time: '13:00',
        is_available: true,
        effective_from: new Date(),
        effective_until: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
      },
      wednesday: {
        day_of_week: 'wednesday',
        start_time: '09:00',
        end_time: '18:00',
        break_start_time: '12:00',
        break_end_time: '13:00',
        is_available: true,
        effective_from: new Date(),
        effective_until: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
      },
      thursday: {
        day_of_week: 'thursday',
        start_time: '09:00',
        end_time: '18:00',
        break_start_time: '12:00',
        break_end_time: '13:00',
        is_available: true,
        effective_from: new Date(),
        effective_until: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
      },
      friday: {
        day_of_week: 'friday',
        start_time: '09:00',
        end_time: '18:00',
        break_start_time: '12:00',
        break_end_time: '13:00',
        is_available: true,
        effective_from: new Date(),
        effective_until: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
      },
      saturday: {
        day_of_week: 'saturday',
        start_time: '00:00',
        end_time: '00:00',
        break_start_time: '00:00',
        break_end_time: '00:00',
        is_available: false,
        effective_from: new Date(),
        effective_until: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
      },
      sunday: {
        day_of_week: 'sunday',
        start_time: '00:00',
        end_time: '00:00',
        break_start_time: '00:00',
        break_end_time: '00:00',
        is_available: false,
        effective_from: new Date(),
        effective_until: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
      }
    });
  };

  const handleScheduleChange = (day: string, field: keyof DayScheduleData, value: any) => {
    setSchedulesData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleEffectiveDateChange = (field: 'effective_from' | 'effective_until', value: Date) => {
    setSchedulesData(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(day => {
        updated[day] = {
          ...updated[day],
          [field]: value
        };
      });
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one day has required fields
    const hasValidSchedule = Object.values(schedulesData).some(schedule => 
      schedule.start_time && schedule.end_time
    );

    if (!hasValidSchedule) {
      toast({
        title: "Validation Error",
        description: "Please fill in at least one day's schedule.",
        variant: "destructive",
      });
      return;
    }

    createAllSchedulesMutation.mutate();
  };

  const renderDayForm = (day: string, data: DayScheduleData) => (
    <div className="space-y-6">
      {/* Working Hours */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${day}_start_time`} className="text-sm font-medium">
            Start Time *
          </Label>
          <Input
            id={`${day}_start_time`}
            type="time"
            value={data.start_time}
            onChange={(e) => handleScheduleChange(day, 'start_time', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${day}_end_time`} className="text-sm font-medium">
            End Time *
          </Label>
          <Input
            id={`${day}_end_time`}
            type="time"
            value={data.end_time}
            onChange={(e) => handleScheduleChange(day, 'end_time', e.target.value)}
            required
          />
        </div>
      </div>

      {/* Break Times */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${day}_break_start_time`} className="text-sm font-medium">
            Break Start Time
          </Label>
          <Input
            id={`${day}_break_start_time`}
            type="time"
            value={data.break_start_time}
            onChange={(e) => handleScheduleChange(day, 'break_start_time', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${day}_break_end_time`} className="text-sm font-medium">
            Break End Time
          </Label>
          <Input
            id={`${day}_break_end_time`}
            type="time"
            value={data.break_end_time}
            onChange={(e) => handleScheduleChange(day, 'break_end_time', e.target.value)}
          />
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          id={`${day}_is_available`}
          checked={data.is_available}
          onCheckedChange={(checked) => handleScheduleChange(day, 'is_available', checked)}
        />
        <Label htmlFor={`${day}_is_available`} className="text-sm font-medium">
          Available for appointments
        </Label>
      </div>

      {/* Effective Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Effective From *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.effective_from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.effective_from ? format(data.effective_from, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                               <Calendar
                   mode="single"
                   selected={data.effective_from}
                   onSelect={(date) => date && handleEffectiveDateChange('effective_from', date)}
                   initialFocus
                   className="pointer-events-auto"
                 />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Effective Until</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.effective_until && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.effective_until ? format(data.effective_until, "PPP") : "No end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                               <Calendar
                   mode="single"
                   selected={data.effective_until}
                   onSelect={(date) => handleEffectiveDateChange('effective_until', date)}
                   initialFocus
                   className="pointer-events-auto"
                 />
            </PopoverContent>
          </Popover>
        </div>
      </div>


    </div>
  );



  const tabItems = [
    {
      id: 'monday',
      label: 'Monday',
      content: renderDayForm('monday', schedulesData.monday)
    },
    {
      id: 'tuesday',
      label: 'Tuesday',
      content: renderDayForm('tuesday', schedulesData.tuesday)
    },
    {
      id: 'wednesday',
      label: 'Wednesday',
      content: renderDayForm('wednesday', schedulesData.wednesday)
    },
    {
      id: 'thursday',
      label: 'Thursday',
      content: renderDayForm('thursday', schedulesData.thursday)
    },
    {
      id: 'friday',
      label: 'Friday',
      content: renderDayForm('friday', schedulesData.friday)
    },
    {
      id: 'saturday',
      label: 'Saturday',
      content: renderDayForm('saturday', schedulesData.saturday)
    },
    {
      id: 'sunday',
      label: 'Sunday',
      content: renderDayForm('sunday', schedulesData.sunday)
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Clock className="h-5 w-5 text-purple-600" />
            <span>Add Weekly Work Schedule</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info about synchronized dates */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Effective dates are synchronized across all days. Changing the effective from or until date for any day will apply to all 7 days.
            </p>
          </div>
          
          <PageTabs
            items={tabItems}
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createAllSchedulesMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAllSchedulesMutation.isPending}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {createAllSchedulesMutation.isPending ? 'Creating All Schedules...' : 'Create All Schedules'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddScheduleModal;
