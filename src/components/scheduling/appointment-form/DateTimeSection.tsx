
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, AlertCircle, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import TimePickerGrid from './TimePickerGrid';

interface DateTimeSectionProps {
  date: Date;
  startTime: string;
  endTime: string;
  onDateChange: (date: Date) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  errors?: {
    date?: string;
    start_time?: string;
    end_time?: string;
  };
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  date,
  startTime,
  endTime,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  errors
}) => {
  const [showTimeGrid, setShowTimeGrid] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');
  const dateValue = format(date, 'yyyy-MM-dd');

  const handleTimeSelect = (time: string) => {
    onStartTimeChange(time);
    setShowTimeGrid(false);
  };

  const displayTime = startTime ? format(new Date(`2000-01-01T${startTime}`), 'h:mm a') : 'Select time';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date" className="flex items-center space-x-2 text-gray-700 font-medium">
            <Calendar className="h-4 w-4 text-green-500" />
            <span>Date *</span>
          </Label>
          <Input
            id="date"
            type="date"
            value={dateValue}
            min={today}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              if (!isNaN(newDate.getTime())) {
                onDateChange(newDate);
              }
            }}
            className={`bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200 ${
              errors?.date ? 'border-red-400 focus:border-red-400' : ''
            }`}
            aria-describedby={errors?.date ? 'date-error' : undefined}
          />
          {errors?.date && (
            <div id="date-error" className="text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.date}</span>
            </div>
          )}
        </div>

        {/* Time */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2 text-gray-700 font-medium">
            <Clock className="h-4 w-4 text-purple-500" />
            <span>Time *</span>
          </Label>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTimeGrid(!showTimeGrid)}
              className={`w-full justify-between bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200 ${
                errors?.start_time ? 'border-red-400 focus:border-red-400' : ''
              }`}
            >
              {displayTime}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
            {showTimeGrid && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                <TimePickerGrid
                  selectedTime={startTime}
                  onTimeSelect={handleTimeSelect}
                />
              </div>
            )}
          </div>
          {errors?.start_time && (
            <div className="text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.start_time}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimeSection;
