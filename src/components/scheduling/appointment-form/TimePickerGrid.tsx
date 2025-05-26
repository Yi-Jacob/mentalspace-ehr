
import React from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface TimePickerGridProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const TimePickerGrid: React.FC<TimePickerGridProps> = ({
  selectedTime,
  onTimeSelect
}) => {
  // Generate time slots from 6:00 AM to 9:45 PM in 15-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = new Date();
        time.setHours(hour, minute, 0, 0);
        const timeString = format(time, 'HH:mm');
        const displayTime = format(time, 'h:mm a');
        slots.push({ value: timeString, display: displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
      {timeSlots.map((slot) => (
        <Button
          key={slot.value}
          variant={selectedTime === slot.value ? "default" : "outline"}
          size="sm"
          className="text-xs h-8"
          onClick={() => onTimeSelect(slot.value)}
        >
          {slot.display}
        </Button>
      ))}
    </div>
  );
};

export default TimePickerGrid;
