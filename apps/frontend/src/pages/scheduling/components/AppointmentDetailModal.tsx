
import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent } from '@/components/basic/dialog';
import { format } from 'date-fns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useConflictDetection } from './hooks/useConflictDetection';
import EditRecurringRuleModal from './edit-appointment-modal/EditRecurringRuleModal';
import { AppointmentTypeValue, getAppointmentTypeOptions, Appointment } from '@/types/scheduleType';
import { AppointmentType, AppointmentStatus } from '@/types/enums/scheduleEnum';
import { Button } from '@/components/basic/button';
import { Calendar, Settings, User, Save, Video, Edit, X, CheckCircle, XCircle, Clock, Play, FileText, Plus } from 'lucide-react';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { DateInput } from '@/components/basic/date-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Textarea } from '@/components/basic/textarea';
import { Checkbox } from '@/components/basic/checkbox';
import { Badge } from '@/components/basic/badge';
import { CPT_CODES_BY_TYPE, NOTE_TYPES } from '@/types/enums/notesEnum';
import { useToast } from '@/hooks/use-toast';
import { schedulingService } from '@/services/schedulingService';
import LoadingSpinner from '@/components/LoadingSpinner';


interface AppointmentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string | null;
  onAttendMeeting?: (meetLink: string) => void;
}

