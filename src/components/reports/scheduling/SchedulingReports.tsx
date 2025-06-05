
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Clock, Users, TrendingDown, Download, CheckCircle } from 'lucide-react';

const SchedulingReports = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [reportType, setReportType] = useState('overview');

  const schedulingMetrics = {
    totalAppointments: 456,
    completedAppointments: 398,
    cancelledAppointments: 34,
    noShowAppointments: 24,
    utilizationRate: 87.3
  };

  const appointmentsByType = [
    { type: 'Individual Therapy', count: 256, percentage: 56.1 },
    { type: 'Initial Assessment', count: 89, percentage: 19.5 },
    { type: 'Group Therapy', count: 67, percentage: 14.7 },
    { type: 'Crisis Session', count: 28, percentage: 6.1 },
    { type: 'Family Therapy', count: 16, percentage: 3.5 }
  ];

  const dailyUtilization = [
    { day: 'Monday', scheduled: 24, completed: 22, utilization: 91.7 },
    { day: 'Tuesday', scheduled: 26, completed: 23, utilization: 88.5 },
    { day: 'Wednesday', scheduled: 25, completed: 21, utilization: 84.0 },
    { day: 'Thursday', scheduled: 27, completed: 25, utilization: 92.6 },
    { day: 'Friday', scheduled: 23, completed: 20, utilization: 87.0 }
  ];

  const providerSchedules = [
    { provider: 'Dr. Smith', capacity: 40, scheduled: 38, completed: 35, utilization: 87.5 },
    { provider: 'Dr. Johnson', capacity: 40, scheduled: 36, completed: 32, utilization: 80.0 },
    { provider: 'Dr. Brown', capacity: 35, scheduled: 33, completed: 31, utilization: 88.6 },
    { provider: 'Dr. Davis', capacity: 30, scheduled: 28, completed: 24, utilization: 80.0 }
  ];

  const timeSlotAnalysis = [
    { time: '8:00 AM', bookings: 12, noShows: 1, cancellations: 0 },
    { time: '9:00 AM', bookings: 18, noShows: 2, cancellations: 1 },
    { time: '10:00 AM', bookings: 22, noShows: 1, cancellations: 2 },
    { time: '11:00 AM', bookings: 20, noShows: 3, cancellations: 1 },
    { time: '1:00 PM', bookings: 24, noShows: 2, cancellations: 2 },
    { time: '2:00 PM', bookings: 26, noShows: 1, cancellations: 3 },
    { time: '3:00 PM', bookings: 23, noShows: 4, cancellations: 1 },
    { time: '4:00 PM', bookings: 19, noShows: 2, cancellations: 2 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scheduling Reports</h2>
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

      {/* Key Scheduling Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold">{schedulingMetrics.totalAppointments}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{schedulingMetrics.completedAppointments}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-yellow-600">{schedulingMetrics.cancelledAppointments}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">No Shows</p>
                <p className="text-2xl font-bold text-red-600">{schedulingMetrics.noShowAppointments}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
                <p className="text-2xl font-bold text-purple-600">{schedulingMetrics.utilizationRate}%</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="utilization" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="utilization">Utilization</TabsTrigger>
          <TabsTrigger value="appointments">Appointment Types</TabsTrigger>
          <TabsTrigger value="providers">Provider Schedules</TabsTrigger>
          <TabsTrigger value="timeslots">Time Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="utilization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Utilization Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dailyUtilization}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Utilization Rate']} />
                  <Bar dataKey="utilization" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Utilization Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyUtilization.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{day.day}</div>
                        <div className="text-sm text-gray-600">
                          {day.completed} / {day.scheduled} appointments
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{day.utilization}%</div>
                      <div className="text-sm text-gray-600">utilization</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointments by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={appointmentsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percentage }) => `${type} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {appointmentsByType.map((entry, index) => (
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
                <CardTitle>Appointment Type Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointmentsByType.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{type.type}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{type.count}</div>
                        <div className="text-xs text-gray-500">{type.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider Schedule Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={providerSchedules}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="provider" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="capacity" fill="#e0e0e0" name="Capacity" />
                  <Bar dataKey="scheduled" fill="#8884d8" name="Scheduled" />
                  <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Provider Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providerSchedules.map((provider, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{provider.provider}</div>
                        <div className="text-sm text-gray-600">
                          {provider.completed} / {provider.scheduled} completed
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{provider.utilization}%</div>
                      <div className="text-sm text-gray-600">utilization</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeslots" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Time Slot Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={timeSlotAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
                  <Bar dataKey="noShows" fill="#ff8042" name="No Shows" />
                  <Bar dataKey="cancellations" fill="#ffbb28" name="Cancellations" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Peak Hours Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">2:00 PM</div>
                  <div className="text-sm text-gray-600">Busiest Hour</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">3:00 PM</div>
                  <div className="text-sm text-gray-600">Highest No-Shows</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">2:00 PM</div>
                  <div className="text-sm text-gray-600">Most Cancellations</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchedulingReports;
