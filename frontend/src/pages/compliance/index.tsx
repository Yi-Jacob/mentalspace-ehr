
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Calculator, Clock, FileText, Users, DollarSign, AlertTriangle } from 'lucide-react';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import PageTabs from '@/components/ui/PageTabs';
import ProviderCompensationConfig from './components/ProviderCompensationConfig';
import SessionCompletionTracking from './components/SessionCompletionTracking';
import TimeTracking from './components/TimeTracking';
import PaymentCalculations from './components/PaymentCalculations';
import ComplianceDeadlines from './components/ComplianceDeadlines';
import ComplianceReports from './components/ComplianceReports';

const ComplianceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Shield}
        title="Compliance Management"
        description="Comprehensive compensation and compliance tracking system"
      />

      {/* Overview Cards */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Providers</p>
                  <p className="text-2xl font-bold text-purple-600">24</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Notes</p>
                  <p className="text-2xl font-bold text-orange-600">12</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Weekly Payroll</p>
                  <p className="text-2xl font-bold text-green-600">$45,280</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <PageTabs
        value={activeTab}
        onValueChange={setActiveTab}
        items={[
          {
            id: 'overview',
            label: 'Overview',
            icon: Calculator,
            content: (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Note signed by Dr. Johnson - $150.00 earned</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">Deadline reminder sent to 3 providers</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Weekly payroll processed - $45,280</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Compliance Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Notes Compliance</span>
                          <span className="text-sm font-semibold text-green-600">94%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Payment Processing</span>
                          <span className="text-sm font-semibold text-blue-600">98%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          },
          {
            id: 'compensation',
            label: 'Compensation',
            icon: DollarSign,
            content: <ProviderCompensationConfig />
          },
          {
            id: 'sessions',
            label: 'Sessions',
            icon: FileText,
            content: <SessionCompletionTracking />
          },
          {
            id: 'time',
            label: 'Time',
            icon: Clock,
            content: <TimeTracking />
          },
          {
            id: 'payments',
            label: 'Payments',
            icon: Calculator,
            content: <PaymentCalculations />
          },
          {
            id: 'deadlines',
            label: 'Deadlines',
            icon: AlertTriangle,
            content: <ComplianceDeadlines />
          },
          {
            id: 'reports',
            label: 'Reports',
            icon: FileText,
            content: <ComplianceReports />
          }
        ]}
      />
    </PageLayout>
  );
};

export default ComplianceManagement;
