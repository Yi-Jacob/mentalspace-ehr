
import React, { useState } from 'react';
import { Card } from '@/components/basic/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { schedulingService } from '@/services/schedulingService';
import CreateAppointmentModal from './components/CreateAppointmentModal';
import AppointmentDetailModal from './components/AppointmentDetailModal';
import DeleteAppointmentDialog from './components/DeleteAppointmentDialog';
import { useCalendarNavigation, CalendarViewType } from './components/hooks/useCalendarNavigation';
import { useAppointmentModal } from './components/hooks/useAppointmentModal';
import { useAppointmentMutations } from './components/hooks/useAppointmentMutations';
import { useRealtimeAppointments } from './components/hooks/useRealtimeAppointments';
import CalendarHeader from './components/calendar/CalendarHeader';
import CalendarContent from './components/calendar/CalendarContent';
import AppointmentFilters from './components/appointment-management/AppointmentFilters';
import AppointmentsList from './components/appointment-management/AppointmentsList';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Calendar, Plus } from 'lucide-react';
import { AppointmentTypeValue } from '@/types/scheduleType';
import { AppointmentStatus } from '@/types/enums/scheduleEnum';
import { useAuth } from '@/hooks/useAuth';
import { USER_ROLES } from '@/types/enums/staffEnum';
import { useNavigate } from 'react-router-dom';
import AskMeetingModal from './components/AskMeetingModal';

type AppointmentTypeFilter = AppointmentTypeValue | 'all';

const CalendarView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    currentDate,
    setCurrentDate,
    viewType,
    setViewType,
    navigateDate
  } = useCalendarNavigation();

  const {
    selectedDate,
    selectedTime,
    showCreateModal,
    setShowCreateModal,
    handleTimeSlotClick,
    closeModal
  } = useAppointmentModal();

  // List view state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AppointmentTypeFilter>('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showAskMeetingModal, setShowAskMeetingModal] = useState(false);

  // Enable real-time updates
  useRealtimeAppointments();

  const { updateAppointmentStatus } = useAppointmentMutations();

  // Calendar view query
  const { data: calendarAppointments, isLoading: isCalendarLoading } = useQuery({
    queryKey: ['appointments', currentDate, viewType],
    queryFn: async () => {
      if (viewType === 'list') return [];

      let startDate: Date;
      let endDate: Date;

      switch (viewType) {
        case 'day':
          startDate = new Date(currentDate);
          endDate = new Date(currentDate);
          startDate.setHours(0, 0, 0, 0); // Set to start of day
          endDate.setHours(23, 59, 59, 999); // Set to end of day
          break;
        case 'week':
          startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
          endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
          break;
        case 'month':
          startDate = startOfMonth(currentDate);
          endDate = endOfMonth(currentDate);
          break;
        default:
          startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
          endDate = addDays(endOfWeek(currentDate, { weekStartsOn: 1 }), 30);
      }
      
      return await schedulingService.getAppointments({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    },
    enabled: viewType !== 'list',
  });

  // List view query
  const { data: listAppointments, isLoading: isListLoading } = useQuery({
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
    enabled: viewType === 'list',
  });

  // Use appropriate data based on view type
  const appointments = viewType === 'list' ? listAppointments : calendarAppointments;
  const isLoading = viewType === 'list' ? isListLoading : isCalendarLoading;

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

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowEditModal(true);
  };

  // Check if user is a client/patient
  const isClient = user?.roles?.includes(USER_ROLES.PATIENT);

  const handleWaitlistClick = () => {
    navigate('/scheduling/waitlist');
  };

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Calendar}
        title="Appointments"
        description="Manage and track all your appointments and client schedules"
        action={
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setViewType(viewType === 'list' ? 'week' : 'list')}
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-all duration-200"
            >
              {viewType === 'list' ? 'Calendar View' : 'Table View'}
            </button>
            <button
              onClick={handleWaitlistClick}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
            >
              <span>Waitlist</span>
            </button>
            {isClient ? (
                <button
                  onClick={() => setShowAskMeetingModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ask Meeting</span>
                </button>
            ):(
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>New Appointment</span>
              </button>
            )}
          </div>
        }
      />

      <div className="space-y-6 h-full flex flex-col">
        {viewType === 'list' ? (
          // List view
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
              onEditAppointment={isClient ? undefined : handleEditAppointment}
              onDeleteAppointment={isClient ? undefined : handleDeleteAppointment}
              onStatusChange={isClient ? undefined : handleStatusChange}
              onAttendMeeting={handleAttendMeeting}
            />
          </div>
        ) : (
          // Calendar view
          <Card className="flex-1 flex flex-col border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
            <CalendarHeader
              currentDate={currentDate}
              viewType={viewType}
              onNavigateDate={navigateDate}
              onTodayClick={() => setCurrentDate(new Date())}
              onViewChange={(newView) => setViewType(newView)}
            />

            <CalendarContent
              viewType={viewType}
              currentDate={currentDate}
              appointments={appointments}
              isLoading={isLoading}
              onTimeSlotClick={isClient ? undefined : handleTimeSlotClick}
              onAttendMeeting={handleAttendMeeting}
              onAppointmentClick={handleAppointmentClick}
            />
          </Card>
        )}

        <CreateAppointmentModal
          open={showCreateModal}
          onOpenChange={(open) => {
            if (!open) {
              closeModal();
            } else {
              setShowCreateModal(open);
            }
          }}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />

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

        <AskMeetingModal
          open={showAskMeetingModal}
          onOpenChange={setShowAskMeetingModal}
        />
      </div>
    </PageLayout>
  );
};

export default CalendarView;
