import StaffPage from '../pages/StaffPage';
import AddStaffPage from '../pages/AddStaffPage';
import { RouteObject } from 'react-router-dom';

const staffRoutes: RouteObject[] = [
  {
    index: true,
    element: <StaffPage />,
  },
  {
    path: 'add',
    element: <AddStaffPage />,
  },
];

export default staffRoutes; 