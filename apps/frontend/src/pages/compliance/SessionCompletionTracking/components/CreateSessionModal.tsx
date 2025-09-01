import React, { useState, useEffect } from 'react';
import { X, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { clientService } from '@/services/clientService';
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

interface ClientOption {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData,
  providerId
}) => {
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [appointmentSearch, setAppointmentSearch] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showAppointmentDropdown, setShowAppointmentDropdown] = useState(false);

  // Load clients and appointments when modal opens
  useEffect(() => {
    if (isOpen) {
      loadClients();
      loadAppointments();
    }
  }, [isOpen, providerId]);

  // Filter appointments when client is selected
  useEffect(() => {
    if (formData.clientId) {
      const filtered = appointments.filter(apt => apt.clientId === formData.clientId);
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [formData.clientId, appointments]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setShowClientDropdown(false);
        setShowAppointmentDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const clientsData = await clientService.getClients({ limit: 100 });
      // Transform ClientFormData to ClientOption, filtering out clients without IDs
      const transformedClients = clientsData
        .filter(client => client.id) // Only include clients with IDs
        .map(client => ({
          id: client.id!,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email
        }));
      setClients(transformedClients);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleClientSelect = (client: ClientOption) => {
    setFormData({ ...formData, clientId: client.id });
    setClientSearch(`${client.firstName} ${client.lastName}`);
    setShowClientDropdown(false);
  };

  const handleAppointmentSelect = (appointment: Appointment) => {
    setFormData({ 
      ...formData, 
      appointmentId: appointment.id,
      clientId: appointment.clientId,
      durationMinutes: appointment.duration,
      sessionDate: new Date(appointment.startTime).toISOString().split('T')[0]
    });
    setAppointmentSearch(`#${appointment.id} - ${appointment.clients.firstName} ${appointment.clients.lastName} - ${new Date(appointment.startTime).toLocaleDateString()}`);
    setShowAppointmentDropdown(false);
    
    // Also update client search when appointment is selected
    setClientSearch(`${appointment.clients.firstName} ${appointment.clients.lastName}`);
  };

  const filteredClients = clients.filter(client =>
    `${client.firstName} ${client.lastName}`.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const filteredAppointmentsForSearch = filteredAppointments.filter(apt =>
    `${apt.id} ${apt.clients.firstName} ${apt.clients.lastName}`.toLowerCase().includes(appointmentSearch.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Create New Session</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
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
                  placeholder="Search appointments by ID, client name, or date..."
                  required
                />
                {loading && (
                  <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-gray-400" />
                )}
                {showAppointmentDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredAppointmentsForSearch.length > 0 ? (
                      filteredAppointmentsForSearch.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleAppointmentSelect(appointment)}
                        >
                          <div className="font-medium text-sm">
                            #{appointment.title} - {appointment.clients.firstName} {appointment.clients.lastName}
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

            {/* Client Selection (can be auto-filled from appointment) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Client *</label>
              <div className="relative dropdown-container">
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setShowClientDropdown(true);
                    if (!e.target.value) {
                      setFormData({ ...formData, clientId: '' });
                    }
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search clients by name..."
                  required
                />
                {showClientDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <div
                          key={client.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleClientSelect(client)}
                        >
                          <div className="font-medium text-sm">
                            {client.firstName} {client.lastName}
                          </div>
                          {client.email && (
                            <div className="text-xs text-gray-600">{client.email}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500 text-sm">No clients found</div>
                    )}
                  </div>
                )}
              </div>
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
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.appointmentId || !formData.clientId || !formData.sessionType}
            >
              Create Session
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionModal;
