import ClientList from '@/pages/clients';
import ClientDetailView from '@/pages/clients/[id]';
import { RouteObject } from 'react-router-dom';

const clientsRoutes: RouteObject[] = [
  {
    index: true,
    element: <ClientList />,
  },
  {
    path: ':clientId',
    element: <ClientDetailView />,
  },
];

export default clientsRoutes; 