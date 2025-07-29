
import React from 'react';
import { Button } from '@/components/basic/button';
import { format } from 'date-fns';

interface TimePickerGridProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const TimePickerGrid: React.FC<TimePickerGridProps> = ({
  selectedTime,
  onTimeSelect
}) => {
  // Generate time slots from 6:00 AM to 8:00 PM in 15-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 20; hour++) {
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
    <div className="p-4">
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-gray-700 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Select Time
        </h4>
        <p className="text-xs text-gray-500 mt-1">Business hours: 6:00 AM - 8:00 PM</p>
      </div>
      <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-gray-100">
        {timeSlots.map((slot, index) => (
          <Button
            key={slot.value}
            variant={selectedTime === slot.value ? "default" : "outline"}
            size="sm"
            className={`text-xs h-9 font-medium transition-all duration-200 transform hover:scale-105 ${
              selectedTime === slot.value
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-200/50 border-0'
                : 'border-purple-200/60 hover:border-purple-400 hover:bg-purple-50/70 hover:text-purple-700 bg-white/80'
            } ${index % 4 === 0 ? 'animate-fade-in' : index % 4 === 1 ? 'animate-fade-in delay-75' : index % 4 === 2 ? 'animate-fade-in delay-150' : 'animate-fade-in delay-200'}`}
            onClick={() => onTimeSelect(slot.value)}
          >
            {slot.display}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TimePickerGrid;
