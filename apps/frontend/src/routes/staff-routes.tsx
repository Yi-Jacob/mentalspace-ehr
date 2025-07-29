import StaffPage from '@/pages/staff';
import AddStaffPage from '@/pages/staff/create';
import { RouteObject } from 'react-router-dom';

const staffRoutes: RouteObject[] = [
  {
    index: true,
    element: <StaffPage />,
  },
  {
    path: 'create',
    element: <AddStaffPage />,
  },
];

export default staffRoutes; 