
import React from 'react';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Search, Filter } from 'lucide-react';
import { AppointmentType, AppointmentStatus } from '@/types/enums/scheduleEnum';
import { AppointmentTypeValue } from '@/types/scheduleType';

interface AppointmentFiltersProps {
  searchTerm: string;
  statusFilter: AppointmentStatus | 'all';
  typeFilter: AppointmentTypeValue | 'all';
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: AppointmentStatus | 'all') => void;
  onTypeFilterChange: (value: AppointmentTypeValue | 'all') => void;
  onClearFilters: () => void;
}

const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  searchTerm,
  statusFilter,
  typeFilter,
  onSearchChange,
  onStatusFilterChange,
  onTypeFilterChange,
  onClearFilters
}) => {
  return (
    
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="bg-white/70 backdrop-blur-sm border-gray-200 focus:border-blue-400 transition-all duration-200 hover:bg-white/90">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-0 shadow-2xl backdrop-blur-sm">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={AppointmentStatus.SCHEDULED}>Scheduled</SelectItem>
              <SelectItem value={AppointmentStatus.CONFIRMED}>Confirmed</SelectItem>
              <SelectItem value={AppointmentStatus.CHECKED_IN}>Checked In</SelectItem>
              <SelectItem value={AppointmentStatus.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={AppointmentStatus.COMPLETED}>Completed</SelectItem>
              <SelectItem value={AppointmentStatus.CANCELLED}>Cancelled</SelectItem>
              <SelectItem value={AppointmentStatus.NO_SHOW}>No Show</SelectItem>
              <SelectItem value={AppointmentStatus.RESCHEDULED}>Rescheduled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="bg-white/70 backdrop-blur-sm border-gray-200 focus:border-blue-400 transition-all duration-200 hover:bg-white/90">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-0 shadow-2xl backdrop-blur-sm">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={AppointmentType.INITIAL_CONSULTATION}>Initial Consultation</SelectItem>
              <SelectItem value={AppointmentType.FOLLOW_UP}>Follow-up</SelectItem>
              <SelectItem value={AppointmentType.THERAPY_SESSION}>Therapy Session</SelectItem>
              <SelectItem value={AppointmentType.GROUP_THERAPY}>Group Therapy</SelectItem>
              <SelectItem value={AppointmentType.ASSESSMENT}>Assessment</SelectItem>
              <SelectItem value={AppointmentType.MEDICATION_MANAGEMENT}>Medication Management</SelectItem>
              <SelectItem value={AppointmentType.CRISIS_INTERVENTION}>Crisis Intervention</SelectItem>
              <SelectItem value={AppointmentType.OTHER}>Other</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-gray-200 transition-all duration-200 hover:border-blue-300"
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
  );
};

export default AppointmentFilters;
