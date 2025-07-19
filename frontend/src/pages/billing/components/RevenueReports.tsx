
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const RevenueReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  const { data: revenueData, isLoading } = useQuery({
    queryKey: ['revenue-reports', timeRange, reportType],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(timeRange));

      // Fetch payment data for revenue calculations
      const { data: payments, error } = await supabase
        .from('payments')
        .select(`
          *,
          clients (first_name, last_name),
          payers (name),
          users!payments_processed_by_fkey (first_name, last_name)
        `)
        .eq('status', 'completed')
        .gte('payment_date', startDate.toISOString().split('T')[0])
        .lte('payment_date', endDate.toISOString().split('T')[0]);

      if (error) throw error;

      // Calculate revenue metrics
      const totalRevenue = payments?.reduce((sum, payment) => sum + parseFloat(payment.payment_amount.toString()), 0) || 0;
      const totalPayments = payments?.length || 0;
      const averagePayment = totalPayments > 0 ? totalRevenue / totalPayments : 0;

      // Group by date for trend analysis
      const dailyRevenue = payments?.reduce((acc: any, payment) => {
        const date = payment.payment_date;
        if (!acc[date]) {
          acc[date] = { date, revenue: 0, count: 0 };
        }
        acc[date].revenue += parseFloat(payment.payment_amount.toString());
        acc[date].count += 1;
        return acc;
      }, {});

      const trendData = Object.values(dailyRevenue || {}).sort((a: any, b: any) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Group by payer
      const payerRevenue = payments?.reduce((acc: any, payment) => {
        const payerName = payment.payers?.name || 'Patient Pay';
        if (!acc[payerName]) {
          acc[payerName] = { name: payerName, revenue: 0, count: 0 };
        }
        acc[payerName].revenue += parseFloat(payment.payment_amount.toString());
        acc[payerName].count += 1;
        return acc;
      }, {});

      const payerData = Object.values(payerRevenue || {});

      return {
        totalRevenue,
        totalPayments,
        averagePayment,
        trendData,
        payerData,
      };
    },
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (isLoading) {
    return <div className="text-center py-8">Loading revenue reports...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Revenue Reports</h2>
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
              <SelectItem value="providers">By Provider</SelectItem>
              <SelectItem value="services">By Service</SelectItem>
              <SelectItem value="payers">By Payer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${revenueData?.totalRevenue.toFixed(2) || '0.00'}
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
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-blue-600">
                  {revenueData?.totalPayments || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Payment</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${revenueData?.averagePayment.toFixed(2) || '0.00'}
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
                <p className="text-sm font-medium text-gray-600">Period</p>
                <p className="text-2xl font-bold text-orange-600">
                  {timeRange} days
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData?.trendData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: any) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue by Payer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Payer</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueData?.payerData || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {(revenueData?.payerData || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(revenueData?.payerData || []).map((payer: any, index: number) => (
                <div key={payer.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{payer.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${payer.revenue.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">{payer.count} payments</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RevenueReports;
