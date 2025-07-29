
import React from 'react';
import { Label } from '@/components/basic/label';
import { Input } from '@/components/basic/input';

interface LocationSectionProps {
  location: string;
  roomNumber: string;
  onLocationChange: (location: string) => void;
  onRoomNumberChange: (roomNumber: string) => void;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  location,
  roomNumber,
  onLocationChange,
  onRoomNumberChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Location"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="room_number">Room Number</Label>
        <Input
          id="room_number"
          value={roomNumber}
          onChange={(e) => onRoomNumberChange(e.target.value)}
          placeholder="Room #"
        />
      </div>
    </div>
  );
};

export default LocationSection;
