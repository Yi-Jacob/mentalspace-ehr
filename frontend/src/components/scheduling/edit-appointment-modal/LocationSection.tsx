
import React from 'react';
import { Label } from '@/components/shared/ui/label';
import { Input } from '@/components/shared/ui/input';
import { MapPin } from 'lucide-react';

interface LocationSectionProps {
  formData: {
    location: string;
    room_number: string;
  };
  onFormDataChange: (field: string, value: string) => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  formData,
  onFormDataChange
}) => {
  return (
    <>
      {/* Location */}
      <div>
        <Label htmlFor="location" className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
          <MapPin className="h-4 w-4 text-purple-500" />
          <span>Location</span>
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onFormDataChange('location', e.target.value)}
          className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
          placeholder="Room or location"
        />
      </div>

      {/* Room Number */}
      <div>
        <Label htmlFor="room_number" className="text-gray-700 font-medium mb-2 block">Room Number</Label>
        <Input
          id="room_number"
          value={formData.room_number}
          onChange={(e) => onFormDataChange('room_number', e.target.value)}
          className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
          placeholder="Room number"
        />
      </div>
    </>
  );
};

export default LocationSection;
