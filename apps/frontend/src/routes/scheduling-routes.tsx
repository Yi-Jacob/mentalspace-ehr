import { RouteObject } from 'react-router-dom';
import CalendarView from '@/pages/scheduling/CalendarPage';
import AppointmentManagement from '@/pages/scheduling/AppointmentsPage';
import WorkScheduleManagement from '@/pages/scheduling/WorkSchedulePage';

const schedulingRoutes: RouteObject[] = [
  {
    index: true,
    element: <CalendarView />,
  },{
    path: 'appointments',
    element: <AppointmentManagement />,
  },{
    path: 'work-schedule',
    element: <WorkScheduleManagement />,
  }, {
    path: 'calendar',
    element: <CalendarView />,
  }
];

export default schedulingRoutes; 