import PayerManagement from '../pages/billing/payer-management';
import InsuranceVerification from '../pages/billing/insurance-verification';
import ClaimsSubmission from '../pages/billing/claims-submission';
import PaymentProcessing from '../pages/billing/payment-processing';
import RevenueReports from '../pages/billing/revenue-reports';
import BillingReports from '../pages/billing/billing-reports';
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
    path: 'revenue-reports',
    element: <RevenueReports />,
  },
  {
    path: 'billing-reports',
    element: <BillingReports />,
  },
  {
    path: 'statement-generation',
    element: <StatementGeneration />,
  },
];

export default billingRoutes; 