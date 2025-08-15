import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Checkbox } from '@/components/basic/checkbox';
import { Calendar, Clock, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditRecurringRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecurringRuleUpdated: (recurringData: {
    recurringPattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    recurringTimeSlots: TimeSlot[];
    isBusinessDayOnly: boolean;
    recurringEndDate?: string;
  }) => void; // Changed to void - no async needed
  existingRule?: {
    recurringPattern: string;
    startDate: string;
    endDate?: string;
    timeSlots: any[];
    isBusinessDayOnly: boolean;
  };
  startTime: string;
}

interface TimeSlot {
  id: string;
  time: string;
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  month?: number; // 1-12
}

const EditRecurringRuleModal: React.FC<EditRecurringRuleModalProps> = ({
  open,
  onOpenChange,
  onRecurringRuleUpdated,
  existingRule,
  startTime
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    recurringPattern: 'daily' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate: startTime ? new Date(startTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: '',
    isBusinessDayOnly: true,
    timeSlots: [{ 
      id: '1', 
      time: '09:00',
      dayOfWeek: undefined,
      dayOfMonth: undefined,
      month: undefined
    }] as TimeSlot[]
  });

  // Initialize form with existing rule data
  useEffect(() => {
    if (existingRule) {
      setFormData({
        recurringPattern: existingRule.recurringPattern as 'daily' | 'weekly' | 'monthly' | 'yearly',
        startDate: startTime ? new Date(startTime).toISOString().split('T')[0] : new Date(existingRule.startDate).toISOString().split('T')[0],
        endDate: existingRule.endDate ? new Date(existingRule.endDate).toISOString().split('T')[0] : '',
        isBusinessDayOnly: existingRule.isBusinessDayOnly,
        timeSlots: existingRule.timeSlots.map((slot, index) => ({
          id: (index + 1).toString(),
          time: slot.time || '09:00',
          dayOfWeek: slot.dayOfWeek,
          dayOfMonth: slot.dayOfMonth,
          month: slot.month
        }))
      });
    }
  }, [existingRule]);

  // Get day names for weekly pattern
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Get month names for yearly pattern
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleSubmit = () => {
    // Convert time slots to the format expected by the backend
    const timeSlots = formData.timeSlots.map(slot => {
      const baseSlot: any = { time: slot.time };
      
      switch (formData.recurringPattern) {
        case 'weekly':
          baseSlot.dayOfWeek = slot.dayOfWeek ?? 0;
          break;
        case 'monthly':
          baseSlot.dayOfMonth = slot.dayOfMonth ?? 1;
          break;
        case 'yearly':
          baseSlot.month = slot.month ?? 1;
          baseSlot.dayOfMonth = slot.dayOfMonth ?? 1;
          break;
      }
      
      return baseSlot;
    });

    // Call the callback with the updated recurring data (no API call yet)
    onRecurringRuleUpdated({
      recurringPattern: formData.recurringPattern,
      recurringTimeSlots: timeSlots,
      isBusinessDayOnly: formData.isBusinessDayOnly,
      recurringEndDate: formData.endDate || undefined
    });

    // Close the modal - the parent will handle the actual update when form is submitted
    onOpenChange(false);
    
    // Show a toast to inform the user that the recurring rule has been updated in the form
    toast({
      title: "Recurring Rule Updated",
      description: "The recurring rule has been updated. Click 'Save Changes' to apply all changes.",
    });
  };

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      time: '09:00'
    };
    
    // Set default values based on pattern
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
                value={slot.dayOfMonth || 1}
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
            <div className="flex-1">
              <Select
                value={slot.month?.toString() || '1'}
                onValueChange={(value) => updateTimeSlot(slot.id, 'month', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((month, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
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
                value={slot.dayOfMonth || 1}
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

  const getTimeSlotLabel = (slot: TimeSlot) => {
    switch (formData.recurringPattern) {
      case 'daily':
        return `Daily at ${slot.time}`;
      case 'weekly':
        return `${dayNames[slot.dayOfWeek || 0]} at ${slot.time}`;
      case 'monthly':
        return `${slot.dayOfMonth || 1}${getOrdinalSuffix(slot.dayOfMonth || 1)} at ${slot.time}`;
      case 'yearly':
        return `${monthNames[(slot.month || 1) - 1]} ${slot.dayOfMonth || 1}${getOrdinalSuffix(slot.dayOfMonth || 1)} at ${slot.time}`;
      default:
        return slot.time;
    }
  };

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Edit Recurring Rule</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recurring Pattern Selection */}
          <div>
            <Label htmlFor="recurringPattern">Recurring Pattern</Label>
            <Select
              value={formData.recurringPattern}
              onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
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
                <SelectValue />
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                min={formData.startDate}
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty for 1 year from start date</p>
            </div>
          </div>

          {/* Business Day Only */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="businessDayOnly"
              checked={formData.isBusinessDayOnly}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, isBusinessDayOnly: checked as boolean }))
              }
            />
            <Label htmlFor="businessDayOnly">Business days only (Monday-Friday)</Label>
          </div>

          {/* Time Slots */}
          <div>
            <div className="flex items-center justify-between mb-4">
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
              {formData.timeSlots.map((slot, index) => (
                <div key={slot.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    {renderTimeSlotFields(slot)}
                  </div>
                  
                  {formData.timeSlots.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTimeSlot(slot.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium">Preview:</Label>
              <div className="mt-2 space-y-1">
                {formData.timeSlots.map((slot) => (
                  <div key={slot.id} className="text-sm text-gray-600">
                    • {getTimeSlotLabel(slot)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
                         <Button
               type="button"
               onClick={handleSubmit}
               className="bg-blue-600 hover:bg-blue-700"
             >
               Update Recurring Rule
             </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecurringRuleModal;
