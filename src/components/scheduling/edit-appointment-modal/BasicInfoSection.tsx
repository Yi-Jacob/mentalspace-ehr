
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';

interface BasicInfoSectionProps {
  formData: {
    title: string;
    appointment_type: string;
    status: string;
  };
  onFormDataChange: (field: string, value: string) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  onFormDataChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Title */}
      <div className="md:col-span-2">
        <Label htmlFor="title" className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
          <FileText className="h-4 w-4 text-blue-500" />
          <span>Title</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onFormDataChange('title', e.target.value)}
          className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
          placeholder="Appointment title"
        />
      </div>

      {/* Appointment Type */}
      <div>
        <Label className="text-gray-700 font-medium mb-2 block">Appointment Type</Label>
        <Select value={formData.appointment_type} onValueChange={(value) => onFormDataChange('appointment_type', value)}>
          <SelectTrigger className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200">
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

      {/* Status */}
      <div>
        <Label className="text-gray-700 font-medium mb-2 block">Status</Label>
        <Select value={formData.status} onValueChange={(value) => onFormDataChange('status', value)}>
          <SelectTrigger className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="checked_in">Checked In</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no_show">No Show</SelectItem>
            <SelectItem value="rescheduled">Rescheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BasicInfoSection;
