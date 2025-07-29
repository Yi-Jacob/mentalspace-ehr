
import React from 'react';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Plus, Search } from 'lucide-react';

interface ReferralManagementHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterChange: (value: string) => void;
  onAddReferralSource: () => void;
}

const ReferralManagementHeader = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  onAddReferralSource,
}: ReferralManagementHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search referral sources..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        
        <Select value={filterType} onValueChange={onFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Healthcare Provider">Healthcare Providers</SelectItem>
            <SelectItem value="Hospital">Hospitals</SelectItem>
            <SelectItem value="Community Health">Community Health</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button onClick={onAddReferralSource} className="flex items-center space-x-2">
        <Plus className="h-4 w-4" />
        <span>Add Referral Source</span>
      </Button>
    </div>
  );
};

export default ReferralManagementHeader;
