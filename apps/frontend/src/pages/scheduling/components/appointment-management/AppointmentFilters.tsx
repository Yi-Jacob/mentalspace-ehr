
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Search, Filter } from 'lucide-react';

type AppointmentStatus = 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
type AppointmentType = 'initial_consultation' | 'follow_up' | 'therapy_session' | 'group_therapy' | 'assessment' | 'medication_management' | 'crisis_intervention' | 'other';

interface AppointmentFiltersProps {
  searchTerm: string;
  statusFilter: AppointmentStatus | 'all';
  typeFilter: AppointmentType | 'all';
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: AppointmentStatus | 'all') => void;
  onTypeFilterChange: (value: AppointmentType | 'all') => void;
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
    <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-blue-50/50 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center space-x-2 text-xl">
          <Filter className="h-5 w-5" />
          <span>Filters & Search</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
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
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="checked_in">Checked In</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="bg-white/70 backdrop-blur-sm border-gray-200 focus:border-blue-400 transition-all duration-200 hover:bg-white/90">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-white border-0 shadow-2xl backdrop-blur-sm">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="initial_consultation">Initial Consultation</SelectItem>
              <SelectItem value="follow_up">Follow-up</SelectItem>
              <SelectItem value="therapy_session">Therapy Session</SelectItem>
              <SelectItem value="group_therapy">Group Therapy</SelectItem>
              <SelectItem value="assessment">Assessment</SelectItem>
              <SelectItem value="medication_management">Medication Management</SelectItem>
              <SelectItem value="crisis_intervention">Crisis Intervention</SelectItem>
              <SelectItem value="other">Other</SelectItem>
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
      </CardContent>
    </Card>
  );
};

export default AppointmentFilters;
