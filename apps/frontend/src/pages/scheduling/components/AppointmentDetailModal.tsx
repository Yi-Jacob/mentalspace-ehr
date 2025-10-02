
import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent } from '@/components/basic/dialog';
import { format } from 'date-fns';
import { useAppointmentMutations } from './hooks/useAppointmentMutations';
import { useConflictDetection } from './hooks/useConflictDetection';
import EditRecurringRuleModal from './edit-appointment-modal/EditRecurringRuleModal';
import { AppointmentTypeValue, AppointmentStatusValue, getAppointmentTypeOptions, getAppointmentStatusOptions } from '@/types/scheduleType';
import { AppointmentType } from '@/types/enums/scheduleEnum';
import { Button } from '@/components/basic/button';
import { Calendar, Settings, User, Save, Video, Edit, X } from 'lucide-react';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { DateInput } from '@/components/basic/date-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Textarea } from '@/components/basic/textarea';
import { Checkbox } from '@/components/basic/checkbox';
import NoteSelectionSection from './appointment-form/NoteSelectionSection';
import { CPT_CODES_BY_TYPE } from '@/types/enums/notesEnum';

interface Appointment {
  id: string;
  title?: string;
  clientId?: string;
  providerId?: string;
  appointmentType?: AppointmentTypeValue;
  cptCode?: string;
  startTime?: string;
  duration?: number;
  status?: string;
  location?: string;
  roomNumber?: string;
  noteId?: string;
  isTelehealth?: boolean;
  googleMeetLink?: string;
  recurringRuleId?: string;
  clients?: {
    firstName: string;
    lastName: string;
  };
  note?: {
    id: string;
    title: string;
    noteType: string;
    status: string;
  };
  recurringRule?: {
    id: string;
    recurringPattern: string;
    startDate: string;
    endDate?: string;
    timeSlots: any[];
    isBusinessDayOnly: boolean;
  };
  // Fallback fields for backward compatibility
  client_id?: string;
  provider_id?: string;
  appointment_type?: AppointmentTypeValue;
  start_time?: string;
  end_time?: string;
  room_number?: string;
  first_name?: string;
  last_name?: string;
}

interface AppointmentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onAttendMeeting?: (meetLink: string) => void;
}

