
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Plus, UserCog, Mail, Phone } from 'lucide-react';
import { useStaffQueries } from '@/hooks/useStaffQueries';
import { useNavigate } from 'react-router-dom';

const StaffWorkflowView: React.FC = () => {
  const { staffMembers, isLoading, error } = useStaffQueries();
  const navigate = useNavigate();

  const handleAddStaff = () => {
    navigate('/staff/add');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Error Loading Staff</h3>
          <p className="text-gray-500 mb-4">There was an error loading staff members. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Staff Directory</h2>
        </div>
        <Button onClick={handleAddStaff} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search staff members..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Staff Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staffMembers && staffMembers.length > 0 ? (
          staffMembers.map((staff) => (
            <Card key={staff.id} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {staff.first_name} {staff.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{staff.staff_profile?.job_title || 'Staff Member'}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{staff.email}</span>
                </div>
                
                {staff.staff_profile?.phone_number && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{staff.staff_profile.phone_number}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-sm">
                  <UserCog className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{staff.staff_profile?.department || 'General'}</span>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {staff.roles && staff.roles.length > 0 ? (
                    staff.roles.filter(role => role.is_active).map((role, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {role.role}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-xs">No roles assigned</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Badge 
                    variant={staff.is_active ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {staff.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
              <CardContent className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Staff Members</h3>
                <p className="text-gray-500 mb-4">Get started by adding your first staff member.</p>
                <Button onClick={handleAddStaff}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Staff Member
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffWorkflowView;
