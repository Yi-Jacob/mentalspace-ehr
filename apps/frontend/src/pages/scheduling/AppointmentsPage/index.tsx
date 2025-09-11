
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { schedulingService } from '@/services/schedulingService';
import CreateAppointmentModal from '../components/CreateAppointmentModal';
import EditAppointmentModal from '../components/EditAppointmentModal';
import DeleteAppointmentDialog from '../components/DeleteAppointmentDialog';
import { useAppointmentMutations } from '../components/hooks/useAppointmentMutations';
import { useRealtimeAppointments } from '../components/hooks/useRealtimeAppointments';
import AppointmentManagementHeader from '../components/appointment-management/AppointmentManagementHeader';
import AppointmentFilters from '../components/appointment-management/AppointmentFilters';
import AppointmentsList from '../components/appointment-management/AppointmentsList';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Calendar, Plus } from 'lucide-react';
import { AppointmentTypeValue } from '@/types/scheduleType';
import { AppointmentStatus } from '@/types/enums/scheduleEnum';
type AppointmentType = AppointmentTypeValue;
type AppointmentTypeFilter = AppointmentTypeValue | 'all';

const AppointmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AppointmentTypeFilter>('all');
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
      const params: any = {};
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (typeFilter !== 'all') {
        params.appointmentType = typeFilter;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      return await schedulingService.getAppointments(params);
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
    <PageLayout variant="gradient">
      <PageHeader
        icon={Calendar}
        title="Appointment Management"
        description="Manage and track all your appointments and client schedules"
        action={
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>New Appointment</span>
          </button>
        }
      />

      <div className="space-y-6">
        <AppointmentFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          onTypeFilterChange={setTypeFilter}
          onClearFilters={handleClearFilters}
        />

        <AppointmentsList
          appointments={appointments}
          isLoading={isLoading}
          onEditAppointment={handleEditAppointment}
          onDeleteAppointment={handleDeleteAppointment}
          onStatusChange={handleStatusChange}
        />

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
    </PageLayout>
  );
};

export default AppointmentManagement;
