import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/basic/dialog';
import { schedulingService, Appointment } from '@/services/schedulingService';

interface CreateSessionCompletionDto {
  appointmentId: string;
  providerId: string;
  clientId: string;
  sessionType: string;
  durationMinutes: number;
  sessionDate: string;
}

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSessionCompletionDto) => void;
  formData: CreateSessionCompletionDto;
  setFormData: (data: CreateSessionCompletionDto) => void;
  providerId: string;
}


const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData,
  providerId
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState('');
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [showAppointmentDropdown, setShowAppointmentDropdown] = useState(false);

  // Load appointments when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAppointments();
    }
  }, [isOpen, providerId]);

  // Filter appointments based on search
  useEffect(() => {
    if (appointmentSearch) {
      const filtered = appointments.filter(apt =>
        `${apt.title} ${apt.clients.firstName} ${apt.clients.lastName}`.toLowerCase().includes(appointmentSearch.toLowerCase())
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [appointmentSearch, appointments]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowAppointmentDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const loadAppointments = async () => {
    try {
      setLoading(true);
      const appointmentsData = await schedulingService.getAppointments({ 
        status: 'Confirmed' // Only show confirmed appointments
      });
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };


  const handleAppointmentSelect = (appointment: Appointment) => {
    setFormData({ 
      ...formData, 
      appointmentId: appointment.id,
      clientId: appointment.clientId,
      durationMinutes: appointment.duration,
      sessionDate: new Date(appointment.startTime).toISOString().split('T')[0]
    });
    setAppointmentSearch(`${appointment.title} - ${appointment.clients.firstName} ${appointment.clients.lastName} - ${new Date(appointment.startTime).toLocaleDateString()}`);
    setShowAppointmentDropdown(false);
    
    // Update client name display when appointment is selected
    setClientName(`${appointment.clients.firstName} ${appointment.clients.lastName}`);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
        </DialogHeader>
        <form id="create-session-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Appointment Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Select Appointment *</label>
              <div className="relative dropdown-container">
                <input
                  type="text"
                  value={appointmentSearch}
                  onChange={(e) => {
                    setAppointmentSearch(e.target.value);
                    setShowAppointmentDropdown(true);
                  }}
                  onFocus={() => setShowAppointmentDropdown(true)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search appointments by title, client name, or date..."
                  required
                />
                {loading && (
                  <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-gray-400" />
                )}
                {showAppointmentDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleAppointmentSelect(appointment)}
                        >
                          <div className="font-medium text-sm">
                            {appointment.title} - {appointment.clients.firstName} {appointment.clients.lastName}
                          </div>
                          <div className="text-xs text-gray-600">
                            {new Date(appointment.startTime).toLocaleDateString()} at {new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({appointment.duration} min)
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500 text-sm">No appointments found</div>
                    )}
                  </div>
                )}
              </div>
              {appointments.length === 0 && !loading && (
                <p className="text-xs text-gray-500 mt-1">
                  No confirmed appointments found for this provider. Please create an appointment first.
                </p>
              )}
            </div>

            {/* Client Display (auto-filled from appointment) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Client *</label>
              <input
                type="text"
                value={clientName}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
                placeholder="Client name will appear when you select an appointment"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Client is automatically set from the selected appointment
              </p>
            </div>

            {/* Session Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Session Type *</label>
              <select
                value={formData.sessionType}
                onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="Individual Therapy">Individual Therapy</option>
                <option value="Group Therapy">Group Therapy</option>
                <option value="Intake Session">Intake Session</option>
                <option value="Assessment">Assessment</option>
                <option value="Family Therapy">Family Therapy</option>
                <option value="Couples Therapy">Couples Therapy</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes) *</label>
              <input
                type="number"
                value={formData.durationMinutes}
                readOnly
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Duration is automatically set from the selected appointment
              </p>
            </div>

            {/* Session Date */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Session Date *</label>
              <input
                type="date"
                value={formData.sessionDate}
                onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-session-form"
            disabled={!formData.appointmentId || !formData.clientId || !formData.sessionType}
          >
            Create Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionModal;
