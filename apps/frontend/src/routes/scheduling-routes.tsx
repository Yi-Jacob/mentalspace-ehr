import { RouteObject } from 'react-router-dom';
import CalendarView from '@/pages/scheduling/CalendarPage';
import AppointmentManagement from '@/pages/scheduling/AppointmentsPage';

const schedulingRoutes: RouteObject[] = [
  {
    index: true,
    element: <CalendarView />,
  },{
    path: 'appointments',
    element: <AppointmentManagement />,
  }, {
    path: 'calendar',
    element: <CalendarView />,
  }
];

export default schedulingRoutes; 