interface FormData {
  title: string;
  appointment_type: string;
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
  paymentMethod: string;
  isPaid: boolean;
  calculatedAmount: number;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  open,
  onOpenChange,
  appointmentId,
  onAttendMeeting
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    appointment_type: '',
    location: '',
    room_number: '',
    date: '',
    start_time: '',
    duration: 60,
    client_id: '',
    description: '',
    cptCode: '',
    noteId: null,
    isTelehealth: false,
    paymentMethod: '',
    isPaid: false,
    calculatedAmount: 0
  });

  const [showNoteTypeSelector, setShowNoteTypeSelector] = useState(false);
  const { toast } = useToast();

  // Fetch appointment data internally
  const { data: appointment, isLoading: isLoadingAppointment } = useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => schedulingService.getAppointment(appointmentId!),
    enabled: !!appointmentId && open,
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

  // Get appointment type options from enums
  const appointmentTypeOptions = getAppointmentTypeOptions();

  // Payment method options
  const paymentMethodOptions = [
    { value: 'insurance_in_network_electronic', label: 'Insurance - In Network - Electronic' },
    { value: 'insurance_in_network_paper', label: 'Insurance - In Network - Paper' },
    { value: 'insurance_in_network_external', label: 'Insurance - In Network - External' },
    { value: 'insurance_out_network_electronic', label: 'Insurance - Out of Network - Electronic' },
    { value: 'insurance_out_network_paper', label: 'Insurance - Out of Network - Paper' },
    { value: 'insurance_out_network_external', label: 'Insurance - Out of Network - External' },
    { value: 'direct_payment', label: 'Direct - Cash, Check, or Credit/Debit Card' }
  ];

  useEffect(() => {
    if (appointment) {
      const startTime = appointment.startTime;
      const duration = appointment.duration || 60;
      
      if (startTime) {
        const startDate = new Date(startTime);
        
        setFormData({
          title: appointment.title || '',
          appointment_type: appointment.appointmentType || '',
          location: appointment.location || '',
          room_number: appointment.roomNumber || '',
          date: format(startDate, 'yyyy-MM-dd'),
          start_time: format(startDate, 'HH:mm'),
          duration: duration,
          client_id: appointment.clientId || '',
          description: appointment.title || '',
          cptCode: appointment.cptCode || '',
          noteId: appointment.noteId || null,
          isTelehealth: appointment.isTelehealth || false,
          paymentMethod: appointment.paymentMethod || '',
          isPaid: appointment.isPaid || false,
          calculatedAmount: appointment.calculatedAmount || 0
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
    providerId: appointment?.providerId || '',
    clientId: appointment?.clientId || '',
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

  // Helper function to determine if session was held
  const hasSessionBeenHeld = (appointment: Appointment) => {
    return appointment.note !== null && appointment.note !== undefined;
  };

  // Helper function to get session status
  const getSessionStatus = (appointment: Appointment) => {
    const now = new Date();
    const appointmentDate = new Date(appointment.startTime || '');
    
    if (appointmentDate > now) {
      return 'upcoming';
    } else if (hasSessionBeenHeld(appointment)) {
      return 'completed';
    } else {
      return 'missed';
    }
  };

  // Helper function to get action button for current status
  const getActionButton = (currentStatus: string) => {
    switch (currentStatus) {
      case AppointmentStatus.SCHEDULED:
        return {
          label: 'Confirm',
          icon: <CheckCircle className="h-4 w-4" />,
          status: AppointmentStatus.CONFIRMED,
          variant: 'default' as const
        };
      case AppointmentStatus.CONFIRMED:
        return {
          label: 'Start Session',
          icon: <Play className="h-4 w-4" />,
          status: AppointmentStatus.IN_PROGRESS,
          variant: 'default' as const
        };
      case AppointmentStatus.IN_PROGRESS:
        return {
          label: 'Complete',
          icon: <CheckCircle className="h-4 w-4" />,
          status: AppointmentStatus.COMPLETED,
          variant: 'default' as const
        };
      case AppointmentStatus.CANCELLED:
      case AppointmentStatus.NO_SHOW:
        return {
          label: 'Activate Appointment',
          icon: <CheckCircle className="h-4 w-4" />,
          status: AppointmentStatus.SCHEDULED,
          variant: 'default' as const
        };
      default:
        return null;
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    if (!appointment) return;

    try {
      await schedulingService.updateAppointmentStatus(appointment.id, newStatus);
      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${newStatus.replace('_', ' ')}`,
      });
      
      // Refresh appointment data to show updated state
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    }
  };

  // Handle create note
  const handleCreateNote = async (noteType: string) => {
    if (!appointment) return;

    try {
      const noteTypeConfig = NOTE_TYPES.find(nt => nt.type === noteType);
      const title = `${noteTypeConfig?.title || noteType} - ${clientName}`;
      const content = `Note created for appointment on ${format(new Date(appointment.startTime || ''), 'MMM d, yyyy')}`;

      await schedulingService.createAndLinkNote(appointment.id, {
        noteType,
        title,
        content,
      });
      
      toast({
        title: "Note Created",
        description: `Created ${noteTypeConfig?.title || noteType} note and linked to appointment`,
      });
      
      setShowNoteTypeSelector(false);
      
      // Refresh appointment data to show updated state
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!appointment) return;

    try {
      const updateData: any = {
        title: formData.title,
        appointmentType: formData.appointment_type as any,
        location: formData.location,
        roomNumber: formData.room_number,
        startTime: startDateTime,
        duration: formData.duration,
        description: formData.description,
        cptCode: formData.cptCode,
        noteId: formData.noteId,
        isTelehealth: formData.isTelehealth,
        paymentMethod: formData.paymentMethod,
        isPaid: formData.isPaid,
        calculatedAmount: formData.calculatedAmount
      };

      // If recurring rule data was updated, include it in the request
      if (recurringRuleData && appointment.recurringRuleId) {
        updateData.recurringPattern = recurringRuleData.recurringPattern;
        updateData.recurringTimeSlots = recurringRuleData.recurringTimeSlots;
        updateData.isBusinessDayOnly = recurringRuleData.isBusinessDayOnly;
        updateData.recurringEndDate = recurringRuleData.recurringEndDate;
      }

      await schedulingService.updateAppointment(appointment.id, updateData);
      
      // Refresh appointment data to show updated state
      queryClient.invalidateQueries({ queryKey: ['appointment', appointmentId] });
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleRecurringRuleUpdated = (recurringData: any) => {
    // Store the recurring rule data - no API call yet
    setRecurringRuleData(recurringData);
  };

  const handleCancel = () => {
    // Reset form data to original appointment data
    if (appointment) {
      const startTime = appointment.startTime;
      const duration = appointment.duration || 60;
      
      if (startTime) {
        const startDate = new Date(startTime);
        
        setFormData({
          title: appointment.title || '',
          appointment_type: appointment.appointmentType || '',
          location: appointment.location || '',
          room_number: appointment.roomNumber || '',
          date: format(startDate, 'yyyy-MM-dd'),
          start_time: format(startDate, 'HH:mm'),
          duration: duration,
          client_id: appointment.clientId || '',
          description: appointment.title || '',
          cptCode: appointment.cptCode || '',
          noteId: appointment.noteId || null,
          isTelehealth: appointment.isTelehealth || false,
          paymentMethod: appointment.paymentMethod || '',
          isPaid: appointment.isPaid || false,
          calculatedAmount: appointment.calculatedAmount || 0
        });
      }
    }
  };

  // Helper function to render input field
  const renderField = (
    label: string,
    inputComponent: React.ReactNode
  ) => {
    return (
      <div>
        <Label>{label}</Label>
        {inputComponent}
      </div>
    );
  };

  const clientName = appointment?.clients
    ? `${appointment.clients.firstName} ${appointment.clients.lastName}`
    : 'Unknown Client';

  const isRecurringAppointment = appointment?.recurringRuleId && appointment?.recurringRule !== undefined;
  
  // Check if appointment is in a state that should not be editable
  const isCompletedOrCancelled = appointment?.status === 'COMPLETED' || appointment?.status === 'CANCELLED';
  const canEdit = !isCompletedOrCancelled;

  // Show loading state while fetching appointment data
  if (isLoadingAppointment) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50/30" hideCloseButton>
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner message="Loading appointment details..." />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show error state if appointment not found
  if (!appointment) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50/30" hideCloseButton>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointment Not Found</h3>
              <p className="text-gray-600">The requested appointment could not be loaded.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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
                  Edit Appointment
                </h2>
                <p className="text-sm text-gray-600">
                  Update appointment details and settings
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Attend Meeting Button */}
              {appointment?.isTelehealth && appointment?.googleMeetLink && onAttendMeeting && (
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
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Current Status Display */}
            {appointment && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Current Status</h3>
                      <p className="text-sm text-gray-600">Appointment status and workflow state</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      className={`px-3 py-1 text-sm font-medium ${
                        appointment.status === AppointmentStatus.SCHEDULED ? 'bg-blue-100 text-blue-800' :
                        appointment.status === AppointmentStatus.CONFIRMED ? 'bg-green-100 text-green-800' :
                        appointment.status === AppointmentStatus.IN_PROGRESS ? 'bg-purple-100 text-purple-800' :
                        appointment.status === AppointmentStatus.COMPLETED ? 'bg-gray-100 text-gray-800' :
                        appointment.status === AppointmentStatus.CANCELLED ? 'bg-red-100 text-red-800' :
                        appointment.status === AppointmentStatus.NO_SHOW ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {appointment.status?.replace('_', ' ') || 'Unknown'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Client Info Display */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <h3 className="font-medium text-blue-800">Client</h3>
                </div>
                {/* Session Status Indicator */}
                {appointment && (
                  <div className="flex items-center space-x-2">
                    {getSessionStatus(appointment) === 'completed' && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">Session Held</span>
                      </div>
                    )}
                    {getSessionStatus(appointment) === 'missed' && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span className="text-xs font-medium">No Session</span>
                      </div>
                    )}
                    {getSessionStatus(appointment) === 'upcoming' && (
                      <div className="flex items-center space-x-1 text-blue-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-xs font-medium">Upcoming</span>
                      </div>
                    )}
                  </div>
                )}
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
                    disabled={!canEdit}
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
                  {renderField(
                    'Title',
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleFormDataChange('title', e.target.value)}
                      placeholder="Enter appointment title"
                    />
                  )}

                  {renderField(
                    'Appointment Type',
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
                    'Description',
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
                    <Input
                      id="start_time"
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => handleFormDataChange('start_time', e.target.value)}
                    />
                  )}

                  {renderField(
                    'Duration',
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

                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-gray-500">End Time</Label>
                    <div className="text-base font-semibold text-gray-900">
                      {formData.date && formData.start_time ? 
                        format(new Date(`${formData.date}T${formData.start_time}`).getTime() + formData.duration * 60000, 'h:mm a') 
                        : 'Not set'}
                    </div>
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
                  {renderField(
                    'Location',
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleFormDataChange('location', e.target.value)}
                      placeholder="Enter location (e.g., Main Office, Virtual)"
                    />
                  )}

                  {renderField(
                    'Room Number',
                    <Input
                      id="room_number"
                      value={formData.room_number}
                      onChange={(e) => handleFormDataChange('room_number', e.target.value)}
                      placeholder="Enter room number"
                    />
                  )}

                  {/* Note Section */}
                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2 text-gray-700 font-medium">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span>Associated Note</span>
                    </Label>
                    {appointment?.note ? (
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                        <span className="text-sm font-medium">{appointment.note.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {appointment.note.noteType.replace('_', ' ')}
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">No note attached</div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNoteTypeSelector(true)}
                      disabled={appointment?.status !== AppointmentStatus.COMPLETED || appointment?.noteId !== null}
                      className="flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create Note</span>
                    </Button>
                  </div>

                  {/* Telehealth */}
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
                </div>
              </div>

              {/* Billing Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" />
                  <h3 className="text-lg font-semibold text-gray-800">Billing</h3>
                </div>
                
                <div className="space-y-4">
                  {renderField(
                    'Amount Asked from Patient',
                    <Input
                      id="calculatedAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.calculatedAmount}
                      onChange={(e) => handleFormDataChange('calculatedAmount', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      disabled={appointment?.status !== AppointmentStatus.COMPLETED}
                    />
                  )}

                  {renderField(
                    'Payment Method',
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value) => handleFormDataChange('paymentMethod', value)}
                      disabled={appointment?.status !== AppointmentStatus.COMPLETED}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <div className="space-y-2">
                    <Label className="flex items-center space-x-2 text-gray-700 font-medium">
                      <span>Payment Status</span>
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isPaid"
                        checked={formData.isPaid}
                        onCheckedChange={(checked) => handleFormDataChange('isPaid', checked as boolean)}
                        disabled={appointment?.status !== AppointmentStatus.COMPLETED}
                      />
                      <Label htmlFor="isPaid" className="text-sm text-gray-600">
                        Payment received
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {appointment && (
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full" />
                  <h3 className="text-lg font-semibold text-gray-800">Actions</h3>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {/* Cancel Button - only show if not already cancelled or no-show */}
                  {appointment.status !== AppointmentStatus.CANCELLED && appointment.status !== AppointmentStatus.NO_SHOW && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleStatusChange(AppointmentStatus.CANCELLED)}
                      className="flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </Button>
                  )}

                  {/* No Show Button - only show if not already cancelled or no-show */}
                  {appointment.status !== AppointmentStatus.CANCELLED && appointment.status !== AppointmentStatus.NO_SHOW && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleStatusChange(AppointmentStatus.NO_SHOW)}
                      className="flex items-center space-x-2"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>No Show</span>
                    </Button>
                  )}

                  {/* Sequence Action Button */}
                  {getActionButton(appointment.status || '') && (
                    <Button
                      type="button"
                      onClick={() => handleStatusChange(getActionButton(appointment.status || '')!.status)}
                      className="flex items-center space-x-2"
                    >
                      {getActionButton(appointment.status || '')!.icon}
                      <span>{getActionButton(appointment.status || '')!.label}</span>
                    </Button>
                  )}
                </div>
              </div>
            )}

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
                className="bg-blue-600 hover:bg-blue-700"
              >
                <div className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </div>
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
          existingRule={appointment?.recurringRule}
        />
      )}

      {/* Note Type Selector Modal */}
      <Dialog open={showNoteTypeSelector} onOpenChange={setShowNoteTypeSelector}>
        <DialogContent className="max-w-md">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Create Note</h3>
              <p className="text-sm text-gray-600">Select the type of note to create and link to this appointment</p>
            </div>
            
            <div className="space-y-2">
              {NOTE_TYPES.map((noteType) => (
                <Button
                  key={noteType.type}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={() => handleCreateNote(noteType.type)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full ${noteType.color} flex items-center justify-center`}>
                      <noteType.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{noteType.title}</div>
                      <div className="text-xs text-gray-500">{noteType.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowNoteTypeSelector(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentDetailModal;
