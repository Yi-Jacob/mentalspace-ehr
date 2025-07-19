
import React from 'react';
import { Card } from '@/components/shared/ui/card';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CreateAppointmentModal from './CreateAppointmentModal';
import { useCalendarNavigation } from './hooks/useCalendarNavigation';
import { useAppointmentModal } from './hooks/useAppointmentModal';
import { useRealtimeAppointments } from './hooks/useRealtimeAppointments';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarContent from './calendar/CalendarContent';

type CalendarViewType = 'day' | 'week' | 'month' | 'list';

interface Appointment {
  id: string;
  title: string;
  client_id: string;
  provider_id: string;
  appointment_type: string;
  start_time: string;
  end_time: string;
  status: string;
  location?: string;
  room_number?: string;
  clients?: {
    first_name: string;
    last_name: string;
  };
  users?: {
    first_name: string;
    last_name: string;
  };
}

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

      const { data, error } = await supabase
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
          clients!client_id(first_name, last_name),
          users!provider_id(first_name, last_name)
        `)
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString())
        .order('start_time');

      if (error) throw error;
      
      const transformedData: Appointment[] = (data || []).map(item => ({
        id: item.id,
        title: item.title || '',
        client_id: item.client_id,
        provider_id: item.provider_id,
        appointment_type: item.appointment_type,
        start_time: item.start_time,
        end_time: item.end_time,
        status: item.status,
        location: item.location,
        room_number: item.room_number,
        clients: item.clients,
        users: item.users
      }));

      return transformedData;
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
