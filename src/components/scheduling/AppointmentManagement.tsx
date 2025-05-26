
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CreateAppointmentModal from './CreateAppointmentModal';
import AppointmentWaitlist from './AppointmentWaitlist';
import EditAppointmentModal from './EditAppointmentModal';
import DeleteAppointmentDialog from './DeleteAppointmentDialog';
import { useAppointmentMutations } from './hooks/useAppointmentMutations';
import { useRealtimeAppointments } from './hooks/useRealtimeAppointments';
import AppointmentManagementHeader from './appointment-management/AppointmentManagementHeader';
import AppointmentFilters from './appointment-management/AppointmentFilters';
import AppointmentsList from './appointment-management/AppointmentsList';

type AppointmentStatus = 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
type AppointmentType = 'initial_consultation' | 'follow_up' | 'therapy_session' | 'group_therapy' | 'assessment' | 'medication_management' | 'crisis_intervention' | 'other';

const AppointmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AppointmentType | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Enable real-time updates
  useRealtimeAppointments();

  const { updateAppointmentStatus } = useAppointmentMutations();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments-management', searchTerm, statusFilter, typeFilter],
    queryFn: async () => {
      let query = supabase
        .from('appointments')
        .select(`
          id,
          title,
          client_id,
          provider_id,
          appointment_type,
          start_time,
          end_time,
          status,
          location,
          room_number,
          notes,
          clients!client_id(first_name, last_name),
          users!provider_id(first_name, last_name)
        `)
        .order('start_time', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (typeFilter !== 'all') {
        query = query.eq('appointment_type', typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      let filteredData = data || [];
      
      if (searchTerm) {
        filteredData = filteredData.filter(appointment => {
          const clientName = appointment.clients 
            ? `${appointment.clients.first_name} ${appointment.clients.last_name}`
            : '';
          const providerName = appointment.users
            ? `${appointment.users.first_name} ${appointment.users.last_name}`
            : '';
          
          return (
            clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (appointment.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.appointment_type.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      }

      return filteredData;
    },
  });

  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  const handleDeleteAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowDeleteDialog(true);
  };

  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    updateAppointmentStatus.mutate({ id: appointmentId, status: newStatus });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-white to-blue-50/30 min-h-screen p-6">
      <AppointmentManagementHeader onCreateAppointment={() => setShowCreateModal(true)} />

      <AppointmentFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onTypeFilterChange={setTypeFilter}
        onClearFilters={handleClearFilters}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AppointmentsList
            appointments={appointments}
            isLoading={isLoading}
            onEditAppointment={handleEditAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onStatusChange={handleStatusChange}
          />
        </div>

        <div>
          <AppointmentWaitlist />
        </div>
      </div>

      <CreateAppointmentModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      <EditAppointmentModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        appointment={selectedAppointment}
      />

      <DeleteAppointmentDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default AppointmentManagement;
