
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AppointmentTypeSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const AppointmentTypeSection: React.FC<AppointmentTypeSectionProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="appointment_type">Appointment Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
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
    </div>
  );
};

export default AppointmentTypeSection;
