import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { schedulingService } from '@/services/schedulingService';
import { AppointmentTypeValue } from '@/types/scheduleType';
import { AppointmentStatus } from '@/types/enums/scheduleEnum';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { List } from 'lucide-react';
import AppointmentFilters from '../../scheduling/components/appointment-management/AppointmentFilters';
import AppointmentsList from '../../scheduling/components/appointment-management/AppointmentsList';
import AppointmentDetailModal from '../../scheduling/components/AppointmentDetailModal';
import DeleteAppointmentDialog from '../../scheduling/components/DeleteAppointmentDialog';
import { useAppointmentMutations } from '../../scheduling/components/hooks/useAppointmentMutations';

type AppointmentTypeFilter = AppointmentTypeValue | 'all';

const SessionCompletionTracking: React.FC = () => {
  // List view state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AppointmentTypeFilter>('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const { updateAppointmentStatus } = useAppointmentMutations();

  // List view query
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

  // List view handlers
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

  const handleAttendMeeting = (meetLink: string) => {
    window.open(meetLink, '_blank');
  };

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={List}
        title="Sessions"
        description="Session Completion Tracking"
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
          onAttendMeeting={handleAttendMeeting}
        />
      </div>

      <AppointmentDetailModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        appointment={selectedAppointment}
        onAttendMeeting={handleAttendMeeting}
      />

      <DeleteAppointmentDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        appointment={selectedAppointment}
      />
    </PageLayout>
  );
};

export default SessionCompletionTracking;
