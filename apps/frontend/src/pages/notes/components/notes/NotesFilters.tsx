
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Input } from '@/components/basic/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Search, Filter } from 'lucide-react';
import { Note } from '@/types/noteType';

type FilterNoteStatus = 'all' | Note['status'];
type FilterNoteType = 'all' | Note['noteType'];

interface NotesFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: FilterNoteStatus;
  setStatusFilter: (status: FilterNoteStatus) => void;
  typeFilter: FilterNoteType;
  setTypeFilter: (type: FilterNoteType) => void;
}

const NotesFilters: React.FC<NotesFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
}) => {
  const handleStatusChange = (value: string) => {
    setStatusFilter(value as FilterNoteStatus);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value as FilterNoteType);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notes or clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="locked">Locked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Note Type</label>
            <Select value={typeFilter} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="intake">Intake</SelectItem>
                <SelectItem value="progress_note">Progress Note</SelectItem>
                <SelectItem value="treatment_plan">Treatment Plan</SelectItem>
                <SelectItem value="cancellation_note">Cancellation Note</SelectItem>
                <SelectItem value="contact_note">Contact Note</SelectItem>
                <SelectItem value="consultation_note">Consultation Note</SelectItem>
                <SelectItem value="miscellaneous_note">Miscellaneous Note</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesFilters;
