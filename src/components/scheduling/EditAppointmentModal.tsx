
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, User, MapPin, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useAppointmentMutations } from './hooks/useAppointmentMutations';
import { useConflictDetection } from './hooks/useConflictDetection';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Appointment {
  id: string;
  title?: string;
  client_id: string;
  provider_id: string;
  appointment_type: string;
  start_time: string;
  end_time: string;
  status: string;
  location?: string;
  room_number?: string;
  notes?: string;
  clients?: {
    first_name: string;
    last_name: string;
  };
  users?: {
    first_name: string;
    last_name: string;
  };
}

interface EditAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  open,
  onOpenChange,
  appointment
}) => {
  const [formData, setFormData] = useState({
    title: '',
    appointment_type: '',
    status: '',
    location: '',
    room_number: '',
    notes: '',
    date: '',
    start_time: '',
    end_time: ''
  });

  const { updateAppointment } = useAppointmentMutations();

  useEffect(() => {
    if (appointment) {
      const startDate = new Date(appointment.start_time);
      const endDate = new Date(appointment.end_time);
      
      setFormData({
        title: appointment.title || '',
        appointment_type: appointment.appointment_type,
        status: appointment.status,
        location: appointment.location || '',
        room_number: appointment.room_number || '',
        notes: appointment.notes || '',
        date: format(startDate, 'yyyy-MM-dd'),
        start_time: format(startDate, 'HH:mm'),
        end_time: format(endDate, 'HH:mm')
      });
    }
  }, [appointment]);

  const startDateTime = formData.date && formData.start_time 
    ? new Date(`${formData.date}T${formData.start_time}`).toISOString()
    : '';
  const endDateTime = formData.date && formData.end_time 
    ? new Date(`${formData.date}T${formData.end_time}`).toISOString()
    : '';

  const { data: conflictData } = useConflictDetection({
    appointmentId: appointment?.id,
    providerId: appointment?.provider_id || '',
    clientId: appointment?.client_id || '',
    startTime: startDateTime,
    endTime: endDateTime
  });

  const handleSave = async () => {
    if (!appointment) return;

    try {
      await updateAppointment.mutateAsync({
        id: appointment.id,
        title: formData.title,
        appointment_type: formData.appointment_type as any,
        status: formData.status as any,
        location: formData.location,
        room_number: formData.room_number,
        notes: formData.notes,
        start_time: startDateTime,
        end_time: endDateTime
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const clientName = appointment?.clients 
    ? `${appointment.clients.first_name} ${appointment.clients.last_name}`
    : 'Unknown Client';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white to-blue-50/30">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Appointment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Info */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 text-blue-700">
              <User className="h-4 w-4" />
              <span className="font-semibold">Client: {clientName}</span>
            </div>
          </div>

          {/* Conflict Warning */}
          {conflictData?.hasConflicts && (
            <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Scheduling Conflict Detected:</strong>
                <ul className="mt-2 space-y-1">
                  {conflictData.conflicts.map((conflict, index) => (
                    <li key={index} className="text-sm">
                      • {conflict.message} ({format(new Date(conflict.start_time), 'HH:mm')} - {format(new Date(conflict.end_time), 'HH:mm')})
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

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
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
                placeholder="Appointment title"
              />
            </div>

            {/* Appointment Type */}
            <div>
              <Label className="text-gray-700 font-medium mb-2 block">Appointment Type</Label>
              <Select value={formData.appointment_type} onValueChange={(value) => setFormData({ ...formData, appointment_type: value })}>
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
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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

            {/* Date */}
            <div>
              <Label htmlFor="date" className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span>Date</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
              />
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_time" className="text-gray-700 font-medium mb-2 block">Start Time</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
                />
              </div>
              <div>
                <Label htmlFor="end_time" className="text-gray-700 font-medium mb-2 block">End Time</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="flex items-center space-x-2 text-gray-700 font-medium mb-2">
                <MapPin className="h-4 w-4 text-purple-500" />
                <span>Location</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
                placeholder="Room or location"
              />
            </div>

            {/* Room Number */}
            <div>
              <Label htmlFor="room_number" className="text-gray-700 font-medium mb-2 block">Room Number</Label>
              <Input
                id="room_number"
                value={formData.room_number}
                onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
                placeholder="Room number"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <Label htmlFor="notes" className="text-gray-700 font-medium mb-2 block">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200"
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateAppointment.isPending || conflictData?.hasConflicts}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              {updateAppointment.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentModal;
