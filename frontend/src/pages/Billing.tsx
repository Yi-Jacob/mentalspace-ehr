
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PayerManagement from '@/components/billing/PayerManagement';
import InsuranceVerification from '@/components/billing/InsuranceVerification';
import ClaimsSubmission from '@/components/billing/ClaimsSubmission';
import PaymentProcessing from '@/components/billing/PaymentProcessing';
import RevenueReports from '@/components/billing/RevenueReports';
import BillingReports from '@/components/billing/BillingReports';
import StatementGeneration from '@/components/billing/StatementGeneration';

const Billing: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Billing Management</h1>
        <p className="text-gray-600 mt-2">
          Comprehensive billing system for insurance management, claims processing, and financial reporting
        </p>
      </div>

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
    </div>
  );
};

export default Billing;
