
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Switch } from '@/components/basic/switch';
import { Calendar } from '@/components/basic/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/basic/popover';
import { CalendarIcon, Save, X, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/utils/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { schedulingService, ScheduleException } from '@/services/schedulingService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface AddExceptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingException?: ScheduleException | null;
}

const AddExceptionModal: React.FC<AddExceptionModalProps> = ({ open, onOpenChange, editingException }) => {
  const [formData, setFormData] = useState({
    exception_date: new Date(),
    start_time: '',
    end_time: '',
    is_unavailable: false,
    reason: '',
    requires_approval: false
  });

  // Check if we're in edit mode
  const isEditMode = !!editingException;

  // Populate form when editing
  useEffect(() => {
    if (editingException) {
      setFormData({
        exception_date: new Date(editingException.exceptionDate),
        start_time: editingException.startTime || '',
        end_time: editingException.endTime || '',
        is_unavailable: editingException.isUnavailable || false,
        reason: editingException.reason || '',
        requires_approval: false
      });
    } else {
      resetForm();
    }
  }, [editingException]);

  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createExceptionMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user) throw new Error('User not authenticated');

      return await schedulingService.createScheduleException({
        exceptionDate: data.exception_date.toISOString().split('T')[0],
        startTime: data.is_unavailable ? undefined : data.start_time || undefined,
        endTime: data.is_unavailable ? undefined : data.end_time || undefined,
        isUnavailable: data.is_unavailable,
        reason: data.reason || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: "Exception Created",
        description: "The schedule exception has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['schedule-exceptions'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create exception. Please try again.",
        variant: "destructive",
      });
      console.error('Create exception error:', error);
    },
  });

  const updateExceptionMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!user || !editingException) throw new Error('User not authenticated or no exception to edit');

      return await schedulingService.updateScheduleException(editingException.id, {
        exceptionDate: data.exception_date.toISOString().split('T')[0],
        startTime: data.is_unavailable ? undefined : data.start_time || undefined,
        endTime: data.is_unavailable ? undefined : data.end_time || undefined,
        isUnavailable: data.is_unavailable,
        reason: data.reason || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: "Exception Updated",
        description: "The schedule exception has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['schedule-exceptions'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update exception. Please try again.",
        variant: "destructive",
      });
      console.error('Update exception error:', error);
    },
  });

  const resetForm = () => {
    setFormData({
      exception_date: new Date(),
      start_time: '',
      end_time: '',
      is_unavailable: false,
      reason: '',
      requires_approval: false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.exception_date) {
      toast({
        title: "Validation Error",
        description: "Please select a date for the exception.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.is_unavailable && (!formData.start_time || !formData.end_time)) {
      toast({
        title: "Validation Error",
        description: "Please specify start and end times for modified hours.",
        variant: "destructive",
      });
      return;
    }

    if (isEditMode) {
      updateExceptionMutation.mutate(formData);
    } else {
      createExceptionMutation.mutate(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <CalendarIcon className="h-5 w-5 text-pink-600" />
            <span>{isEditMode ? 'Edit Schedule Exception' : 'Add Schedule Exception'}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exception Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Exception Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.exception_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.exception_date ? format(formData.exception_date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.exception_date}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, exception_date: date }))}
                  initialFocus
                  className="pointer-events-auto"
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Unavailable Toggle */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_unavailable"
                checked={formData.is_unavailable}
                onCheckedChange={(checked) => setFormData(prev => ({ 
                  ...prev, 
                  is_unavailable: checked,
                  start_time: checked ? '' : prev.start_time,
                  end_time: checked ? '' : prev.end_time
                }))}
              />
              <Label htmlFor="is_unavailable" className="text-sm font-medium">
                Completely unavailable this day
              </Label>
            </div>

            {formData.is_unavailable && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">
                  You will be completely unavailable on this date
                </span>
              </div>
            )}
          </div>

          {/* Modified Hours (only if not unavailable) */}
          {!formData.is_unavailable && (
            <div className="space-y-4">
              <div className="text-sm font-medium text-gray-700">Modified Working Hours</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_time" className="text-sm font-medium">
                    Start Time *
                  </Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                    required={!formData.is_unavailable}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_time" className="text-sm font-medium">
                    End Time *
                  </Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                    required={!formData.is_unavailable}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason for Exception
            </Label>
            <Textarea
              id="reason"
              placeholder="e.g., Holiday, Personal leave, Training..."
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isEditMode ? updateExceptionMutation.isPending : createExceptionMutation.isPending}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isEditMode ? updateExceptionMutation.isPending : createExceptionMutation.isPending}
              className="bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700"
            >
              <Save className="h-4 w-4 mr-2" />
                             {isEditMode 
                 ? (updateExceptionMutation.isPending ? 'Updating...' : 'Update Exception')
                 : (createExceptionMutation.isPending ? 'Creating...' : 'Create Exception')
               }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExceptionModal;
