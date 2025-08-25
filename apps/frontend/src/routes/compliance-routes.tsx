import ProviderCompensationConfig from '../pages/compliance/ProviderCompensationConfig';
import SessionCompletionTracking from '../pages/compliance/SessionCompletionTracking';
import TimeTracking from '../pages/compliance/TimeTracking';
import PaymentCalculations from '../pages/compliance/PaymentCalculations';
import ComplianceDeadlines from '../pages/compliance/ComplianceDeadlines';
import { RouteObject } from 'react-router-dom';

const complianceRoutes: RouteObject[] = [
  {
    path: 'compensation',
    element: <ProviderCompensationConfig />,
  },
  {
    path: 'sessions',
    element: <SessionCompletionTracking />,
  },
  {
    path: 'time-tracking',
    element: <TimeTracking />,
  },
  {
    path: 'payments',
    element: <PaymentCalculations />,
  },
  {
    path: 'deadlines',
    element: <ComplianceDeadlines />,
  },
];

export default complianceRoutes; 