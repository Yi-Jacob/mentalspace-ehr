
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import TimePickerGrid from './TimePickerGrid';

interface DateTimeSectionProps {
  date: Date;
  startTime: string;
  endTime: string;
  onDateChange: (date: Date) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  date,
  startTime,
  endTime,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange
}) => {
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const formatDisplayTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return format(time, 'h:mm a');
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, 'PPP')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => selectedDate && onDateChange(selectedDate)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Time</Label>
          <Popover open={showStartTimePicker} onOpenChange={setShowStartTimePicker}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <Clock className="mr-2 h-4 w-4" />
                {formatDisplayTime(startTime)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <TimePickerGrid
                selectedTime={startTime}
                onTimeSelect={(time) => {
                  onStartTimeChange(time);
                  setShowStartTimePicker(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>End Time</Label>
          <Popover open={showEndTimePicker} onOpenChange={setShowEndTimePicker}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <Clock className="mr-2 h-4 w-4" />
                {formatDisplayTime(endTime)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <TimePickerGrid
                selectedTime={endTime}
                onTimeSelect={(time) => {
                  onEndTimeChange(time);
                  setShowEndTimePicker(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
};

export default DateTimeSection;
