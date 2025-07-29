import ClientList from '@/pages/clients/ClientAllPage';
import ClientDetailView from '@/pages/clients/ClientDetailPage';
import ClientAddPage from '@/pages/clients/ClientAddPage';
import ClientEditPage from '@/pages/clients/ClientEditPage';
import { RouteObject } from 'react-router-dom';

const clientsRoutes: RouteObject[] = [
  {
    index: true,
    element: <ClientList />,
  },
  {
    path: 'add',
    element: <ClientAddPage />,
  },
  {
    path: ':clientId',
    element: <ClientDetailView />,
  },
  {
    path: ':clientId/edit',
    element: <ClientEditPage />,
  },
];

export default clientsRoutes; 