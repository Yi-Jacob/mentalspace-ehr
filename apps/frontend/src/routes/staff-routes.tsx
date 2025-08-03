import StaffPage from '@/pages/staff/StaffAllPage';
import CreateStaffPage from '@/pages/staff/StaffCreatePage';
import StaffDetailPage from '@/pages/staff/StaffDetailPage';
import StaffEditPage from '@/pages/staff/StaffEditPage';
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
  {
    path: ':staffId',
    element: <StaffDetailPage />,
  },
  {
    path: ':staffId/edit',
    element: <StaffEditPage />,
  },
];

export default staffRoutes; 