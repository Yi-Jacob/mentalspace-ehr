
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Users } from 'lucide-react';

interface WorkScheduleHeaderProps {
  onAddSchedule: () => void;
  onAddException: () => void;
}

const WorkScheduleHeader: React.FC<WorkScheduleHeaderProps> = ({
  onAddSchedule,
  onAddException,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl text-white shadow-lg">
          <Users className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Work Schedule Management
          </h2>
          <p className="text-gray-600 mt-1">Manage your working hours and availability</p>
        </div>
      </div>
      <div className="flex space-x-3">
        <Button 
          onClick={onAddSchedule}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Schedule
        </Button>
        <Button 
          variant="outline" 
          onClick={onAddException}
          className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border-purple-200 hover:border-purple-300 transition-all duration-200"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Add Exception
        </Button>
      </div>
    </div>
  );
};

export default WorkScheduleHeader;
