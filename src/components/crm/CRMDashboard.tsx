
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Phone, Mail, Calendar, DollarSign } from 'lucide-react';

const CRMDashboard = () => {
  const stats = [
    {
      title: 'Active Referral Sources',
      value: '24',
      change: '+3 this month',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'New Leads This Month',
      value: '18',
      change: '+28% from last month',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Conversion Rate',
      value: '68%',
      change: '+5% improvement',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Revenue from Referrals',
      value: '$12,450',
      change: 'This quarter',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ];

  const recentActivity = [
    {
      type: 'referral',
      message: 'New referral from Dr. Sarah Johnson',
      time: '2 hours ago',
      icon: Users
    },
    {
      type: 'lead',
      message: 'Lead converted to client: Michael Chen',
      time: '4 hours ago',
      icon: TrendingUp
    },
    {
      type: 'contact',
      message: 'Follow-up call scheduled with Valley Medical',
      time: '6 hours ago',
      icon: Phone
    },
    {
      type: 'campaign',
      message: 'Monthly newsletter sent to 150 contacts',
      time: '1 day ago',
      icon: Mail
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <IconComponent className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Referral Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referral Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Dr. Sarah Johnson - Family Medicine', referrals: 8, revenue: '$3,200' },
                { name: 'Valley Medical Center', referrals: 6, revenue: '$2,800' },
                { name: 'Wellness Community Clinic', referrals: 4, revenue: '$1,800' },
                { name: 'Dr. Michael Rodriguez - Pediatrics', referrals: 3, revenue: '$1,200' }
              ].map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium text-gray-900">{source.name}</p>
                    <p className="text-sm text-gray-500">{source.referrals} referrals this month</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{source.revenue}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
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

export default CRMDashboard;
