import { RouteObject } from 'react-router-dom';
import Login from '../pages/auth/Login';
import NotFound from '../pages/NotFound';
import SetPassword from '../pages/auth/SetPassword';
import AuthenticationGate from './AuthenticationGate';
import authenticatedRoutes from './authenticated-routes';

const BaseRoutes: RouteObject[] = [
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/auth/set-password',
    element: <SetPassword />,
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