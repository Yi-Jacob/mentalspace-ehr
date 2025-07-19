
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Clock, Users, BarChart3 } from 'lucide-react';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';

const PerformanceView: React.FC = () => {
  const { performanceMetrics, isLoading } = usePerformanceTracking();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const mockMetrics = [
    {
      id: '1',
      staff: 'Dr. Sarah Johnson',
      role: 'Clinical Administrator',
      notesCompleted: 45,
      notesTarget: 50,
      avgCompletionTime: 2.3,
      complianceRate: 90,
      patientsSeen: 28
    },
    {
      id: '2',
      staff: 'Mike Chen',
      role: 'Clinician',
      notesCompleted: 38,
      notesTarget: 40,
      avgCompletionTime: 1.8,
      complianceRate: 95,
      patientsSeen: 25
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Performance Metrics</h2>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Compliance</p>
                <p className="text-2xl font-bold text-blue-600">92%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Note Time</p>
                <p className="text-2xl font-bold text-green-600">2.1h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Goals Met</p>
                <p className="text-2xl font-bold text-purple-600">85%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold text-orange-600">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Details */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle>Individual Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockMetrics.map((metric) => (
              <div key={metric.id} className="border rounded-lg p-4 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{metric.staff}</h3>
                    <Badge variant="outline">{metric.role}</Badge>
                  </div>
                  <Badge 
                    variant={metric.complianceRate >= 90 ? "default" : metric.complianceRate >= 80 ? "secondary" : "destructive"}
                  >
                    {metric.complianceRate}% Compliance
                  </Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Notes Progress</span>
                      <span>{metric.notesCompleted}/{metric.notesTarget}</span>
                    </div>
                    <Progress 
                      value={(metric.notesCompleted / metric.notesTarget) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">Avg Completion Time</p>
                    <p className="text-lg font-semibold">{metric.avgCompletionTime}h</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">Patients Seen</p>
                    <p className="text-lg font-semibold">{metric.patientsSeen}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceView;
