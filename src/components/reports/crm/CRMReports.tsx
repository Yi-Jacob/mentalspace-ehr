
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Phone, Users, TrendingUp, Mail, Download, UserPlus } from 'lucide-react';

const CRMReports = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  const crmMetrics = {
    totalReferralSources: 45,
    activeLeads: 28,
    convertedLeads: 18,
    newContacts: 12,
    conversionRate: 64.3
  };

  const leadsBySource = [
    { source: 'Dr. Sarah Johnson', leads: 8, converted: 6 },
    { source: 'Valley Medical Center', leads: 5, converted: 3 },
    { source: 'Website', leads: 7, converted: 4 },
    { source: 'Referrals', leads: 4, converted: 3 },
    { source: 'Phone Inquiries', leads: 4, converted: 2 }
  ];

  const conversionFunnel = [
    { stage: 'Initial Contact', count: 28, percentage: 100 },
    { stage: 'Scheduled Intake', count: 24, percentage: 85.7 },
    { stage: 'Attended Intake', count: 21, percentage: 75.0 },
    { stage: 'Ongoing Treatment', count: 18, percentage: 64.3 }
  ];

  const referralTrends = [
    { month: 'Jan', referrals: 15, conversions: 9, revenue: 14500 },
    { month: 'Feb', referrals: 18, conversions: 12, revenue: 18600 },
    { month: 'Mar', referrals: 22, conversions: 15, revenue: 23400 },
    { month: 'Apr', referrals: 28, conversions: 18, revenue: 28800 }
  ];

  const campaignPerformance = [
    { campaign: 'Provider Newsletter', sent: 150, opened: 103, clicked: 18, responses: 5 },
    { campaign: 'Holiday Outreach', sent: 89, opened: 67, clicked: 12, responses: 3 },
    { campaign: 'New Service Launch', sent: 120, opened: 84, clicked: 25, responses: 8 },
    { campaign: 'Referral Appreciation', sent: 75, opened: 58, clicked: 15, responses: 6 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">CRM Reports</h2>
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

      {/* Key CRM Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Referral Sources</p>
                <p className="text-2xl font-bold">{crmMetrics.totalReferralSources}</p>
              </div>
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Leads</p>
                <p className="text-2xl font-bold text-green-600">{crmMetrics.activeLeads}</p>
              </div>
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Converted Leads</p>
                <p className="text-2xl font-bold text-purple-600">{crmMetrics.convertedLeads}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Contacts</p>
                <p className="text-2xl font-bold text-yellow-600">{crmMetrics.newContacts}</p>
              </div>
              <Mail className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-red-600">{crmMetrics.conversionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="referrals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="referrals">Referral Analysis</TabsTrigger>
          <TabsTrigger value="leads">Lead Management</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="growth">Growth Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Referrals by Source</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={leadsBySource}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#8884d8" name="Total Leads" />
                  <Bar dataKey="converted" fill="#82ca9d" name="Converted" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referral Source Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadsBySource.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{source.source}</div>
                        <div className="text-sm text-gray-600">
                          {source.converted} / {source.leads} leads converted
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {((source.converted / source.leads) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">conversion rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conversionFunnel} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funnel Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionFunnel.map((stage, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{stage.stage}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{stage.count}</div>
                        <div className="text-xs text-gray-500">{stage.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="campaign" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sent" fill="#e0e0e0" name="Sent" />
                  <Bar dataKey="opened" fill="#8884d8" name="Opened" />
                  <Bar dataKey="clicked" fill="#82ca9d" name="Clicked" />
                  <Bar dataKey="responses" fill="#ffc658" name="Responses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignPerformance.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{campaign.campaign}</div>
                        <div className="text-sm text-gray-600">
                          {campaign.responses} responses from {campaign.sent} sent
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="font-semibold">{((campaign.opened / campaign.sent) * 100).toFixed(1)}%</span> open rate
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold">{((campaign.clicked / campaign.opened) * 100).toFixed(1)}%</span> click rate
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Referral & Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={referralTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="referrals" stackId="1" stroke="#8884d8" fill="#8884d8" name="Referrals" />
                  <Area type="monotone" dataKey="conversions" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Conversions" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">86.7%</div>
                  <div className="text-sm text-gray-600">Referral Growth Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">100%</div>
                  <div className="text-sm text-gray-600">Conversion Growth Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">98.6%</div>
                  <div className="text-sm text-gray-600">Revenue Growth Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMReports;
