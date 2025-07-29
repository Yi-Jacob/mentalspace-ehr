
import React from 'react';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';

interface AppointmentAlertSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const AppointmentAlertSection: React.FC<AppointmentAlertSectionProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="appointment_alert">Appointment Alert</Label>
      <Textarea
        id="appointment_alert"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter appointment alert notes..."
        rows={2}
      />
    </div>
  );
};

export default AppointmentAlertSection;
