import Billing from '../pages/Billing';
import { RouteObject } from 'react-router-dom';

const billingRoutes: RouteObject[] = [
  {
    index: true,
    element: <Billing />,
  },
];

export default billingRoutes; 