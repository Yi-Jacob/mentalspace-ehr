import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Checkbox } from '@/components/basic/checkbox';
import { Calendar, Clock, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecurringRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecurringRuleCreated: (recurringData: {
    recurringPattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    recurringTimeSlots: TimeSlot[];
    isBusinessDayOnly: boolean;
  }) => void;
}

interface TimeSlot {
  id: string;
  time: string;
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  month?: number; // 1-12
}

const RecurringRuleModal: React.FC<RecurringRuleModalProps> = ({
  open,
  onOpenChange,
  onRecurringRuleCreated
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    recurringPattern: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isBusinessDayOnly: true,
    timeSlots: [{ 
      id: '1', 
      time: '09:00',
      dayOfWeek: undefined, // Not needed for daily
      dayOfMonth: undefined, // Not needed for daily
      month: undefined // Not needed for daily
    }] as TimeSlot[]
  });

  // Get day names for weekly pattern
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Get month names for yearly pattern
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Convert time slots to the format expected by the backend
      const timeSlots = formData.timeSlots.map(slot => {
        const baseSlot: any = { time: slot.time };
        
        switch (formData.recurringPattern) {
          case 'weekly':
            baseSlot.dayOfWeek = slot.dayOfWeek ?? 0; // Default to Sunday if not set
            break;
          case 'monthly':
            baseSlot.dayOfMonth = slot.dayOfMonth ?? 1; // Default to 1st day if not set
            break;
          case 'yearly':
            baseSlot.month = slot.month ?? 1; // Default to January if not set
            baseSlot.dayOfMonth = slot.dayOfMonth ?? 1; // Default to 1st day if not set
            break;
        }
        
        return baseSlot;
      });

      // Call the callback with the recurring data instead of creating a rule
      onRecurringRuleCreated({
        recurringPattern: formData.recurringPattern as 'daily' | 'weekly' | 'monthly' | 'yearly',
        recurringTimeSlots: timeSlots,
        isBusinessDayOnly: formData.isBusinessDayOnly
      });

      toast({
        title: "Recurring pattern configured",
        description: "Your recurring pattern has been configured successfully.",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error configuring recurring pattern:', error);
      toast({
        title: "Error",
        description: "Failed to configure recurring pattern. Please try again.",
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
    
    // Set default values based on pattern - use simple defaults, not current date
    if (formData.recurringPattern === 'weekly') {
      newSlot.dayOfWeek = 0; // Sunday
    } else if (formData.recurringPattern === 'monthly') {
      newSlot.dayOfMonth = 1; // 1st day of month
    } else if (formData.recurringPattern === 'yearly') {
      newSlot.month = 1; // January
      newSlot.dayOfMonth = 1; // 1st day
    }
    
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

  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map(slot => 
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const renderTimeSlotFields = (slot: TimeSlot) => {
    switch (formData.recurringPattern) {
      case 'daily':
        return (
          <div className="flex-1">
            <Input
              type="time"
              value={slot.time}
              onChange={(e) => updateTimeSlot(slot.id, 'time', e.target.value)}
              required
            />
          </div>
        );
      
      case 'weekly':
        return (
          <>
            <div className="flex-1">
              <Select
                value={slot.dayOfWeek?.toString() || '0'}
                onValueChange={(value) => updateTimeSlot(slot.id, 'dayOfWeek', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dayNames.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input
                type="time"
                value={slot.time}
                onChange={(e) => updateTimeSlot(slot.id, 'time', e.target.value)}
                required
              />
            </div>
          </>
        );
      
      case 'monthly':
        return (
          <>
            <div className="w-20">
              <Input
                type="number"
                min="1"
                max="31"
                value={slot.dayOfMonth || ''}
                onChange={(e) => updateTimeSlot(slot.id, 'dayOfMonth', parseInt(e.target.value))}
                placeholder="Day"
                required
              />
            </div>
            <div className="flex-1">
              <Input
                type="time"
                value={slot.time}
                onChange={(e) => updateTimeSlot(slot.id, 'time', e.target.value)}
                required
              />
            </div>
          </>
        );
      
      case 'yearly':
        return (
          <>
            <div className="w-32">
              <Select
                value={slot.month?.toString() || '1'}
                onValueChange={(value) => updateTimeSlot(slot.id, 'month', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((month, index) => (
                    <SelectItem key={index} value={(index + 1).toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-20">
              <Input
                type="number"
                min="1"
                max="31"
                value={slot.dayOfMonth || ''}
                onChange={(e) => updateTimeSlot(slot.id, 'dayOfMonth', parseInt(e.target.value))}
                placeholder="Day"
                required
              />
            </div>
            <div className="flex-1">
              <Input
                type="time"
                value={slot.time}
                onChange={(e) => updateTimeSlot(slot.id, 'time', e.target.value)}
                required
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  const getTimeSlotLabel = () => {
    switch (formData.recurringPattern) {
      case 'daily':
        return 'Time';
      case 'weekly':
        return 'Day & Time';
      case 'monthly':
        return 'Day & Time';
      case 'yearly':
        return 'Month, Day & Time';
      default:
        return 'Time';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span>Configure Recurring Pattern</span>
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-6">
          {/* Recurring Pattern */}
          <div className="space-y-2">
            <Label htmlFor="recurringPattern">Recurring Pattern</Label>
            <Select
              value={formData.recurringPattern}
              onValueChange={(value) => {
                setFormData(prev => ({ 
                  ...prev, 
                  recurringPattern: value,
                  timeSlots: [{ 
                    id: '1', 
                    time: '09:00',
                    dayOfWeek: value === 'weekly' ? 0 : undefined,
                    dayOfMonth: value === 'monthly' || value === 'yearly' ? 1 : undefined,
                    month: value === 'yearly' ? 1 : undefined
                  }]
                }));
              }}
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
              <p className="text-xs text-gray-500">If not specified, will default to 1 year from start date</p>
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
              <Label>{getTimeSlotLabel()}</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTimeSlot}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add {formData.recurringPattern === 'daily' ? 'Time' : 'Slot'}</span>
              </Button>
            </div>

            <div className="space-y-3">
              {formData.timeSlots.map((slot) => (
                <div key={slot.id} className="flex items-center space-x-3">
                  {renderTimeSlotFields(slot)}
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
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? 'Configuring...' : 'Configure Pattern'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecurringRuleModal;
