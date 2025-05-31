
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CreditCard, 
  FileText, 
  Building2, 
  Receipt, 
  BarChart3, 
  CheckCircle,
  DollarSign
} from 'lucide-react';
import PayerManagement from '@/components/billing/PayerManagement';
import InsuranceVerification from '@/components/billing/InsuranceVerification';
import ClaimsManagement from '@/components/billing/ClaimsManagement';
import PaymentProcessing from '@/components/billing/PaymentProcessing';
import RevenueReports from '@/components/billing/RevenueReports';
import BillingReports from '@/components/billing/BillingReports';
import StatementGeneration from '@/components/billing/StatementGeneration';

const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing Management</h1>
          <p className="text-gray-600">
            Comprehensive billing system for insurance management, claims processing, and financial reporting
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="payers" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Payers</span>
            </TabsTrigger>
            <TabsTrigger value="verification" className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Verification</span>
            </TabsTrigger>
            <TabsTrigger value="claims" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Claims</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Payments</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Revenue</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="statements" className="flex items-center space-x-2">
              <Receipt className="h-4 w-4" />
              <span>Statements</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <BillingOverview />
          </TabsContent>

          <TabsContent value="payers">
            <PayerManagement />
          </TabsContent>

          <TabsContent value="verification">
            <InsuranceVerification />
          </TabsContent>

          <TabsContent value="claims">
            <ClaimsManagement />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentProcessing />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueReports />
          </TabsContent>

          <TabsContent value="reports">
            <BillingReports />
          </TabsContent>

          <TabsContent value="statements">
            <StatementGeneration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const BillingOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Claims Submitted</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">234</div>
          <p className="text-xs text-muted-foreground">
            +12% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">94.2%</div>
          <p className="text-xs text-muted-foreground">
            +2.1% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Outstanding A/R</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$12,845.67</div>
          <p className="text-xs text-muted-foreground">
            -5.3% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
