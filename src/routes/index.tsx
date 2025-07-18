import { RouteObject } from 'react-router-dom';
import Auth from '../pages/Auth';
import NotFound from '../pages/NotFound';
import AuthenticationGate from './AuthenticationGate';
import authenticatedRoutes from './authenticated-routes';

const BaseRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '/*',
    element: <AuthenticationGate />,
    children: authenticatedRoutes,
  },
];

export default BaseRoutes; 