import { RouteObject } from 'react-router-dom';
import LibraryPage from '../pages/library';

const libraryRoutes: RouteObject[] = [
  {
    index: true,
    element: <LibraryPage />,
  },
];

export default libraryRoutes;
