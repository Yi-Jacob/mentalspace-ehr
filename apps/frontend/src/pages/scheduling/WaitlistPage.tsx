import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { X, Calendar, User, Clock, MessageSquare, Video, Phone } from 'lucide-react';
import { toast } from 'sonner';

import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Table, TableColumn } from '@/components/basic/table';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { Card } from '@/components/basic/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/basic/alert-dialog';
import { EmptyState } from '@/components/basic/empty-state';
import { LoadingState } from '@/components/basic/loading-state';

import { schedulingService, WaitlistEntry } from '@/services/schedulingService';
import { useAuth } from '@/hooks/useAuth';
import { USER_ROLES } from '@/types/enums/staffEnum';
import CreateAppointmentModal from './components/CreateAppointmentModal';
import { useNavigate } from 'react-router-dom';

const WaitlistPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showCreateAppointmentModal, setShowCreateAppointmentModal] = useState(false);
  const [selectedWaitlistEntry, setSelectedWaitlistEntry] = useState<WaitlistEntry | null>(null);

  // Get waitlist entries
  const { data: waitlistEntries = [], isLoading } = useQuery({
    queryKey: ['waitlist'],
    queryFn: () => schedulingService.getWaitlistEntries(),
  });

  // Cancel waitlist mutation
  const cancelWaitlistMutation = useMutation({
    mutationFn: (waitlistId: string) => schedulingService.cancelWaitlistEntry(waitlistId),
    onSuccess: () => {
      toast.success('Waitlist entry cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel waitlist entry');
    },
  });

  const handleCancelWaitlist = (waitlistId: string) => {
    cancelWaitlistMutation.mutate(waitlistId);
  };

  const handleCreateAppointment = (waitlistEntry: WaitlistEntry) => {
    setSelectedWaitlistEntry(waitlistEntry);
    setShowCreateAppointmentModal(true);
  };

  const handleAppointmentCreated = () => {
    setShowCreateAppointmentModal(false);
    setSelectedWaitlistEntry(null);
    queryClient.invalidateQueries({ queryKey: ['waitlist'] });
  };

  const handleGoToSchedule = () => {
    navigate('/scheduling');
  };

  // Check user role
  const isPatient = user?.roles?.includes(USER_ROLES.PATIENT);
  const isClinician = user?.roles?.includes(USER_ROLES.CLINICIAN);
  const isSupervisor = user?.roles?.includes(USER_ROLES.SUPERVISOR);
  const isAdmin = user?.roles?.includes(USER_ROLES.PRACTICE_ADMINISTRATOR) || user?.roles?.includes(USER_ROLES.CLINICAL_ADMINISTRATOR);

  // Filter entries based on role
  const filteredEntries = waitlistEntries.filter((entry) => {
    if (isPatient) {
      return entry.clientId === user?.clientId;
    }
    return true; // Staff can see all entries
  });

  // Sort entries: unfulfilled first, then by creation date
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (a.isFulfilled !== b.isFulfilled) {
      return a.isFulfilled ? 1 : -1;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  // Table columns configuration
  const waitlistColumns: TableColumn<WaitlistEntry>[] = [
    {
      key: 'client',
      header: 'Client',
      accessor: (entry) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-500" />
          <span>
            {entry.clients?.firstName} {entry.clients?.lastName}
          </span>
        </div>
      ),
      sortable: true,
      searchable: true,
      searchValue: (entry) => `${entry.clients?.firstName} ${entry.clients?.lastName}`,
      width: '15%'
    },
    {
      key: 'provider',
      header: 'Provider',
      accessor: (entry) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-500" />
          <span>
            {entry.users?.firstName} {entry.users?.lastName}
          </span>
        </div>
      ),
      sortable: true,
      searchable: true,
      searchValue: (entry) => `${entry.users?.firstName} ${entry.users?.lastName}`,
      width: '15%'
    },
    {
      key: 'preferredDate',
      header: 'Preferred Date',
      accessor: (entry) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{format(new Date(entry.preferredDate), 'MMM dd, yyyy')}</span>
        </div>
      ),
      sortable: true,
      width: '12%'
    },
    {
      key: 'preferredTime',
      header: 'Preferred Time',
      accessor: (entry) => (
        entry.preferredTimeStart ? (
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{entry.preferredTimeStart}</span>
          </div>
        ) : 'N/A'
      ),
      sortable: true,
      width: '12%'
    },
    {
      key: 'type',
      header: 'Type',
      accessor: (entry) => (
        <div className="flex items-center space-x-2">
          {entry.isTelehealth ? (
            <Video className="h-4 w-4 text-blue-500" />
          ) : (
            <Phone className="h-4 w-4 text-green-500" />
          )}
          <span>{entry.isTelehealth ? 'Telehealth' : 'In-person'}</span>
        </div>
      ),
      sortable: true,
      width: '10%'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (entry) => (
        <Badge variant={entry.isFulfilled ? 'secondary' : 'default'}>
          {entry.isFulfilled ? 'Fulfilled' : 'Pending'}
        </Badge>
      ),
      sortable: true,
      width: '10%'
    },
    {
      key: 'notes',
      header: 'Notes',
      accessor: (entry) => (
        entry.notes ? (
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-gray-500" />
            <span className="truncate max-w-[200px]" title={entry.notes}>
              {entry.notes}
            </span>
          </div>
        ) : 'N/A'
      ),
      sortable: false,
      searchable: true,
      searchValue: (entry) => entry.notes || '',
      width: '20%'
    },
    {
      key: 'createdAt',
      header: 'Created',
      accessor: (entry) => format(new Date(entry.createdAt), 'MMM dd, yyyy'),
      sortable: true,
      width: '10%'
    }
  ];

  // Table actions configuration
  const waitlistActions = [
    // Cancel action for patients
    ...(isPatient ? [{
      label: 'Cancel',
      icon: <X className="w-3 h-3" />,
      onClick: (entry: WaitlistEntry) => {
        if (!entry.isFulfilled) {
          handleCancelWaitlist(entry.id);
        }
      },
      variant: 'ghost' as const,
      disabled: (entry: WaitlistEntry) => entry.isFulfilled,
      className: 'text-red-600 hover:text-red-700'
    }] : []),
    // Create appointment action for staff
    ...((isClinician || isSupervisor || isAdmin) ? [{
      label: 'Create Appointment',
      icon: <Calendar className="w-3 h-3" />,
      onClick: (entry: WaitlistEntry) => {
        if (!entry.isFulfilled) {
          handleCreateAppointment(entry);
        }
      },
      variant: 'default' as const,
      disabled: (entry: WaitlistEntry) => entry.isFulfilled,
      className: 'bg-blue-600 hover:bg-blue-700 text-white'
    }] : [])
  ];

  if (isLoading) {
    return (
      <PageLayout variant="gradient">
        <PageHeader
          icon={Calendar}
          title="Waitlist"
          description="Manage appointment waitlist entries"
        />
        <LoadingState />
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Calendar}
        title="Waitlist"
        description="Manage appointment waitlist entries"
        action={
          <Button
            onClick={handleGoToSchedule}
            variant="outline"
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-200"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Go to Schedule Page
          </Button>
        }
      />

      <div className="space-y-6">
        {sortedEntries.length === 0 ? (
          <EmptyState
            title="No waitlist entries"
            description="There are no waitlist entries to display."
          />
        ) : (
          <Table
            data={sortedEntries}
            columns={waitlistColumns}
            pageSize={15}
            pageSizeOptions={[10, 15, 25, 50]}
            emptyMessage="No waitlist entries found"
            loading={false}
            actions={waitlistActions}
          />
        )}
      </div>

      {showCreateAppointmentModal && selectedWaitlistEntry && (
        <CreateAppointmentModal
          open={showCreateAppointmentModal}
          onOpenChange={setShowCreateAppointmentModal}
          selectedDate={new Date(selectedWaitlistEntry.preferredDate)}
          selectedTime={selectedWaitlistEntry.preferredTimeStart}
          defaultClientId={selectedWaitlistEntry.clientId}
          defaultProviderId={selectedWaitlistEntry.providerId}
          defaultIsTelehealth={selectedWaitlistEntry.isTelehealth}
          defaultNotes={selectedWaitlistEntry.notes}
          waitlistEntryId={selectedWaitlistEntry.id}
          onAppointmentCreated={handleAppointmentCreated}
        />
      )}
    </PageLayout>
  );
};

export default WaitlistPage;
