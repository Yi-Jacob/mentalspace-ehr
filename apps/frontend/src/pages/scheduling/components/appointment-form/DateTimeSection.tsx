
import React, { useState } from 'react';
import { Label } from '@/components/basic/label';
import { Button } from '@/components/basic/button';
import { Calendar, Clock, AlertCircle, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { DateInput } from '@/components/basic/date-input';
import TimePickerGrid from './TimePickerGrid';

interface DateTimeSectionProps {
  date: Date;
  startTime: string;
  onDateChange: (date: Date) => void;
  onStartTimeChange: (time: string) => void;
  errors?: {
    date?: string;
    start_time?: string;
  };
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  date,
  startTime,
  onDateChange,
  onStartTimeChange,
  errors
}) => {
  const [showTimeGrid, setShowTimeGrid] = useState(false);
  const today = new Date();
  
  // Convert Date to string format for DateInput (YYYY-MM-DD)
  const dateString = format(date, 'yyyy-MM-dd');

  const handleDateChange = (dateString: string) => {
    if (dateString) {
      const newDate = new Date(dateString);
      if (!isNaN(newDate.getTime())) {
        onDateChange(newDate);
      }
    }
  };

  const handleTimeSelect = (time: string) => {
    onStartTimeChange(time);
    setShowTimeGrid(false);
  };

  const displayTime = startTime ? format(new Date(`2000-01-01T${startTime}`), 'h:mm a') : 'Select time';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div className="space-y-3">
          <DateInput
            id="date"
            label="Date"
            value={dateString}
            onChange={handleDateChange}
            required={true}
            placeholder="MM/DD/YYYY"
          />
          {errors?.date && (
            <div id="date-error" className="text-sm text-red-600 flex items-center space-x-2 animate-fade-in">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.date}</span>
            </div>
          )}
        </div>

        {/* Time */}
        <div className="space-y-3">
          <Label htmlFor="time" className="flex items-center space-x-2">
            Start Time *
          </Label>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTimeGrid(!showTimeGrid)}
              className={`w-full justify-between h-10 px-3 py-2 text-small rounded-md border border-input bg-background 
                ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                ${errors?.start_time ? 'border-red-500 focus-visible:ring-red-500' : ''}
                ${showTimeGrid ? 'ring-2 ring-ring ring-offset-2' : ''}
              `}
            >
              <span>{displayTime}</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                showTimeGrid ? 'rotate-180' : ''}
              `} />
            </Button>
            {showTimeGrid && (
              <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-background border border-input
                rounded-md shadow-lg">
                <TimePickerGrid
                  selectedTime={startTime}
                  onTimeSelect={handleTimeSelect}
                />
              </div>
            )}
          </div>
          {errors?.start_time && (
            <div className="text-sm text-red-600 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.start_time}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimeSection;
