import StaffPage from '@/pages/staff/StaffAllPage';
import CreateStaffPage from '@/pages/staff/StaffCreatePage';
import StaffDetailPage from '@/pages/staff/StaffDetailPage';
import StaffEditPage from '@/pages/staff/StaffEditPage';
import SupervisionPage from '@/pages/staff/SupervisionPage';
import RolesPage from '@/pages/staff/RolesPage';
import PermissionsPage from '@/pages/staff/PermissionsPage';
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
    path: 'supervision',
    element: <SupervisionPage />,
  },
  {
    path: ':staffId',
    element: <StaffDetailPage />,
  },
  {
    path: ':staffId/edit',
    element: <StaffEditPage />,
  },
  {
    path: 'roles',
    element: <RolesPage />,
  },
  {
    path: 'permissions',
    element: <PermissionsPage />,
  }
];

export default staffRoutes; 