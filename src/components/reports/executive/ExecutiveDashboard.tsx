
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, FileText, Download, RefreshCw } from 'lucide-react';
import { useExecutiveDashboardData } from '@/hooks/useReportData';

const ExecutiveDashboard = () => {
  const [timeRange, setTimeRange] = useState('30');
  
  const { data: dashboardData, isLoading, error, refetch } = useExecutiveDashboardData(timeRange);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const KPICard = ({ title, value, change, icon: Icon, format = 'number' }) => {
    const isPositive = change > 0;
    const formattedValue = format === 'currency' ? `$${value.toLocaleString()}` : value.toLocaleString();
    
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold">{formattedValue}</p>
              <div className="flex items-center mt-2">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(change).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
            <Icon className="h-8 w-8 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading executive dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading dashboard data</p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-500">No dashboard data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Executive Dashboard</h2>
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
          
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Dashboard</span>
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={dashboardData.totalRevenue}
          change={dashboardData.revenueChange}
          icon={DollarSign}
          format="currency"
        />
        <KPICard
          title="Active Patients"
          value={dashboardData.totalPatients}
          change={dashboardData.patientsChange}
          icon={Users}
        />
        <KPICard
          title="Appointments Completed"
          value={dashboardData.appointmentsCompleted}
          change={dashboardData.appointmentsChange}
          icon={Calendar}
        />
        <KPICard
          title="Notes Completed"
          value={dashboardData.notesCompleted}
          change={dashboardData.notesChange}
          icon={FileText}
        />
      </div>

      {/* Revenue Trends */}
      {dashboardData.revenueData && dashboardData.revenueData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Expenses Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="expenses" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Patient Demographics & Provider Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dashboardData.patientDemographics && dashboardData.patientDemographics.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Patient Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardData.patientDemographics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${Math.round((value / dashboardData.patientDemographics.reduce((sum, item) => sum + item.value, 0)) * 100)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardData.patientDemographics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {dashboardData.providerUtilization && dashboardData.providerUtilization.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Provider Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.providerUtilization}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                  <Bar dataKey="utilization" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Revenue Growth</span>
                <span className={`font-semibold ${dashboardData.revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {dashboardData.revenueChange > 0 ? '+' : ''}{dashboardData.revenueChange.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Patient Growth</span>
                <span className={`font-semibold ${dashboardData.patientsChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {dashboardData.patientsChange > 0 ? '+' : ''}{dashboardData.patientsChange.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Notes Growth</span>
                <span className={`font-semibold ${dashboardData.notesChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {dashboardData.notesChange > 0 ? '+' : ''}{dashboardData.notesChange.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Revenue</span>
                <span className="font-semibold text-blue-600">${dashboardData.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Patients</span>
                <span className="font-semibold text-blue-600">{dashboardData.totalPatients}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed Appointments</span>
                <span className="font-semibold text-blue-600">{dashboardData.appointmentsCompleted}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Report Period</span>
                <span className="font-semibold">{timeRange} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Providers Tracked</span>
                <span className="font-semibold">{dashboardData.providerUtilization?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Data Source</span>
                <span className="font-semibold text-green-600">Live</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
