
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, FileText, Download, RefreshCw } from 'lucide-react';

const ExecutiveDashboard = () => {
  const [timeRange, setTimeRange] = useState('30');

  // Mock data - in real implementation, this would come from your data hooks
  const kpiData = {
    totalRevenue: 125450,
    revenueChange: 12.5,
    totalPatients: 342,
    patientsChange: 8.2,
    appointmentsCompleted: 256,
    appointmentsChange: -2.1,
    notesCompleted: 240,
    notesChange: 15.3
  };

  const revenueData = [
    { month: 'Jan', revenue: 95000, expenses: 65000, net: 30000 },
    { month: 'Feb', revenue: 102000, expenses: 68000, net: 34000 },
    { month: 'Mar', revenue: 118000, expenses: 72000, net: 46000 },
    { month: 'Apr', revenue: 125450, expenses: 75000, net: 50450 }
  ];

  const patientDemographics = [
    { name: 'Adults (18-65)', value: 65, count: 222 },
    { name: 'Adolescents (13-17)', value: 20, count: 68 },
    { name: 'Children (5-12)', value: 10, count: 34 },
    { name: 'Seniors (65+)', value: 5, count: 18 }
  ];

  const providerUtilization = [
    { name: 'Dr. Smith', appointments: 85, capacity: 100, utilization: 85 },
    { name: 'Dr. Johnson', appointments: 78, capacity: 100, utilization: 78 },
    { name: 'Dr. Brown', appointments: 92, capacity: 100, utilization: 92 },
    { name: 'Dr. Davis', appointments: 68, capacity: 100, utilization: 68 }
  ];

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
                  {Math.abs(change)}%
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
          
          <Button variant="outline" size="sm">
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
          value={kpiData.totalRevenue}
          change={kpiData.revenueChange}
          icon={DollarSign}
          format="currency"
        />
        <KPICard
          title="Active Patients"
          value={kpiData.totalPatients}
          change={kpiData.patientsChange}
          icon={Users}
        />
        <KPICard
          title="Appointments Completed"
          value={kpiData.appointmentsCompleted}
          change={kpiData.appointmentsChange}
          icon={Calendar}
        />
        <KPICard
          title="Notes Completed"
          value={kpiData.notesCompleted}
          change={kpiData.notesChange}
          icon={FileText}
        />
      </div>

      {/* Revenue Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Expenses Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="expenses" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Patient Demographics & Provider Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={patientDemographics}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {patientDemographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provider Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={providerUtilization}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                <Bar dataKey="utilization" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
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
                <span className="text-sm">Patient Satisfaction</span>
                <span className="font-semibold text-green-600">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Note Completion Rate</span>
                <span className="font-semibold text-green-600">87%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Revenue Growth</span>
                <span className="font-semibold text-green-600">+12.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">No-Show Rate</span>
                <span className="font-semibold text-yellow-600">8.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Response Time</span>
                <span className="font-semibold text-yellow-600">2.1 hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Claims Denial Rate</span>
                <span className="font-semibold text-yellow-600">3.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Urgent Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Overdue Notes</span>
                <span className="font-semibold text-red-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Outstanding Claims</span>
                <span className="font-semibold text-red-600">$8,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">License Renewals Due</span>
                <span className="font-semibold text-red-600">2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
