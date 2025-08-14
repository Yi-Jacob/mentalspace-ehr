
import React from 'react';
import { Card } from '@/components/basic/card';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { schedulingService } from '@/services/schedulingService';
import CreateAppointmentModal from '../components/CreateAppointmentModal';
import { useCalendarNavigation } from '../components/hooks/useCalendarNavigation';
import { useAppointmentModal } from '../components/hooks/useAppointmentModal';
import { useRealtimeAppointments } from '../components/hooks/useRealtimeAppointments';
import CalendarHeader from '../components/calendar/CalendarHeader';
import CalendarContent from '../components/calendar/CalendarContent';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Calendar, Plus } from 'lucide-react';

type CalendarViewType = 'day' | 'week' | 'month' | 'list';

import { Appointment } from '@/services/schedulingService';

const CalendarView = () => {
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

  // Enable real-time updates
  useRealtimeAppointments();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', currentDate, viewType],
    queryFn: async () => {
      let startDate: Date;
      let endDate: Date;

      switch (viewType) {
        case 'day':
          startDate = new Date(currentDate);
          endDate = new Date(currentDate);
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

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Calendar}
        title="Calendar View"
        description="View and manage your schedule with different calendar views"
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

      <div className="space-y-6 h-full flex flex-col">
        <Card className="flex-1 flex flex-col border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
          <CalendarHeader
            currentDate={currentDate}
            viewType={viewType}
            onViewTypeChange={setViewType}
            onNavigateDate={navigateDate}
            onTodayClick={() => setCurrentDate(new Date())}
            onCreateAppointment={() => setShowCreateModal(true)}
          />
          
          <CalendarContent
            viewType={viewType}
            currentDate={currentDate}
            appointments={appointments}
            isLoading={isLoading}
            onTimeSlotClick={handleTimeSlotClick}
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
      </div>
    </PageLayout>
  );
};

export default CalendarView;
