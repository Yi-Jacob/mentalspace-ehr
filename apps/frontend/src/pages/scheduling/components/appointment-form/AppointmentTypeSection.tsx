
import React from 'react';
import { Label } from '@/components/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Textarea } from '@/components/basic/textarea';
import { FileText, MessageSquare } from 'lucide-react';

interface AppointmentTypeSectionProps {
  appointment_type: string;
  notes: string;
  onAppointmentTypeChange: (value: string) => void;
  onNotesChange: (value: string) => void;
}

const AppointmentTypeSection: React.FC<AppointmentTypeSectionProps> = ({
  appointment_type,
  notes,
  onAppointmentTypeChange,
  onNotesChange
}) => {
  const appointmentTypes = [
    { value: 'initial_consultation', label: 'Initial Consultation' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'therapy_session', label: 'Therapy Session' },
    { value: 'group_therapy', label: 'Group Therapy' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'medication_management', label: 'Medication Management' },
    { value: 'crisis_intervention', label: 'Crisis Intervention' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="appointment_type" className="flex items-center space-x-2 text-gray-700 font-medium">
          <FileText className="h-4 w-4 text-blue-500" />
          <span>Appointment Type *</span>
        </Label>
        <Select value={appointment_type} onValueChange={onAppointmentTypeChange}>
          <SelectTrigger className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200">
            <SelectValue placeholder="Select appointment type" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {appointmentTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes" className="flex items-center space-x-2 text-gray-700 font-medium">
          <MessageSquare className="h-4 w-4 text-indigo-500" />
          <span>Notes</span>
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Additional notes or comments..."
          className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200 min-h-[80px]"
          rows={3}
        />
      </div>
    </div>
  );
};

export default AppointmentTypeSection;