interface FormData {
  title: string;
  appointment_type: string;
  status: string;
  location: string;
  room_number: string;
  date: string;
  start_time: string;
  duration: number;
  client_id: string;
  description: string;
  cptCode: string;
  noteId: string;
  isTelehealth: boolean;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  open,
  onOpenChange,
  appointment,
  onAttendMeeting
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    appointment_type: '',
    status: '',
    location: '',
    room_number: '',
    date: '',
    start_time: '',
    duration: 60,
    client_id: '',
    description: '',
    cptCode: '',
    noteId: '',
    isTelehealth: false
  });

  const [showEditRecurringModal, setShowEditRecurringModal] = useState(false);
  const [recurringRuleData, setRecurringRuleData] = useState<{
    recurringPattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    recurringTimeSlots: Array<{
      time: string;
      dayOfWeek?: number;
      dayOfMonth?: number;
      month?: number;
    }>;
    isBusinessDayOnly: boolean;
    recurringEndDate?: string;
  } | null>(null);

  const { updateAppointment } = useAppointmentMutations();

  // Get appointment type and status options from enums
  const appointmentTypeOptions = getAppointmentTypeOptions();
  const appointmentStatusOptions = getAppointmentStatusOptions();

  useEffect(() => {
    if (appointment) {
      const startTime = appointment.startTime || appointment.start_time;
      const duration = appointment.duration || 60;
      
      if (startTime) {
        const startDate = new Date(startTime);
        
        setFormData({
          title: appointment.title || '',
          appointment_type: appointment.appointmentType || appointment.appointment_type || '',
          status: appointment.status || 'Scheduled',
          location: appointment.location || '',
          room_number: appointment.roomNumber || appointment.room_number || '',
          date: format(startDate, 'yyyy-MM-dd'),
          start_time: format(startDate, 'HH:mm'),
          duration: duration,
          client_id: appointment.clientId || appointment.client_id || '',
          description: appointment.title || '',
          cptCode: appointment.cptCode || '',
          noteId: appointment.noteId || '',
          isTelehealth: appointment.isTelehealth || false
        });
      }
    }
  }, [appointment]);

  const startDateTime = formData.date && formData.start_time 
    ? (() => {
        // Parse date and time as local to avoid timezone issues
        const dateParts = formData.date.split('-');
        const timeParts = formData.start_time.split(':');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // months are 0-indexed
        const day = parseInt(dateParts[2]);
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        return new Date(year, month, day, hours, minutes).toISOString();
      })()
    : '';
  const endDateTime = formData.date && formData.start_time 
    ? (() => {
        // Parse date and time as local to avoid timezone issues
        const dateParts = formData.date.split('-');
        const timeParts = formData.start_time.split(':');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // months are 0-indexed
        const day = parseInt(dateParts[2]);
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        const startDate = new Date(year, month, day, hours, minutes);
        return new Date(startDate.getTime() + formData.duration * 60000).toISOString();
      })()
    : '';

  const { data: conflictData } = useConflictDetection({
    appointmentId: appointment?.id,
    providerId: appointment?.providerId || appointment?.provider_id || '',
    clientId: appointment?.clientId || appointment?.client_id || '',
    startTime: startDateTime,
    endTime: endDateTime
  });

  // Map appointment types to CPT code categories (same logic as CreateAppointmentModal)
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

  // Get available CPT codes based on appointment type
  const availableCptCodes = useMemo(() => {
    const category = getCptCodeCategory(formData.appointment_type as AppointmentType);
    return CPT_CODES_BY_TYPE[category] || [];
  }, [formData.appointment_type]);

  const cptCodeOptions = useMemo(() => {
    return availableCptCodes.map(code => ({
      value: code.value,
      label: code.label
    }));
  }, [availableCptCodes]);

  const handleFormDataChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset CPT code when appointment type changes
      if (field === 'appointment_type') {
        newData.cptCode = '';
      }
      
      return newData;
    });
  };

  const handleSave = async () => {
    if (!appointment) return;

    try {
      const updateData: any = {
        id: appointment.id,
        title: formData.title,
        appointment_type: formData.appointment_type as any,
        status: formData.status as AppointmentStatusValue,
        location: formData.location,
        room_number: formData.room_number,
        start_time: startDateTime,
        duration: formData.duration,
        client_id: formData.client_id,
        description: formData.description,
        cptCode: formData.cptCode,
        noteId: formData.noteId,
        isTelehealth: formData.isTelehealth
      };

      // If recurring rule data was updated, include it in the request
      if (recurringRuleData && appointment.recurringRuleId) {
        updateData.recurringPattern = recurringRuleData.recurringPattern;
        updateData.recurringTimeSlots = recurringRuleData.recurringTimeSlots;
        updateData.isBusinessDayOnly = recurringRuleData.isBusinessDayOnly;
        updateData.recurringEndDate = recurringRuleData.recurringEndDate;
      }

      const result = await updateAppointment.mutateAsync(updateData);
      
      // Check if this was a recurring rule update
      if (result?.updatedRecurringRule) {
        // For recurring rule updates, the appointment was deleted and recreated
        // so we just close the modal - the toast will show the success message
        onOpenChange(false);
      } else {
        // For regular appointment updates, close the modal normally
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleRecurringRuleUpdated = (recurringData: any) => {
    // Store the recurring rule data - no API call yet
    setRecurringRuleData(recurringData);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset form data to original appointment data
    if (appointment) {
      const startTime = appointment.startTime || appointment.start_time;
      const duration = appointment.duration || 60;
      
      if (startTime) {
        const startDate = new Date(startTime);
        
        setFormData({
          title: appointment.title || '',
          appointment_type: appointment.appointmentType || appointment.appointment_type || '',
          status: appointment.status || 'Scheduled',
          location: appointment.location || '',
          room_number: appointment.roomNumber || appointment.room_number || '',
          date: format(startDate, 'yyyy-MM-dd'),
          start_time: format(startDate, 'HH:mm'),
          duration: duration,
          client_id: appointment.clientId || appointment.client_id || '',
          description: appointment.title || '',
          cptCode: appointment.cptCode || '',
          noteId: appointment.noteId || '',
          isTelehealth: appointment.isTelehealth || false
        });
      }
    }
  };

  // Helper function to render display value or input based on mode
  const renderField = (
    label: string,
    value: string,
    inputComponent: React.ReactNode,
    defaultValue: string = ''
  ) => {
    if (isEditMode) {
      return (
        <div>
          <Label>{label}</Label>
          {inputComponent}
        </div>
      );
    }
    
    return (
      <div className="space-y-1">
        <Label className="text-sm font-medium text-gray-500">{label}</Label>
        <div className="text-base font-semibold text-gray-900">
          {value || defaultValue || 'Not specified'}
        </div>
      </div>
    );
  };

  const clientName = appointment?.clients 
    ? `${appointment.clients.firstName} ${appointment.clients.lastName}`
    : appointment?.first_name && appointment?.last_name
    ? `${appointment.first_name} ${appointment.last_name}`
    : 'Unknown Client';

  const isRecurringAppointment = appointment?.recurringRuleId && appointment?.recurringRule;
  
  // Check if appointment is in a state that should not be editable
  const isCompletedOrCancelled = appointment?.status === 'COMPLETED' || appointment?.status === 'CANCELLED';
  const canEdit = !isCompletedOrCancelled;


  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50/30" hideCloseButton>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditMode ? 'Edit Appointment' : 'Appointment Details'}
                </h2>
                <p className="text-sm text-gray-600">
                  {isEditMode ? 'Update appointment details and settings' : 'View appointment information'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Attend Meeting Button */}
              {  appointment?.isTelehealth && appointment?.googleMeetLink && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onAttendMeeting(appointment.googleMeetLink)}
                  className="flex items-center space-x-2"
                >
                  <Video className="h-4 w-4" />
                  <span>Attend</span>
                </Button>
              )}
              
              {isEditMode ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel Edit</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                  disabled={!canEdit}
                  className="flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Client Info Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium text-blue-800">Client</h3>
              </div>
              <p className="text-blue-900 font-medium">{clientName}</p>
            </div>

            {/* Recurring Rule Info and Edit Button */}
            {isRecurringAppointment && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-800">Recurring Appointment</h4>
                  </div>
                  {isEditMode && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEditRecurringModal(true)}
                      className="flex items-center space-x-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                      disabled={!canEdit}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Edit Recurring Rule</span>
                    </Button>
                  )}
                </div>
                
                {appointment.recurringRule && (
                  <div className="text-sm text-purple-700 space-y-1">
                    <p><strong>Pattern:</strong> {appointment.recurringRule.recurringPattern}</p>
                    <p><strong>Start Date:</strong> {format(new Date(appointment.recurringRule.startDate), 'MMM d, yyyy')}</p>
                    {appointment.recurringRule.endDate && (
                      <p><strong>End Date:</strong> {format(new Date(appointment.recurringRule.endDate), 'MMM d, yyyy')}</p>
                    )}
                    <p><strong>Business Days Only:</strong> {appointment.recurringRule.isBusinessDayOnly ? 'Yes' : 'No'}</p>
                    <p><strong>Time Slots:</strong> {appointment.recurringRule.timeSlots.length}</p>
                  </div>
                )}
                
                {/* Show warning if recurring rule has been updated but not saved */}
                {recurringRuleData && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <p className="text-xs text-yellow-800 font-medium">
                        Recurring rule has been updated. Click "Save Changes" to apply all updates.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Conflict Warning */}
            {conflictData?.hasConflicts && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <h4 className="font-medium text-red-800">Schedule Conflict Detected</h4>
                </div>
                <p className="text-sm text-red-700">
                  This appointment time conflicts with existing appointments. Please review and adjust the schedule.
                </p>
              </div>
            )}

            {/* Form Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
                  <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                </div>
                
                <div className="space-y-4">
                  {renderField(
                    'Title',
                    formData.title || appointment?.title || '',
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleFormDataChange('title', e.target.value)}
                      placeholder="Enter appointment title"
                    />
                  )}

                  {renderField(
                    'Appointment Type',
                    appointmentTypeOptions.find(opt => opt.value === formData.appointment_type)?.label || '',
                    <Select
                      value={formData.appointment_type}
                      onValueChange={(value) => handleFormDataChange('appointment_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {appointmentTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {renderField(
                    'CPT Code',
                    cptCodeOptions.find(opt => opt.value === formData.cptCode)?.label || '',
                    <Select
                      value={formData.cptCode}
                      onValueChange={(value) => handleFormDataChange('cptCode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select CPT code" />
                      </SelectTrigger>
                      <SelectContent>
                        {cptCodeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {renderField(
                    'Status',
                    appointmentStatusOptions.find(opt => opt.value === formData.status)?.label || '',
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleFormDataChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {appointmentStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {renderField(
                    'Description',
                    formData.description || appointment?.title || '',
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleFormDataChange('description', e.target.value)}
                      placeholder="Enter appointment description"
                      rows={3}
                    />
                  )}
                </div>
              </div>

              {/* Date & Time Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full" />
                  <h3 className="text-lg font-semibold text-gray-800">Date & Time</h3>
                </div>
                
                <div className="space-y-4">
                  {renderField(
                    'Date',
                    formData.date ? format(new Date(formData.date), 'MMM d, yyyy') : '',
                    <DateInput
                      id="date"
                      label="Date"
                      value={formData.date}
                      onChange={(value) => handleFormDataChange('date', value)}
                      required
                    />
                  )}

                  {renderField(
                    'Start Time',
                    formData.start_time ? format(new Date(`2000-01-01T${formData.start_time}`), 'h:mm a') : '',
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => handleFormDataChange('start_time', e.target.value)}
                    />
                  )}

                  {renderField(
                    'Duration',
                    formData.duration === 60 ? '1 hour' : `${formData.duration} minutes`,
                    <Select
                      value={formData.duration.toString()}
                      onValueChange={(value) => handleFormDataChange('duration', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {!isEditMode && (
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-500">End Time</Label>
                      <div className="text-base font-semibold text-gray-900">
                        {formData.date && formData.start_time ? 
                          format(new Date(`${formData.date}T${formData.start_time}`).getTime() + formData.duration * 60000, 'h:mm a') 
                          : 'Not set'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
                  <h3 className="text-lg font-semibold text-gray-800">Location</h3>
                </div>
                
                <div className="space-y-4">
                  {renderField(
                    'Location',
                    formData.location || appointment?.location || '',
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleFormDataChange('location', e.target.value)}
                      placeholder="Enter location (e.g., Main Office, Virtual)"
                    />
                  )}

                  {renderField(
                    'Room Number',
                    formData.room_number || appointment?.roomNumber || appointment?.room_number || '',
                    <Input
                      id="room_number"
                      value={formData.room_number}
                      onChange={(e) => handleFormDataChange('room_number', e.target.value)}
                      placeholder="Enter room number"
                    />
                  )}

                  {/* Note Selection */}
                  {isEditMode ? (
                    <NoteSelectionSection
                      clientId={formData.client_id}
                      value={formData.noteId}
                      onChange={(value) => handleFormDataChange('noteId', value)}
                    />
                  ) : (
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-500">Associated Note</Label>
                      <div className="text-base font-semibold text-gray-900">
                        {appointment?.note?.title || 'No note attached'}
                      </div>
                    </div>
                  )}

                  {/* Telehealth */}
                  {isEditMode ? (
                    <div className="space-y-2">
                      <Label className="flex items-center space-x-2 text-gray-700 font-medium">
                        <Video className="h-4 w-4 text-blue-500" />
                        <span>Telehealth Appointment</span>
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isTelehealth"
                          checked={formData.isTelehealth}
                          onCheckedChange={(checked) => handleFormDataChange('isTelehealth', checked as boolean)}
                        />
                        <Label htmlFor="isTelehealth" className="text-sm text-gray-600">
                          This is a telehealth appointment
                        </Label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-gray-500 flex items-center space-x-2">
                        <Video className="h-4 w-4 text-blue-500" />
                        <span>Appointment Type</span>
                      </Label>
                      <div className="text-base font-semibold text-gray-900">
                        {formData.isTelehealth || appointment?.isTelehealth ? 'Telehealth Appointment' : 'In-Person Appointment'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditMode && (
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={updateAppointment.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {updateAppointment.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </div>
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Recurring Rule Modal */}
      {isRecurringAppointment && (
        <EditRecurringRuleModal
          open={showEditRecurringModal}
          onOpenChange={setShowEditRecurringModal}
          startTime={appointment?.startTime}
          onRecurringRuleUpdated={handleRecurringRuleUpdated}
          existingRule={appointment.recurringRule}
        />
      )}
    </>
  );
};

export default AppointmentDetailModal;
