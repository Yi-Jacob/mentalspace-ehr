
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, Shield, DollarSign, Calendar, Phone, TrendingUp, BarChart3 } from 'lucide-react';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import ClinicalReports from './components/clinical/ClinicalReports';
import StaffReports from './components/staff/StaffReports';
import ComplianceReports from './components/compliance/ComplianceReports';
import BillingReports from './components/billing/BillingReports';
import SchedulingReports from './components/scheduling/SchedulingReports';
import CRMReports from './components/crm/CRMReports';
import ExecutiveDashboard from './components/executive/ExecutiveDashboard';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const reportCategories = [
    {
      id: 'dashboard',
      name: 'Executive Dashboard',
      icon: TrendingUp,
      description: 'High-level practice overview and KPIs',
      color: 'text-purple-600'
    },
    {
      id: 'clinical',
      name: 'Clinical Reports',
      icon: FileText,
      description: 'Patient care, outcomes, and clinical metrics',
      color: 'text-blue-600'
    },
    {
      id: 'staff',
      name: 'Staff Reports',
      icon: Users,
      description: 'Staff performance, productivity, and management',
      color: 'text-green-600'
    },
    {
      id: 'compliance',
      name: 'Compliance Reports',
      icon: Shield,
      description: 'Regulatory compliance and audit trails',
      color: 'text-red-600'
    },
    {
      id: 'billing',
      name: 'Billing Reports',
      icon: DollarSign,
      description: 'Financial performance and revenue analysis',
      color: 'text-yellow-600'
    },
    {
      id: 'scheduling',
      name: 'Scheduling Reports',
      icon: Calendar,
      description: 'Appointment patterns and utilization',
      color: 'text-indigo-600'
    },
    {
      id: 'crm',
      name: 'CRM Reports',
      icon: Phone,
      description: 'Referrals, leads, and growth metrics',
      color: 'text-pink-600'
    }
  ];

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={BarChart3}
        title="Practice Reports"
        description="Comprehensive analytics and insights across all practice operations"

      />

      {/* Report Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {reportCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeTab === category.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setActiveTab(category.id)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <IconComponent className={`h-8 w-8 ${category.color}`} />
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          {reportCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.name.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <ExecutiveDashboard />
        </TabsContent>

        <TabsContent value="clinical" className="space-y-6">
          <ClinicalReports />
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <StaffReports />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <ComplianceReports />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <BillingReports />
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-6">
          <SchedulingReports />
        </TabsContent>

        <TabsContent value="crm" className="space-y-6">
          <CRMReports />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Reports;
