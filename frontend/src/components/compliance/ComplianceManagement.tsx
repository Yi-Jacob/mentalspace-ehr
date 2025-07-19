
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shared/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Calculator, Clock, FileText, Users, DollarSign, AlertTriangle } from 'lucide-react';
import ProviderCompensationConfig from './ProviderCompensationConfig';
import SessionCompletionTracking from './SessionCompletionTracking';
import TimeTracking from './TimeTracking';
import PaymentCalculations from './PaymentCalculations';
import ComplianceDeadlines from './ComplianceDeadlines';
import ComplianceReports from './ComplianceReports';

const ComplianceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-purple-200/50 transform rotate-3">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Compliance Management
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Comprehensive compensation and compliance tracking system
            </p>
          </div>
        </div>

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

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <TabsList className="grid w-full grid-cols-7 bg-transparent gap-2">
              <TabsTrigger 
                value="overview" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="compensation" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Compensation</span>
              </TabsTrigger>
              <TabsTrigger 
                value="sessions" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Sessions</span>
              </TabsTrigger>
              <TabsTrigger 
                value="time" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Time</span>
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="deadlines" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Deadlines</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <TabsContent value="overview" className="space-y-6 mt-0">
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
                        <span className="text-sm">Documentation Compliance</span>
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
            </TabsContent>

            <TabsContent value="compensation" className="mt-0">
              <ProviderCompensationConfig />
            </TabsContent>

            <TabsContent value="sessions" className="mt-0">
              <SessionCompletionTracking />
            </TabsContent>

            <TabsContent value="time" className="mt-0">
              <TimeTracking />
            </TabsContent>

            <TabsContent value="payments" className="mt-0">
              <PaymentCalculations />
            </TabsContent>

            <TabsContent value="deadlines" className="mt-0">
              <ComplianceDeadlines />
            </TabsContent>

            <TabsContent value="reports" className="mt-0">
              <ComplianceReports />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ComplianceManagement;
