
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Play, Pause, BarChart3, Users } from 'lucide-react';

const TimeTrackingView: React.FC = () => {
  const mockTimeData = [
    {
      id: '1',
      staff: 'Dr. Sarah Johnson',
      status: 'active',
      todayHours: 6.5,
      weekHours: 32.5,
      targetHours: 40,
      currentSession: 'Client Session - John Doe',
      sessionStart: '2:00 PM'
    },
    {
      id: '2',
      staff: 'Mike Chen',
      status: 'break',
      todayHours: 5.0,
      weekHours: 28.0,
      targetHours: 35,
      currentSession: 'Break',
      sessionStart: '3:15 PM'
    },
    {
      id: '3',
      staff: 'Dr. Lisa Wong',
      status: 'offline',
      todayHours: 8.0,
      weekHours: 40.0,
      targetHours: 40,
      currentSession: null,
      sessionStart: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'break':
        return <Badge className="bg-yellow-500">On Break</Badge>;
      case 'offline':
        return <Badge variant="secondary">Offline</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4 text-green-600" />;
      case 'break':
        return <Pause className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Clock className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Time Tracking</h2>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Staff Online</p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Hours Today</p>
                <p className="text-2xl font-bold text-green-600">52.5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Week Progress</p>
                <p className="text-2xl font-bold text-purple-600">75%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Hours/Day</p>
                <p className="text-2xl font-bold text-orange-600">6.8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Time Tracking */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle>Current Staff Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTimeData.map((staff) => (
              <div key={staff.id} className="border rounded-lg p-4 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(staff.status)}
                    <div>
                      <h3 className="font-semibold">{staff.staff}</h3>
                      {staff.currentSession && (
                        <p className="text-sm text-gray-600">
                          {staff.currentSession} {staff.sessionStart && `(since ${staff.sessionStart})`}
                        </p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(staff.status)}
                </div>

                <div className="grid md:grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Today</p>
                    <p className="text-lg font-semibold">{staff.todayHours}h</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">This Week</p>
                    <p className="text-lg font-semibold">{staff.weekHours}h</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Target</p>
                    <p className="text-lg font-semibold">{staff.targetHours}h</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Progress</p>
                    <p className="text-lg font-semibold">
                      {Math.round((staff.weekHours / staff.targetHours) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Time Reports
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeTrackingView;
