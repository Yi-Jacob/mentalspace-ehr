
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, AlertCircle, Download } from 'lucide-react';

const BillingReports = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  const billingMetrics = {
    totalRevenue: 98450,
    collectedRevenue: 87230,
    pendingClaims: 15420,
    deniedClaims: 2850,
    collectionRate: 88.6
  };

  const revenueByPayer = [
    { payer: 'Blue Cross Blue Shield', amount: 34560, percentage: 35.1 },
    { payer: 'Aetna', amount: 28340, percentage: 28.8 },
    { payer: 'Medicare', amount: 18750, percentage: 19.0 },
    { payer: 'Self Pay', amount: 12450, percentage: 12.6 },
    { payer: 'Other', amount: 4350, percentage: 4.5 }
  ];

  const monthlyRevenue = [
    { month: 'Jan', billed: 85000, collected: 78000, outstanding: 7000 },
    { month: 'Feb', billed: 92000, collected: 84500, outstanding: 7500 },
    { month: 'Mar', billed: 88000, collected: 81200, outstanding: 6800 },
    { month: 'Apr', billed: 98450, collected: 87230, outstanding: 11220 }
  ];

  const claimsStatus = [
    { status: 'Paid', count: 456, amount: 87230 },
    { status: 'Pending', count: 89, amount: 15420 },
    { status: 'Denied', count: 23, amount: 2850 },
    { status: 'Appeal', count: 12, amount: 1950 }
  ];

  const agingReport = [
    { category: '0-30 days', amount: 45230, count: 234 },
    { category: '31-60 days', amount: 28450, count: 156 },
    { category: '61-90 days', amount: 12340, count: 89 },
    { category: '91+ days', amount: 8970, count: 67 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Billing Reports</h2>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Key Billing Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${billingMetrics.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collected</p>
                <p className="text-2xl font-bold text-green-600">${billingMetrics.collectedRevenue.toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Claims</p>
                <p className="text-2xl font-bold text-yellow-600">${billingMetrics.pendingClaims.toLocaleString()}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Denied Claims</p>
                <p className="text-2xl font-bold text-red-600">${billingMetrics.deniedClaims.toLocaleString()}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold text-purple-600">{billingMetrics.collectionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="claims">Claims Status</TabsTrigger>
          <TabsTrigger value="aging">Aging Report</TabsTrigger>
          <TabsTrigger value="payers">Payer Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                  <Area type="monotone" dataKey="billed" stackId="1" stroke="#8884d8" fill="#8884d8" name="Billed" />
                  <Area type="monotone" dataKey="collected" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Collected" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Individual Therapy</span>
                    <span className="font-semibold">$45,230</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Group Therapy</span>
                    <span className="font-semibold">$28,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Initial Assessments</span>
                    <span className="font-semibold">$18,770</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Crisis Interventions</span>
                    <span className="font-semibold">$6,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Session Rate</span>
                    <span className="font-semibold">$158</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sessions per Day</span>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly Growth</span>
                    <span className="font-semibold text-green-600">+8.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Year-over-Year</span>
                    <span className="font-semibold text-green-600">+15.4%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="claims" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Claims Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={claimsStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Claims Processing Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {claimsStatus.map((claim, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <div className="font-medium">{claim.status} Claims</div>
                        <div className="text-sm text-gray-600">
                          {claim.count} claims
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${claim.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">
                        ${(claim.amount / claim.count).toFixed(0)} avg
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aging" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Accounts Receivable Aging</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={agingReport}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aging Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agingReport.map((aging, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{aging.category}</div>
                        <div className="text-sm text-gray-600">
                          {aging.count} outstanding claims
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${aging.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">
                        ${(aging.amount / aging.count).toFixed(0)} avg
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Payer</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueByPayer}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ payer, percentage }) => `${payer} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {revenueByPayer.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payer Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueByPayer.map((payer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{payer.payer}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">${payer.amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{payer.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingReports;
