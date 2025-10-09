import { RouteObject } from 'react-router-dom';
import LibraryPage from '../pages/library';
import PortalFormCreatePage from '../pages/library/portal-forms/create';
import PortalFormViewPage from '../pages/library/portal-forms/view';
import PortalFormEditPage from '../pages/library/portal-forms/edit';
import PortalFormResponsePage from '../pages/library/portal-forms/response';
import OutcomeMeasureCreatePage from '../pages/library/outcome-measures/create';
import OutcomeMeasureViewPage from '../pages/library/outcome-measures/view';
import OutcomeMeasureEditPage from '../pages/library/outcome-measures/edit';
import OutcomeMeasureResponsePage from '../pages/library/outcome-measures/response';

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
  {
    path: 'outcome-measures/create',
    element: <OutcomeMeasureCreatePage />,
  },
  {
    path: 'outcome-measures/:id',
    element: <OutcomeMeasureViewPage />,
  },
  {
    path: 'outcome-measures/:id/edit',
    element: <OutcomeMeasureEditPage />,
  },
  {
    path: 'outcome-measures-response/:outcomeMeasureResponseId',
    element: <OutcomeMeasureResponsePage />,
  },
];

export default libraryRoutes;
