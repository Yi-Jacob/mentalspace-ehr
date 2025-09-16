import React, { useMemo } from 'react';
import { Label } from '@/components/basic/label';
import { Input } from '@/components/basic/input';
import { TextareaField } from '@/components/basic/textarea';
import { SelectField } from '@/components/basic/select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Checkbox } from '@/components/basic/checkbox';
import { FileText, Clock, MapPin, Calendar, FileEdit, Video } from 'lucide-react';
import { getAppointmentTypeOptions } from '@/types/scheduleType';
import { AppointmentTypeValue } from '@/types/scheduleType';
import { AppointmentType } from '@/types/enums/scheduleEnum';
import { CPT_CODES_BY_TYPE } from '@/types/enums/notesEnum';
import NoteSelectionSection from './NoteSelectionSection';

interface AppointmentDetailsSectionProps {
  // Appointment Type
  appointmentType: AppointmentTypeValue;
  onAppointmentTypeChange: (type: AppointmentTypeValue) => void;
  
  // Duration
  durationValue: number;
  onDurationChange: (value: number) => void;
  
  // CPT Code
  cptCode: string;
  onCptCodeChange: (value: string) => void;
  cptCodeError?: string;
  
  // Title and Description
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  titleError?: string;
  descriptionError?: string;
  
  // Location
  location: string;
  roomNumber: string;
  onLocationChange: (location: string) => void;
  onRoomNumberChange: (roomNumber: string) => void;
  
  // Note Selection
  clientId: string;
  noteId: string;
  onNoteIdChange: (noteId: string) => void;
  
  // Telehealth
  isTelehealth: boolean;
  onTelehealthChange: (isTelehealth: boolean) => void;
}

const AppointmentDetailsSection: React.FC<AppointmentDetailsSectionProps> = ({
  appointmentType,
  onAppointmentTypeChange,
  durationValue,
  onDurationChange,
  cptCode,
  onCptCodeChange,
  cptCodeError,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  titleError,
  descriptionError,
  location,
  roomNumber,
  onLocationChange,
  onRoomNumberChange,
  clientId,
  noteId,
  onNoteIdChange,
  isTelehealth,
  onTelehealthChange
}) => {
  const appointmentTypes = getAppointmentTypeOptions();

  // Map appointment types to CPT code categories
  const getCptCodeCategory = (type: AppointmentType): string => {
    switch (type) {
      case AppointmentType.INTAKE_SESSION:
        return 'therapy intake';
      case AppointmentType.FOLLOW_UP:
      case AppointmentType.THERAPY_SESSION:
        return 'therapy session';
      case AppointmentType.GROUP_THERAPY:
        return 'group therapy';
      case AppointmentType.ASSESSMENT:
        return 'psychological evaluation';
      case AppointmentType.MEDICATION_MANAGEMENT:
        return 'consultation';
      case AppointmentType.CRISIS_INTERVENTION:
        return 'therapy session';
      case AppointmentType.OTHER:
        return 'consultation';
      default:
        return 'therapy session';
    }
  };

  const availableCptCodes = useMemo(() => {
    const category = getCptCodeCategory(appointmentType as AppointmentType);
    return CPT_CODES_BY_TYPE[category] || [];
  }, [appointmentType]);

  const selectOptions = useMemo(() => {
    return availableCptCodes.map(code => ({
      value: code.value,
      label: code.label
    }));
  }, [availableCptCodes]);

  const handleCptCodeChange = (value: string) => {
    console.log('CPT Code changed to:', value);
    onCptCodeChange(value);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/60 rounded-2xl p-6 border border-emerald-200/30 shadow-sm">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full" />
        <h3 className="text-lg font-semibold text-gray-800">Appointment Details</h3>
      </div>

      <div className="space-y-6">
        {/* Appointment Type */}
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

        {/* Duration and CPT Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center space-x-2 text-gray-700 font-medium">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Duration</span>
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="duration"
                type="number"
                value={durationValue}
                onChange={(e) => onDurationChange(parseInt(e.target.value) || 0)}
                className="flex-1 bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
                min="1"
                max="480"
                placeholder="60"
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">minutes</span>
            </div>
          </div>

          {/* CPT Code */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2 text-gray-700 font-medium">
              <FileEdit className="h-4 w-4 text-blue-500" />
              <span>CPT Code *</span>
            </Label>
            <SelectField
              label=""
              required={true}
              value={cptCode}
              onValueChange={handleCptCodeChange}
              placeholder="Select CPT Code"
              options={selectOptions}
              containerClassName="w-full"
            />
            {cptCodeError && (
              <p className="mt-1 text-sm text-red-600">{cptCodeError}</p>
            )}
            {availableCptCodes.length === 0 && (
              <p className="mt-1 text-sm text-gray-500">
                No CPT codes available for this appointment type.
              </p>
            )}
          </div>
        </div>

        {/* Title and Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center space-x-2 text-gray-700 font-medium">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>Title</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter appointment title"
              className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
            />
            {titleError && (
              <p className="mt-1 text-sm text-red-600">{titleError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center space-x-2 text-gray-700 font-medium">
              <FileText className="h-4 w-4 text-blue-500" />
              <span>Description</span>
            </Label>
            <TextareaField
              id="description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={3}
              placeholder="Enter appointment description"
            />
            {descriptionError && (
              <p className="mt-1 text-sm text-red-600">{descriptionError}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2 text-gray-700 font-medium">
            <MapPin className="h-4 w-4 text-blue-500" />
            <span>Location</span>
          </Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm text-gray-600">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
                placeholder="Enter location"
                className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room_number" className="text-sm text-gray-600">Room Number</Label>
              <Input
                id="room_number"
                value={roomNumber}
                onChange={(e) => onRoomNumberChange(e.target.value)}
                placeholder="Room #"
                className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Note Selection */}
        <NoteSelectionSection
          clientId={clientId}
          value={noteId}
          onChange={onNoteIdChange}
        />

        {/* Telehealth */}
        <div className="space-y-2">
          <Label className="flex items-center space-x-2 text-gray-700 font-medium">
            <Video className="h-4 w-4 text-blue-500" />
            <span>Appointment Type</span>
          </Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isTelehealth"
              checked={isTelehealth}
              onCheckedChange={(checked) => onTelehealthChange(checked as boolean)}
            />
            <Label htmlFor="isTelehealth" className="text-sm text-gray-600">
              This is a telehealth appointment
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsSection;
