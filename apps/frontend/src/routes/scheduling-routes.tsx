import { RouteObject } from 'react-router-dom';
import AppointmentManagement from '@/pages/scheduling';

const schedulingRoutes: RouteObject[] = [
  {
    index: true,
    element: <AppointmentManagement />,
  }
];

export default schedulingRoutes; 