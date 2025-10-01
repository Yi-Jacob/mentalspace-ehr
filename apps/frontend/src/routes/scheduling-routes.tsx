import { RouteObject } from 'react-router-dom';
import AppointmentManagement from '@/pages/scheduling';
import WaitlistPage from '@/pages/scheduling/WaitlistPage';

const schedulingRoutes: RouteObject[] = [
  {
    index: true,
    element: <AppointmentManagement />,
  },
  {
    path: 'waitlist',
    element: <WaitlistPage />,
  }
];

export default schedulingRoutes; 