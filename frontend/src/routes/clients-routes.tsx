import ClientList from '../pages/ClientList';
import ClientDetailView from '../components/ClientDetailView';
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