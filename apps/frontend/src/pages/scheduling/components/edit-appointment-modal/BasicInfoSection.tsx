
import React from 'react';
import { Label } from '@/components/basic/label';
import { Input } from '@/components/basic/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { FileText } from 'lucide-react';
import { AppointmentType } from '@/types/enums/scheduleEnum';
import { AppointmentTypeValue } from '@/types/scheduleType';

interface FormData {
  client_id: string;
  appointment_type: AppointmentTypeValue;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  status: string;
  location: string;
  room_number: string;
}

interface BasicInfoSectionProps {
  formData: FormData;
  onFormDataChange: (field: keyof FormData, value: string) => void;
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
            <SelectItem value={AppointmentType.INTAKE_SESSION}>Intake session</SelectItem>
            <SelectItem value={AppointmentType.FOLLOW_UP}>Follow-up</SelectItem>
            <SelectItem value={AppointmentType.THERAPY_SESSION}>Therapy Session</SelectItem>
            <SelectItem value={AppointmentType.GROUP_THERAPY}>Group Therapy</SelectItem>
            <SelectItem value={AppointmentType.ASSESSMENT}>Assessment</SelectItem>
            <SelectItem value={AppointmentType.MEDICATION_MANAGEMENT}>Medication Management</SelectItem>
            <SelectItem value={AppointmentType.CRISIS_INTERVENTION}>Crisis Intervention</SelectItem>
            <SelectItem value={AppointmentType.OTHER}>Other</SelectItem>
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
