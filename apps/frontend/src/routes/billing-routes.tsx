import PayerManagement from '../pages/billing/payer-management';
import InsuranceVerification from '../pages/billing/insurance-verification';
import ClaimsSubmission from '../pages/billing/claims-submission';
import PaymentProcessing from '../pages/billing/payment-processing';
import StatementGeneration from '../pages/billing/statement-generation';
import { RouteObject } from 'react-router-dom';

const billingRoutes: RouteObject[] = [
  {
    index: true,
    element: <PayerManagement />,
  },
  {
    path: 'payer-management',
    element: <PayerManagement />,
  },
  {
    path: 'insurance-verification',
    element: <InsuranceVerification />,
  },
  {
    path: 'claims-submission',
    element: <ClaimsSubmission />,
  },
  {
    path: 'payment-processing',
    element: <PaymentProcessing />,
  },
  {
    path: 'statement-generation',
    element: <StatementGeneration />,
  },
];

export default billingRoutes; 