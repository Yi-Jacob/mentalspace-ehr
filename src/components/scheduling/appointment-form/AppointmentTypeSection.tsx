
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AppointmentTypeSectionProps {
  appointment_type: string;
  title: string;
  notes: string;
  onAppointmentTypeChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

const AppointmentTypeSection: React.FC<AppointmentTypeSectionProps> = ({
  appointment_type,
  title,
  notes,
  onAppointmentTypeChange,
  onTitleChange,
  onNotesChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="appointment_type">Appointment Type</Label>
        <Select value={appointment_type} onValueChange={onAppointmentTypeChange}>
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

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter appointment title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Additional notes..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default AppointmentTypeSection;
