import CRM from '../pages/crm';
import { RouteObject } from 'react-router-dom';

const crmRoutes: RouteObject[] = [
  {
    path: '',
    element: <CRM />,
  },
];

export default crmRoutes; 