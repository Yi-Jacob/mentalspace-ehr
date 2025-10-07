import PracticeSettings from '../pages/practice-settings';
import { RouteObject } from 'react-router-dom';

const practiceSettingsRoutes: RouteObject[] = [
  {
    index: true,
    element: <PracticeSettings />,
  },  
  {
    path: 'practice-information',
    element: <PracticeSettings />,
  },
  {
    path: 'authentication-settings',
    element: <PracticeSettings />,
  },
  {
    path: 'scheduling',
    element: <PracticeSettings />,
  },
  {
    path: 'billing',
    element: <PracticeSettings />,
  },
  {
    path: 'notes-settings',
    element: <PracticeSettings />,
  },
  {
    path: 'staff-settings',
    element: <PracticeSettings />,
  },
  {
    path: 'client-settings',
    element: <PracticeSettings />,
  },
];

export default practiceSettingsRoutes;
