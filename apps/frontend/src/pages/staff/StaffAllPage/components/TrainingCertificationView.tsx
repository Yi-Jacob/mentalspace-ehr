
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { Progress } from '@/components/basic/progress';
import { GraduationCap, Calendar, AlertTriangle, Plus, BookOpen, Award } from 'lucide-react';
import { useTrainingRecords } from '@/hooks/useTrainingRecords';

const TrainingCertificationView: React.FC = () => {
  const { trainingRecords, isLoading } = useTrainingRecords();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const mockTrainingData = [
    {
      id: '1',
      staff: 'Dr. Sarah Johnson',
      certifications: [
        { name: 'Clinical Psychology License', status: 'active', expiry: '2024-12-15' },
        { name: 'Trauma Therapy Certification', status: 'expires_soon', expiry: '2024-08-30' }
      ],
      trainings: [
        { name: 'HIPAA Compliance 2024', completed: true, date: '2024-01-15' },
        { name: 'Crisis Intervention', completed: false, progress: 60 }
      ]
    },
    {
      id: '2',
      staff: 'Mike Chen',
      certifications: [
        { name: 'Licensed Clinical Social Worker', status: 'active', expiry: '2025-06-20' },
        { name: 'Substance Abuse Counseling', status: 'expired', expiry: '2024-01-10' }
      ],
      trainings: [
        { name: 'Ethics in Practice', completed: true, date: '2024-02-20' },
        { name: 'Motivational Interviewing', completed: false, progress: 30 }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'expires_soon':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Expires Soon</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Training & Certifications</h2>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Training Record
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Certifications</p>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Due This Month</p>
                <p className="text-2xl font-bold text-purple-600">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Training Details */}
      <div className="space-y-4">
        {mockTrainingData.map((staff) => (
          <Card key={staff.id} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{staff.staff}</span>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Record
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Certifications */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Certifications
                  </h4>
                  <div className="space-y-2">
                    {staff.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{cert.name}</p>
                          <p className="text-xs text-gray-600">Expires: {cert.expiry}</p>
                        </div>
                        {getStatusBadge(cert.status)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Training Progress */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Training Progress
                  </h4>
                  <div className="space-y-3">
                    {staff.trainings.map((training, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-sm">{training.name}</p>
                          {training.completed ? (
                            <Badge className="bg-green-500">Completed</Badge>
                          ) : (
                            <span className="text-xs text-gray-600">{training.progress}%</span>
                          )}
                        </div>
                        {!training.completed && (
                          <Progress value={training.progress} className="h-2" />
                        )}
                        {training.completed && (
                          <p className="text-xs text-gray-600">Completed: {training.date}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrainingCertificationView;
