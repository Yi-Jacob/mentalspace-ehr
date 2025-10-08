import { RouteObject } from 'react-router-dom';
import LibraryPage from '../pages/library';
import PortalFormCreatePage from '../pages/library/portal-forms/create';
import PortalFormViewPage from '../pages/library/portal-forms/view';
import PortalFormEditPage from '../pages/library/portal-forms/edit';
import PortalFormResponsePage from '../pages/library/portal-forms/response';

const libraryRoutes: RouteObject[] = [
  {
    index: true,
    element: <LibraryPage />,
  },
  {
    path: 'portal-forms/create',
    element: <PortalFormCreatePage />,
  },
  {
    path: 'portal-forms/:id',
    element: <PortalFormViewPage />,
  },
  {
    path: 'portal-forms/:id/edit',
    element: <PortalFormEditPage />,
  },
  {
    path: 'portal-forms-response/:portalFormResponseId',
    element: <PortalFormResponsePage />,
  },
];

export default libraryRoutes;
