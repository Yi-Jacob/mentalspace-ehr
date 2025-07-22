
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
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

      <Tabs defaultValue="payers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="payers">Payers</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="statements">Statements</TabsTrigger>
        </TabsList>

        <TabsContent value="payers">
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
        </TabsContent>

        <TabsContent value="verification">
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
        </TabsContent>

        <TabsContent value="claims">
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
        </TabsContent>

        <TabsContent value="payments">
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
        </TabsContent>

        <TabsContent value="revenue">
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
        </TabsContent>

        <TabsContent value="reports">
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
        </TabsContent>

        <TabsContent value="statements">
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
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Billing;
