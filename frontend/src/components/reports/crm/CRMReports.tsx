
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { Button } from '@/components/shared/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Phone, Mail, TrendingUp, Download, RefreshCw } from 'lucide-react';

const CRMReports = () => {
  const [timeRange, setTimeRange] = useState('30');

  // Mock data for CRM reports - this would be replaced with real data hooks
  const mockData = {
    totalLeads: 145,
    convertedLeads: 67,
    conversionRate: 46.2,
    totalReferrals: 23,
    activeFollowUps: 18,
    leadsThisMonth: [
      { week: 'Week 1', leads: 28, conversions: 12 },
      { week: 'Week 2', leads: 35, conversions: 16 },
      { week: 'Week 3', leads: 42, conversions: 19 },
      { week: 'Week 4', leads: 40, conversions: 20 }
    ]
  };

  return (
    <div className="space-y-6">
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
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-blue-600">{mockData.totalLeads}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Converted</p>
                <p className="text-2xl font-bold text-green-600">{mockData.convertedLeads}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">{mockData.conversionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Referrals</p>
                <p className="text-2xl font-bold text-orange-600">{mockData.totalReferrals}</p>
              </div>
              <Phone className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Follow-ups</p>
                <p className="text-2xl font-bold text-pink-600">{mockData.activeFollowUps}</p>
              </div>
              <Mail className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Conversion Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Generation & Conversion Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockData.leadsThisMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="leads" stroke="#8884d8" strokeWidth={2} name="Leads" />
              <Line type="monotone" dataKey="conversions" stroke="#82ca9d" strokeWidth={2} name="Conversions" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium">Website Inquiries</span>
                <span className="font-bold text-blue-600">45</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Referrals</span>
                <span className="font-bold text-green-600">23</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium">Social Media</span>
                <span className="font-bold text-purple-600">18</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium">Direct Contact</span>
                <span className="font-bold text-orange-600">12</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Conversion Rate</span>
                <span className="font-bold text-green-600">{mockData.conversionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Time to Convert</span>
                <span className="font-bold text-blue-600">14 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Follow-up Response Rate</span>
                <span className="font-bold text-purple-600">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Referral Success Rate</span>
                <span className="font-bold text-orange-600">85%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CRMReports;
