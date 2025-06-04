
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Calendar, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ComplianceReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['compliance-reports', timeRange, reportType],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(timeRange));

      // Fetch comprehensive data for reporting
      const [
        { data: paymentData },
        { data: sessionData },
        { data: timeData },
        { data: complianceData }
      ] = await Promise.all([
        supabase
          .from('payment_calculations')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        supabase
          .from('session_completions')
          .select('*, provider:users(first_name, last_name)')
          .gte('session_date', startDate.toISOString().split('T')[0])
          .lte('session_date', endDate.toISOString().split('T')[0]),
        
        supabase
          .from('time_entries')
          .select('*, user:users(first_name, last_name)')
          .gte('entry_date', startDate.toISOString().split('T')[0])
          .lte('entry_date', endDate.toISOString().split('T')[0]),
        
        supabase
          .from('compliance_deadlines')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      ]);

      // Calculate metrics
      const totalPayroll = paymentData?.reduce((sum, payment) => sum + parseFloat(payment.gross_amount.toString()), 0) || 0;
      const totalSessions = sessionData?.length || 0;
      const signedSessions = sessionData?.filter(s => s.is_note_signed).length || 0;
      const complianceRate = totalSessions > 0 ? (signedSessions / totalSessions) * 100 : 0;

      // Group data for charts
      const dailyPayroll = paymentData?.reduce((acc: any, payment) => {
        const date = payment.created_at.split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, amount: 0, count: 0 };
        }
        acc[date].amount += parseFloat(payment.gross_amount.toString());
        acc[date].count += 1;
        return acc;
      }, {});

      const payrollTrend = Object.values(dailyPayroll || {}).sort((a: any, b: any) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Provider performance
      const providerStats = sessionData?.reduce((acc: any, session) => {
        const providerId = session.provider_id;
        const providerName = `${session.provider?.first_name} ${session.provider?.last_name}`;
        
        if (!acc[providerId]) {
          acc[providerId] = {
            name: providerName,
            totalSessions: 0,
            signedSessions: 0,
            earnings: 0
          };
        }
        
        acc[providerId].totalSessions += 1;
        if (session.is_note_signed) {
          acc[providerId].signedSessions += 1;
        }
        if (session.calculated_amount) {
          acc[providerId].earnings += parseFloat(session.calculated_amount.toString());
        }
        
        return acc;
      }, {});

      const providerPerformance = Object.values(providerStats || {}).map((provider: any) => ({
        ...provider,
        complianceRate: provider.totalSessions > 0 ? (provider.signedSessions / provider.totalSessions) * 100 : 0
      }));

      return {
        totalPayroll,
        totalSessions,
        signedSessions,
        complianceRate,
        payrollTrend,
        providerPerformance,
        paymentData,
        sessionData,
        timeData,
        complianceData
      };
    },
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (isLoading) {
    return <div className="text-center py-8">Loading compliance reports...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Compliance Reports</h2>
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
          
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="payroll">Payroll Analysis</SelectItem>
              <SelectItem value="compliance">Compliance Metrics</SelectItem>
              <SelectItem value="productivity">Productivity</SelectItem>
            </SelectContent>
          </Select>

          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                <p className="text-2xl font-bold text-green-600">
                  ${reportData?.totalPayroll.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {reportData?.totalSessions || 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {reportData?.complianceRate.toFixed(1) || 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Providers</p>
                <p className="text-2xl font-bold text-orange-600">
                  {reportData?.providerPerformance?.length || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData?.payrollTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: any) => [`$${value.toFixed(2)}`, 'Amount']}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Provider Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Provider Compliance Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData?.providerPerformance || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Compliance Rate']} />
                <Bar dataKey="complianceRate" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provider Earnings Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData?.providerPerformance || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="earnings"
                >
                  {(reportData?.providerPerformance || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, 'Earnings']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Provider Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Provider Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData?.providerPerformance?.map((provider: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-sm text-gray-600">
                      {provider.signedSessions} / {provider.totalSessions} sessions completed
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${provider.earnings.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">{provider.complianceRate.toFixed(1)}% compliance</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceReports;
