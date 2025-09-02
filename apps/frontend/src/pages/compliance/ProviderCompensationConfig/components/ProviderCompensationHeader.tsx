import React from 'react';
import { Button } from '@/components/basic/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Plus } from 'lucide-react';

interface StaffProfileWithNames {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  employeeId?: string;
  jobTitle?: string;
  department?: string;
  npiNumber?: string;
  licenseNumber?: string;
  licenseState?: string;
  status?: string;
}

interface ProviderCompensationHeaderProps {
  isPracticeAdmin: boolean;
  selectedProvider: string;
  onProviderChange: (value: string) => void;
  staffProfiles?: StaffProfileWithNames[];
  onAddConfiguration: () => void;
}

const ProviderCompensationHeader: React.FC<ProviderCompensationHeaderProps> = ({
  isPracticeAdmin,
  selectedProvider,
  onProviderChange,
  staffProfiles,
  onAddConfiguration,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {isPracticeAdmin && (
          <Select value={selectedProvider} onValueChange={onProviderChange}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by provider..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {staffProfiles?.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.firstName} {profile.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {!isPracticeAdmin && (
          <div className="text-sm text-gray-600">
            Viewing your compensation configuration
          </div>
        )}
      </div>
      
      <Button 
        onClick={onAddConfiguration}
        className="flex items-center space-x-2"
      >
        <Plus className="h-4 w-4" />
        <span>Add Configuration</span>
      </Button>
    </div>
  );
};

export default ProviderCompensationHeader;
