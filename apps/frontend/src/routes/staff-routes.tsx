import StaffPage from '@/pages/staff/StaffAllPage';
import CreateStaffPage from '@/pages/staff/StaffCreatePage';
import { RouteObject } from 'react-router-dom';

const staffRoutes: RouteObject[] = [
  {
    index: true,
    element: <StaffPage />,
  },
  {
    path: 'create',
    element: <CreateStaffPage />,
  },
];

export default staffRoutes; 