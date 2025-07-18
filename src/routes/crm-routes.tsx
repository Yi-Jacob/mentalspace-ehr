import CRM from '../pages/CRM';
import { RouteObject } from 'react-router-dom';

const crmRoutes: RouteObject[] = [
  {
    path: '',
    element: <CRM />,
  },
];

export default crmRoutes; 