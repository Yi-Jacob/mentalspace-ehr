
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/basic/card';
import { CreditCard, Building2, Shield, FileText, CreditCard as PaymentIcon, TrendingUp, BarChart3, Receipt } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import PageTabs from '@/components/basic/PageTabs';
import PayerManagement from '@/pages/billing/components/PayerManagement';
import InsuranceVerification from '@/pages/billing/components/InsuranceVerification';
import ClaimsSubmission from '@/pages/billing/components/ClaimsSubmission';
import PaymentProcessing from '@/pages/billing/components/PaymentProcessing';
import RevenueReports from '@/pages/billing/components/RevenueReports';
import BillingReports from '@/pages/billing/components/BillingReports';
import StatementGeneration from '@/pages/billing/components/StatementGeneration';

const Billing: React.FC = () => {
  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={CreditCard}
        title="Billing Management"
        description="Comprehensive billing system for insurance management, claims processing, and financial reporting"
      />

      <PageTabs
        defaultValue="payers"

        items={[
          {
            id: 'payers',
            label: 'Payers',
            icon: Building2,
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Payer Management</CardTitle>
                  <CardDescription>
                    Manage insurance companies, contracts, and fee schedules
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PayerManagement />
                </CardContent>
              </Card>
            )
          },
          {
            id: 'verification',
            label: 'Verification',
            icon: Shield,
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Insurance Verification</CardTitle>
                  <CardDescription>
                    Verify benefits and manage authorization requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InsuranceVerification />
                </CardContent>
              </Card>
            )
          },
          {
            id: 'claims',
            label: 'Claims',
            icon: FileText,
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Claims Submission</CardTitle>
                  <CardDescription>
                    Submit and track insurance claims
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ClaimsSubmission />
                </CardContent>
              </Card>
            )
          },
          {
            id: 'payments',
            label: 'Payments',
            icon: PaymentIcon,
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Processing</CardTitle>
                  <CardDescription>
                    Process payments and manage patient accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentProcessing />
                </CardContent>
              </Card>
            )
          },
          {
            id: 'revenue',
            label: 'Revenue',
            icon: TrendingUp,
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Reports</CardTitle>
                  <CardDescription>
                    Track revenue by provider, service type, and payer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RevenueReports />
                </CardContent>
              </Card>
            )
          },
          {
            id: 'reports',
            label: 'Reports',
            icon: BarChart3,
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Billing Reports</CardTitle>
                  <CardDescription>
                    Claims status, denials, and accounts receivable reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <BillingReports />
                </CardContent>
              </Card>
            )
          },
          {
            id: 'statements',
            label: 'Statements',
            icon: Receipt,
            content: (
              <Card>
                <CardHeader>
                  <CardTitle>Statement Generation</CardTitle>
                  <CardDescription>
                    Generate and send patient statements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StatementGeneration />
                </CardContent>
              </Card>
            )
          }
        ]}
      />
    </PageLayout>
  );
};

export default Billing;
