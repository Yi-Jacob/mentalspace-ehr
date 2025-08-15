
import React from 'react';
import { Label } from '@/components/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { FileText } from 'lucide-react';
import { getAppointmentTypeOptions } from '@/types/scheduleType';
import { AppointmentTypeValue } from '@/types/scheduleType';

interface AppointmentTypeSectionProps {
  appointmentType: AppointmentTypeValue;
  onAppointmentTypeChange: (type: AppointmentTypeValue) => void;
}

const AppointmentTypeSection: React.FC<AppointmentTypeSectionProps> = ({
  appointmentType,
  onAppointmentTypeChange
}) => {
  const appointmentTypes = getAppointmentTypeOptions();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="appointment_type" className="flex items-center space-x-2 text-gray-700 font-medium">
          <FileText className="h-4 w-4 text-blue-500" />
          <span>Appointment Type *</span>
        </Label>
        <Select value={appointmentType} onValueChange={onAppointmentTypeChange}>
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
    </div>
  );
};

export default AppointmentTypeSection;
