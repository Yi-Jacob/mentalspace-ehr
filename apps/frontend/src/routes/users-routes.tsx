import UsersPage from '@/pages/users/UsersPage';
import RolesPage from '@/pages/staff/RolesPage';
import PermissionsPage from '@/pages/staff/PermissionsPage';
import { RouteObject } from 'react-router-dom';

const usersRoutes: RouteObject[] = [
  {
    index: true,
    element: <UsersPage />,
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

export default usersRoutes;
