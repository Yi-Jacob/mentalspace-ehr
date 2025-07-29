
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { Eye, Shield, Users, Settings, Lock, Unlock } from 'lucide-react';

const StaffAccessManagement: React.FC = () => {
  const mockAccessData = [
    {
      id: '1',
      staff: 'Dr. Sarah Johnson',
      role: 'Clinical Administrator',
      permissions: ['All Patients', 'Staff Management', 'Reports', 'Billing'],
      lastAccess: '2024-01-15 14:30',
      status: 'active'
    },
    {
      id: '2',
      staff: 'Mike Chen',
      role: 'Clinician',
      permissions: ['Assigned Patients', 'Clinical Notes', 'Scheduling'],
      lastAccess: '2024-01-15 13:45',
      status: 'active'
    },
    {
      id: '3',
      staff: 'Dr. Lisa Wong',
      role: 'Supervisor',
      permissions: ['Supervisee Patients', 'Clinical Notes', 'Reports'],
      lastAccess: '2024-01-14 16:20',
      status: 'restricted'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active Access</Badge>;
      case 'restricted':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Restricted</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Unlock className="h-4 w-4 text-green-600" />;
      case 'restricted':
      case 'suspended':
        return <Lock className="h-4 w-4 text-red-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Access Management</h2>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Settings className="h-4 w-4 mr-2" />
          Manage Permissions
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Restricted</p>
                <p className="text-2xl font-bold text-yellow-600">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Roles Defined</p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Recent Access</p>
                <p className="text-2xl font-bold text-purple-600">45</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Access Details */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle>Staff Access Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAccessData.map((staff) => (
              <div key={staff.id} className="border rounded-lg p-4 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(staff.status)}
                    <div>
                      <h3 className="font-semibold text-lg">{staff.staff}</h3>
                      <Badge variant="outline">{staff.role}</Badge>
                    </div>
                  </div>
                  {getStatusBadge(staff.status)}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                      {staff.permissions.map((permission, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Access Information</h4>
                    <p className="text-sm text-gray-600">
                      Last Access: {staff.lastAccess}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Edit Permissions
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Lock className="h-4 w-4 mr-1" />
                    Restrict Access
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

export default StaffAccessManagement;
