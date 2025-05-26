
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Plus, Calendar, List, Grid } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, addWeeks, addMonths, subWeeks, subMonths } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CreateAppointmentModal from './CreateAppointmentModal';
import AppointmentCard from './AppointmentCard';
import { cn } from '@/lib/utils';

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>('week');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
      
      // Transform the data to match our Appointment interface
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

  function navigateDate(direction: 'prev' | 'next') {
    switch (viewType) {
      case 'day':
        setCurrentDate(prev => addDays(prev, direction === 'next' ? 1 : -1));
        break;
      case 'week':
        setCurrentDate(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1));
        break;
      case 'month':
        setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
        break;
    }
  }

  function getCalendarTitle() {
    switch (viewType) {
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'week':
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return `Week of ${format(weekStart, 'MMMM d, yyyy')}`;
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      default:
        return 'Appointments';
    }
  }

  function handleTimeSlotClick(date: Date, hour: number) {
    const clickedDateTime = new Date(date);
    clickedDateTime.setHours(hour, 0, 0, 0);
    setSelectedDate(clickedDateTime);
    setSelectedTime(format(clickedDateTime, 'HH:mm'));
    setShowCreateModal(true);
  }

  function renderDayView() {
    const dayAppointments = appointments?.filter(apt => 
      isSameDay(new Date(apt.start_time), currentDate)
    ) || [];

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="flex flex-col h-full">
        {/* Header with day and date */}
        <div className="bg-blue-50 p-4 border-b">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-900">
              {format(currentDate, 'EEEE')}
            </div>
            <div className="text-2xl font-bold text-blue-800">
              {format(currentDate, 'd')}
            </div>
          </div>
        </div>

        {/* Time slots */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-[60px_1fr] gap-0">
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                {/* Time label */}
                <div className="text-xs text-gray-500 p-2 border-r border-gray-200 text-right">
                  {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                </div>
                {/* Time slot */}
                <div 
                  className="min-h-[60px] border-b border-gray-100 p-1 hover:bg-blue-50 cursor-pointer relative"
                  onClick={() => handleTimeSlotClick(currentDate, hour)}
                >
                  {dayAppointments
                    .filter(apt => new Date(apt.start_time).getHours() === hour)
                    .map(appointment => (
                      <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderWeekView() {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(currentDate, { weekStartsOn: 1 })
    });

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="flex flex-col h-full">
        {/* Week header */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-0 border-b border-gray-200 bg-blue-50">
          <div className="p-2"></div>
          {weekDays.map(day => (
            <div key={day.toISOString()} className="p-3 text-center border-r border-gray-200 last:border-r-0">
              <div className="text-sm font-medium text-blue-900">
                {format(day, 'EEE')}
              </div>
              <div className={cn(
                "text-lg font-bold mt-1",
                isSameDay(day, new Date()) ? "bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto" : "text-blue-800"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-0">
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                {/* Time label */}
                <div className="text-xs text-gray-500 p-2 border-r border-gray-200 text-right sticky left-0 bg-white z-10">
                  {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                </div>
                {/* Day columns */}
                {weekDays.map(day => {
                  const dayAppointments = appointments?.filter(apt => 
                    isSameDay(new Date(apt.start_time), day) && 
                    new Date(apt.start_time).getHours() === hour
                  ) || [];

                  return (
                    <div 
                      key={`${day.toISOString()}-${hour}`}
                      className="min-h-[60px] border-b border-r border-gray-100 p-1 hover:bg-blue-50 cursor-pointer relative last:border-r-0"
                      onClick={() => handleTimeSlotClick(day, hour)}
                    >
                      {dayAppointments.map(appointment => (
                        <AppointmentCard 
                          key={appointment.id} 
                          appointment={appointment} 
                          compact 
                        />
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderMonthView() {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    const calendarDays = eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd
    });

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="font-medium text-center py-2 text-sm">
            {day}
          </div>
        ))}
        {calendarDays.map(day => {
          const dayAppointments = appointments?.filter(apt => 
            isSameDay(new Date(apt.start_time), day)
          ) || [];
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();

          return (
            <div 
              key={day.toISOString()} 
              className={`border border-gray-200 min-h-[100px] p-1 ${
                !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
              }`}
            >
              <div className="text-sm font-medium mb-1">
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayAppointments.slice(0, 3).map(appointment => (
                  <div 
                    key={appointment.id}
                    className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
                  >
                    {format(new Date(appointment.start_time), 'HH:mm')} {appointment.title || 'Appointment'}
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{dayAppointments.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderListView() {
    const sortedAppointments = appointments?.sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    ) || [];

    return (
      <div className="space-y-2">
        {sortedAppointments.map(appointment => (
          <AppointmentCard key={appointment.id} appointment={appointment} listView />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Select value={viewType} onValueChange={(value: CalendarViewType) => setViewType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-medium min-w-[200px]">{getCalendarTitle()}</h2>
              <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading calendar...</div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {viewType === 'day' && renderDayView()}
              {viewType === 'week' && renderWeekView()}
              {viewType === 'month' && renderMonthView()}
              {viewType === 'list' && renderListView()}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateAppointmentModal 
        open={showCreateModal}
        onOpenChange={(open) => {
          setShowCreateModal(open);
          if (!open) {
            setSelectedDate(null);
            setSelectedTime(null);
          }
        }}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </div>
  );
};

export default CalendarView;
