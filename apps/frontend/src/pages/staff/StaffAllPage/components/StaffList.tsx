
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Badge } from '@/components/basic/badge';
import { Search, Edit, UserMinus, Phone, Mail, Star, Users, AlertCircle, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/basic/alert';
import { useStaffManagement } from '@/pages/staff/hook/useStaffManagement';
import { useStaffRoles } from '@/pages/staff/hook/useStaffRoles';
import { StaffMember, UserRole } from '@/types/staffType';

const StaffList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const { staffMembers, isLoading, error, deactivateStaff } = useStaffManagement();
  const { hasRole } = useStaffRoles();

  const canManageStaff = hasRole('Practice Administrator');

  // Handle URL parameter for selected staff member
  useEffect(() => {
    const selectedId = searchParams.get('selected');
    if (selectedId && staffMembers) {
      const staff = staffMembers.find(s => s.id === selectedId);
      if (staff) {
        setSelectedStaff(staff);
        // Clear the URL parameter
        setSearchParams({});
      }
    }
  }, [searchParams, staffMembers, setSearchParams]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading staff members. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const filteredStaff = staffMembers?.filter(staff => {
    const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || 
           staff.email?.toLowerCase().includes(search);
  }) || [];

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search staff members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {filteredStaff.length} staff members
          </Badge>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <Card 
            key={staff.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/staff/${staff.id}`)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {staff.firstName?.[0]}{staff.lastName?.[0]}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {staff.firstName} {staff.lastName}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{staff.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {staff.roles?.map((role) => (
                    <Badge key={role} variant="outline" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {staff.staffProfile?.phoneNumber && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{staff.staffProfile.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{staff.email}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {staff.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/staff/${staff.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/staff/${staff.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {canManageStaff && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deactivateStaff(staff.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No staff members found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms.' : 'No staff members have been added yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default StaffList;
