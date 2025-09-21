import PracticeSettings from '../pages/practice-settings';
import { RouteObject } from 'react-router-dom';

const practiceSettingsRoutes: RouteObject[] = [
  {
    index: true,
    element: <PracticeSettings />,
  },
  {
    path: 'account-access',
    element: <PracticeSettings />,
  },
  {
    path: 'portal-scheduling',
    element: <PracticeSettings />,
  },
  {
    path: 'notes',
    element: <PracticeSettings />,
  },
  {
    path: 'billing',
    element: <PracticeSettings />,
  },
];

export default practiceSettingsRoutes;
