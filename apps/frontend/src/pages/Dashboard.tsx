
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LayoutDashboard,
  Users, 
  Calendar, 
  MessageSquare, 
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';

const Dashboard = () => {
  const stats = [
    {
      title: "Total Clients",
      value: "284",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Today's Appointments", 
      value: "18",
      change: "+3",
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Pending Messages",
      value: "7", 
      change: "-2",
      icon: MessageSquare,
      color: "text-orange-600"
    },
    {
      title: "Monthly Revenue",
      value: "$42,650",
      change: "+18%", 
      icon: DollarSign,
      color: "text-purple-600"
    }
  ];

  const recentActivities = [
    { time: "10:30 AM", activity: "New client registration - Sarah Johnson", type: "success" },
    { time: "11:15 AM", activity: "Appointment completed - Michael Chen", type: "success" },
    { time: "12:00 PM", activity: "Insurance claim submitted", type: "info" },
    { time: "01:30 PM", activity: "Medication review due - Lisa Anderson", type: "warning" },
    { time: "02:45 PM", activity: "Session note completed - David Brown", type: "success" }
  ];

  const upcomingAppointments = [
    { time: "3:00 PM", client: "Emma Wilson", type: "Initial Consultation" },
    { time: "4:00 PM", client: "James Rodriguez", type: "Follow-up Session" },
    { time: "5:00 PM", client: "Maria Garcia", type: "Therapy Session" }
  ];

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description={`${new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-0 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Activities */}
        <Card className="border-0 shadow-md shadow-my-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-150">
                  <div className={`flex-shrink-0 h-2 w-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 hover:from-blue-100 hover:to-green-100 transition-all duration-200">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.client}</p>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-700">{appointment.time}</p>
                    <CheckCircle className="h-4 w-4 text-green-600 ml-auto mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
