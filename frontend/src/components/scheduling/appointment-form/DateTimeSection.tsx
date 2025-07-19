
import React, { useState } from 'react';
import { Label } from '@/components/shared/ui/label';
import { Input } from '@/components/shared/ui/input';
import { Button } from '@/components/shared/ui/button';
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date */}
        <div className="space-y-3">
          <Label htmlFor="date" className="flex items-center space-x-2 text-gray-700 font-semibold">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg text-white shadow-md">
              <Calendar className="h-4 w-4" />
            </div>
            <span>Date *</span>
          </Label>
          <div className="relative group">
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
              className={`bg-gradient-to-r from-white to-blue-50/50 border-2 border-blue-200/60 
                focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-100/50 
                transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md 
                hover:border-blue-300 rounded-xl text-gray-700 font-medium
                ${errors?.date ? 'border-red-400 focus:border-red-500 bg-red-50/30' : ''}
              `}
              aria-describedby={errors?.date ? 'date-error' : undefined}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-xl 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
          {errors?.date && (
            <div id="date-error" className="text-sm text-red-600 flex items-center space-x-2 animate-fade-in">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.date}</span>
            </div>
          )}
        </div>

        {/* Time */}
        <div className="space-y-3">
          <Label className="flex items-center space-x-2 text-gray-700 font-semibold">
            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg text-white shadow-md">
              <Clock className="h-4 w-4" />
            </div>
            <span>Time *</span>
          </Label>
          <div className="relative group">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTimeGrid(!showTimeGrid)}
              className={`w-full justify-between bg-gradient-to-r from-white to-purple-50/50 
                border-2 border-purple-200/60 hover:border-purple-400 hover:bg-purple-50/70 
                focus:border-purple-500 focus:bg-white focus:shadow-lg focus:shadow-purple-100/50 
                transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md 
                rounded-xl text-gray-700 font-medium h-12
                ${errors?.start_time ? 'border-red-400 focus:border-red-500 bg-red-50/30' : ''}
                ${showTimeGrid ? 'border-purple-500 shadow-lg shadow-purple-100/50 scale-[1.02]' : ''}
              `}
            >
              <span className={startTime ? 'text-gray-800' : 'text-gray-500'}>{displayTime}</span>
              <ChevronDown className={`h-4 w-4 opacity-60 transition-transform duration-300 ${
                showTimeGrid ? 'rotate-180 text-purple-600' : ''
              }`} />
            </Button>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            {showTimeGrid && (
              <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-purple-200 
                rounded-xl shadow-2xl shadow-purple-100/50 animate-scale-in backdrop-blur-sm">
                <TimePickerGrid
                  selectedTime={startTime}
                  onTimeSelect={handleTimeSelect}
                />
              </div>
            )}
          </div>
          {errors?.start_time && (
            <div className="text-sm text-red-600 flex items-center space-x-2 animate-fade-in">
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
