
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

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
  const today = format(new Date(), 'yyyy-MM-dd');
  const dateValue = format(date, 'yyyy-MM-dd');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* Start Time */}
        <div className="space-y-2">
          <Label htmlFor="start_time" className="flex items-center space-x-2 text-gray-700 font-medium">
            <Clock className="h-4 w-4 text-purple-500" />
            <span>Start Time *</span>
          </Label>
          <Input
            id="start_time"
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className={`bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200 ${
              errors?.start_time ? 'border-red-400 focus:border-red-400' : ''
            }`}
            aria-describedby={errors?.start_time ? 'start-time-error' : undefined}
          />
          {errors?.start_time && (
            <div id="start-time-error" className="text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.start_time}</span>
            </div>
          )}
        </div>

        {/* End Time */}
        <div className="space-y-2">
          <Label htmlFor="end_time" className="flex items-center space-x-2 text-gray-700 font-medium">
            <Clock className="h-4 w-4 text-orange-500" />
            <span>End Time *</span>
          </Label>
          <Input
            id="end_time"
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className={`bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200 ${
              errors?.end_time ? 'border-red-400 focus:border-red-400' : ''
            }`}
            aria-describedby={errors?.end_time ? 'end-time-error' : undefined}
          />
          {errors?.end_time && (
            <div id="end-time-error" className="text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.end_time}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimeSection;
