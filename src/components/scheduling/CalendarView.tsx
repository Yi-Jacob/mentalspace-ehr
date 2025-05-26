import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CreateAppointmentModal from './CreateAppointmentModal';
import DayView from './calendar-views/DayView';
import WeekView from './calendar-views/WeekView';
import MonthView from './calendar-views/MonthView';
import ListView from './calendar-views/ListView';
import { useCalendarNavigation } from './hooks/useCalendarNavigation';
import { useAppointmentModal } from './hooks/useAppointmentModal';
import { useRealtimeAppointments } from './hooks/useRealtimeAppointments';
import { getCalendarTitle } from './utils/calendarUtils';

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

  const renderCalendarView = () => {
    if (!appointments) return null;

    switch (viewType) {
      case 'day':
        return (
          <DayView 
            currentDate={currentDate}
            appointments={appointments}
            onTimeSlotClick={handleTimeSlotClick}
          />
        );
      case 'week':
        return (
          <WeekView 
            currentDate={currentDate}
            appointments={appointments}
            onTimeSlotClick={handleTimeSlotClick}
          />
        );
      case 'month':
        return (
          <MonthView 
            currentDate={currentDate}
            appointments={appointments}
          />
        );
      case 'list':
        return <ListView appointments={appointments} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <Card className="flex-1 flex flex-col border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Calendar className="h-6 w-6" />
              </div>
              <span className="text-xl font-semibold">Calendar</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Select value={viewType} onValueChange={(value: CalendarViewType) => setViewType(value)}>
                <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-0 shadow-2xl">
                  <SelectItem value="day" className="hover:bg-blue-50 transition-colors">Day</SelectItem>
                  <SelectItem value="week" className="hover:bg-blue-50 transition-colors">Week</SelectItem>
                  <SelectItem value="month" className="hover:bg-blue-50 transition-colors">Month</SelectItem>
                  <SelectItem value="list" className="hover:bg-blue-50 transition-colors">List</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateDate('prev')}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold min-w-[200px] text-center">
                {getCalendarTitle(currentDate, viewType)}
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateDate('next')}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentDate(new Date())}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-200"
            >
              Today
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                <div className="text-gray-600 font-medium">Loading calendar...</div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {renderCalendarView()}
            </div>
          )}
        </CardContent>
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
