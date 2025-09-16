
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/basic/dialog';
import { format } from 'date-fns';
import { useAppointmentMutations } from './hooks/useAppointmentMutations';
import { useConflictDetection } from './hooks/useConflictDetection';
import EditRecurringRuleModal from './edit-appointment-modal/EditRecurringRuleModal';
import { AppointmentTypeValue, AppointmentStatusValue, getAppointmentTypeOptions, getAppointmentStatusOptions } from '@/types/scheduleType';
import { Button } from '@/components/basic/button';
import { Calendar, Settings, User, Clock, MapPin, FileText, Save, X, Video } from 'lucide-react';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Textarea } from '@/components/basic/textarea';
import { Checkbox } from '@/components/basic/checkbox';
import NoteSelectionSection from './appointment-form/NoteSelectionSection';

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

interface EditAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
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

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  open,
  onOpenChange,
  appointment
}) => {
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
    ? new Date(`${formData.date}T${formData.start_time}`).toISOString()
    : '';
  const endDateTime = formData.date && formData.start_time 
    ? new Date(new Date(`${formData.date}T${formData.start_time}`).getTime() + formData.duration * 60000).toISOString()
    : '';

  const { data: conflictData } = useConflictDetection({
    appointmentId: appointment?.id,
    providerId: appointment?.providerId || appointment?.provider_id || '',
    clientId: appointment?.clientId || appointment?.client_id || '',
    startTime: startDateTime,
    endTime: endDateTime
  });

  const handleFormDataChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData({ ...formData, [field]: value });
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

  const clientName = appointment?.clients 
    ? `${appointment.clients.firstName} ${appointment.clients.lastName}`
    : appointment?.first_name && appointment?.last_name
    ? `${appointment.first_name} ${appointment.last_name}`
    : 'Unknown Client';

  const isRecurringAppointment = appointment?.recurringRuleId && appointment?.recurringRule;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50/30">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Edit Appointment</h2>
                <p className="text-sm text-gray-600">Update appointment details and settings</p>
              </div>
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
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEditRecurringModal(true)}
                    className="flex items-center space-x-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Edit Recurring Rule</span>
                  </Button>
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
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleFormDataChange('title', e.target.value)}
                      placeholder="Enter appointment title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="appointment_type">Appointment Type</Label>
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
                  </div>

                  <div>
                    <Label htmlFor="cptCode">CPT Code</Label>
                    <Input
                      id="cptCode"
                      value={formData.cptCode}
                      onChange={(e) => handleFormDataChange('cptCode', e.target.value)}
                      placeholder="Enter CPT code"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
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
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleFormDataChange('description', e.target.value)}
                      placeholder="Enter appointment description"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Date & Time Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full" />
                  <h3 className="text-lg font-semibold text-gray-800">Date & Time</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleFormDataChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <Label htmlFor="start_time">Start Time</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => handleFormDataChange('start_time', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
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
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-600">
                      <strong>End Time:</strong> {formData.date && formData.start_time ? 
                        format(new Date(`${formData.date}T${formData.start_time}`).getTime() + formData.duration * 60000, 'h:mm a') 
                        : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-red-600 rounded-full" />
                  <h3 className="text-lg font-semibold text-gray-800">Location</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleFormDataChange('location', e.target.value)}
                      placeholder="Enter location (e.g., Main Office, Virtual)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="room_number">Room Number</Label>
                    <Input
                      id="room_number"
                      value={formData.room_number}
                      onChange={(e) => handleFormDataChange('room_number', e.target.value)}
                      placeholder="Enter room number"
                    />
                  </div>

                  {/* Note Selection */}
                  <NoteSelectionSection
                    clientId={formData.client_id}
                    value={formData.noteId}
                    onChange={(value) => handleFormDataChange('noteId', value)}
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
                        checked={formData.isTelehealth}
                        onCheckedChange={(checked) => handleFormDataChange('isTelehealth', checked as boolean)}
                      />
                      <Label htmlFor="isTelehealth" className="text-sm text-gray-600">
                        This is a telehealth appointment
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
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

export default EditAppointmentModal;
