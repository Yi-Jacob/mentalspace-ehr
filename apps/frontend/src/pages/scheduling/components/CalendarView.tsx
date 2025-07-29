
import React from 'react';
import { Card } from '@/components/basic/card';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { schedulingService } from '@/services/schedulingService';
import CreateAppointmentModal from './CreateAppointmentModal';
import { useCalendarNavigation } from './hooks/useCalendarNavigation';
import { useAppointmentModal } from './hooks/useAppointmentModal';
import { useRealtimeAppointments } from './hooks/useRealtimeAppointments';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarContent from './calendar/CalendarContent';

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
  );
};

export default CalendarView;
