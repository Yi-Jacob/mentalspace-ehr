import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Checkbox } from '@/components/basic/checkbox';
import { Calendar, Clock, Plus, X } from 'lucide-react';
import { schedulingService } from '@/services/schedulingService';
import { useToast } from '@/hooks/use-toast';

interface RecurringRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecurringRuleCreated: (ruleId: string) => void;
}

interface TimeSlot {
  id: string;
  time: string;
}

const RecurringRuleModal: React.FC<RecurringRuleModalProps> = ({
  open,
  onOpenChange,
  onRecurringRuleCreated
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    recurringPattern: 'weekly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isBusinessDayOnly: true,
    timeSlots: [{ id: '1', time: '09:00' }] as TimeSlot[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert time slots to the format expected by the backend
      const timeSlots = formData.timeSlots.map(slot => ({
        time: slot.time,
        dayOfWeek: formData.recurringPattern === 'weekly' ? new Date(formData.startDate).getDay() : undefined
      }));

      const recurringRule = await schedulingService.createRecurringRule({
        recurringPattern: formData.recurringPattern,
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        timeSlots,
        isBusinessDayOnly: formData.isBusinessDayOnly
      });

      toast({
        title: "Recurring rule created",
        description: "Your recurring rule has been created successfully.",
      });

      onRecurringRuleCreated(recurringRule.id);
    } catch (error) {
      console.error('Error creating recurring rule:', error);
      toast({
        title: "Error",
        description: "Failed to create recurring rule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      time: '09:00'
    };
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, newSlot]
    }));
  };

  const removeTimeSlot = (id: string) => {
    if (formData.timeSlots.length > 1) {
      setFormData(prev => ({
        ...prev,
        timeSlots: prev.timeSlots.filter(slot => slot.id !== id)
      }));
    }
  };

  const updateTimeSlot = (id: string, time: string) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map(slot => 
        slot.id === id ? { ...slot, time } : slot
      )
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span>Create Recurring Rule</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recurring Pattern */}
          <div className="space-y-2">
            <Label htmlFor="recurringPattern">Recurring Pattern</Label>
            <Select
              value={formData.recurringPattern}
              onValueChange={(value) => setFormData(prev => ({ ...prev, recurringPattern: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pattern" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                min={formData.startDate}
              />
            </div>
          </div>

          {/* Business Days Only */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isBusinessDayOnly"
              checked={formData.isBusinessDayOnly}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, isBusinessDayOnly: checked as boolean }))
              }
            />
            <Label htmlFor="isBusinessDayOnly">Business days only (Monday - Friday)</Label>
          </div>

          {/* Time Slots */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Time Slots</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTimeSlot}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Time</span>
              </Button>
            </div>

            <div className="space-y-3">
              {formData.timeSlots.map((slot) => (
                <div key={slot.id} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <Input
                      type="time"
                      value={slot.time}
                      onChange={(e) => updateTimeSlot(slot.id, e.target.value)}
                      required
                    />
                  </div>
                  {formData.timeSlots.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTimeSlot(slot.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? 'Creating...' : 'Create Rule'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecurringRuleModal;
