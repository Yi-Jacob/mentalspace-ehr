
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';

interface DateTimeSectionProps {
  formData: {
    date: string;
    start_time: string;
    end_time: string;
  };
  onFormDataChange: (field: string, value: string) => void;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  formData,
  onFormDataChange
}) => {
  return (
    <>
      {/* Date */}
      <div>
        <Label htmlFor="date" className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
          <Clock className="h-4 w-4 text-green-500" />
          <span>Date</span>
        </Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => onFormDataChange('date', e.target.value)}
          className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
        />
      </div>

      {/* Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_time" className="text-gray-700 font-medium mb-2 block">Start Time</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) => onFormDataChange('start_time', e.target.value)}
            className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
          />
        </div>
        <div>
          <Label htmlFor="end_time" className="text-gray-700 font-medium mb-2 block">End Time</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) => onFormDataChange('end_time', e.target.value)}
            className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
          />
        </div>
      </div>
    </>
  );
};

export default DateTimeSection;
