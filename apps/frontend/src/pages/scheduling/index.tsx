
import { useState } from 'react';
import { Card } from '@/components/basic/card';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { schedulingService } from '@/services/schedulingService';
import CreateAppointmentModal from './components/CreateAppointmentModal';
import AppointmentDetailModal from './components/AppointmentDetailModal';
import DeleteAppointmentDialog from './components/DeleteAppointmentDialog';
import { useCalendarNavigation } from './components/hooks/useCalendarNavigation';
import { useAppointmentModal } from './components/hooks/useAppointmentModal';
import { useRealtimeAppointments } from './components/hooks/useRealtimeAppointments';
import CalendarHeader from './components/calendar/CalendarHeader';
import CalendarContent from './components/calendar/CalendarContent';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Calendar, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { USER_ROLES } from '@/types/enums/staffEnum';
import { useNavigate } from 'react-router-dom';
import AskMeetingModal from './components/AskMeetingModal';

const CalendarView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  // Calendar view state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [showAskMeetingModal, setShowAskMeetingModal] = useState(false);

  // Enable real-time updates
  useRealtimeAppointments();

  // Calendar view query
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', currentDate, viewType],
    queryFn: async () => {
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
  });

  const handleAttendMeeting = (meetLink: string) => {
    window.open(meetLink, '_blank');
  };

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointmentId(appointment.id);
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
          appointmentId={selectedAppointmentId}
          onAttendMeeting={handleAttendMeeting}
        />

        <DeleteAppointmentDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          appointment={selectedAppointmentId ? { id: selectedAppointmentId } : null}
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
