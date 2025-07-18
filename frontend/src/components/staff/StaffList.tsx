
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, UserMinus, Phone, Mail, Star, Users, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useStaffManagement } from '@/hooks/useStaffManagement';
import { useStaffRoles } from '@/hooks/useStaffRoles';
import { StaffMember, UserRole } from '@/types/staff';
import EditStaffModal from './EditStaffModal';

const StaffList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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

  console.log('StaffList - staffMembers:', staffMembers);
  console.log('StaffList - isLoading:', isLoading);
  console.log('StaffList - error:', error);
  console.log('StaffList - canManageStaff:', canManageStaff);

  const filteredStaff = staffMembers?.filter(staff =>
    `${staff.first_name} ${staff.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.staff_profile?.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getRoleColor = (role: string) => {
    const colors = {
      'Practice Administrator': 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
      'Clinical Administrator': 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
      'Clinician': 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white',
      'Supervisor': 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
      'Intern': 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
      'Assistant': 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white',
      'Associate': 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white',
      'Practice Scheduler': 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white',
      'Biller for Assigned Patients Only': 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
      'Practice Biller': 'bg-gradient-to-r from-pink-500 to-rose-600 text-white',
    };
    return colors[role as keyof typeof colors] || 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading your amazing team...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Staff loading error:', error);
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading staff: {error.message || 'Unknown error occurred'}
            <br />
            Please check the console for more details.
            <br />
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show message if no staff members at all
  if (!staffMembers || staffMembers.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Search team members by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg bg-white/80 backdrop-blur-sm border-white/20 rounded-xl shadow-lg focus:shadow-xl transition-all duration-300"
            />
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No staff members found in the system. This could be because:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>No staff members have been added yet</li>
              <li>You don't have permission to view staff members</li>
              <li>There's a configuration issue with roles and permissions</li>
            </ul>
            <div className="mt-3">
              <p className="text-sm text-gray-600">
                Current user permissions: {canManageStaff ? 'Can manage staff' : 'Cannot manage staff'}
              </p>
            </div>
          </AlertDescription>
        </Alert>

        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Users className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No team members found</h3>
          <p className="text-gray-500">Start building your amazing team!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modern Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            placeholder="Search team members by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 text-lg bg-white/80 backdrop-blur-sm border-white/20 rounded-xl shadow-lg focus:shadow-xl transition-all duration-300"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setSearchTerm('')}
          disabled={!searchTerm}
          className="h-12 px-6 bg-white/80 backdrop-blur-sm border-white/20 rounded-xl hover:bg-white/90 transition-all duration-300"
        >
          Clear
        </Button>
      </div>

      {/* Debug Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Debug: Found {staffMembers?.length || 0} staff members total, {filteredStaff.length} after filtering.
          Can manage staff: {canManageStaff ? 'Yes' : 'No'}
        </AlertDescription>
      </Alert>

      {/* Staff Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.map((staff) => (
          <Card 
            key={staff.id} 
            className="group hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 bg-white/80 backdrop-blur-sm border-white/20 rounded-2xl overflow-hidden"
          >
            <CardHeader className="pb-3 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-xl flex items-center space-x-2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {staff.first_name} {staff.last_name}
                    </span>
                    {staff.roles?.some(r => r.role === 'Practice Administrator' && r.is_active) && (
                      <Star className="h-5 w-5 text-yellow-500" />
                    )}
                  </CardTitle>
                  <p className="text-sm text-gray-600 font-medium">{staff.staff_profile?.job_title || 'No job title'}</p>
                  {staff.staff_profile?.employee_id && (
                    <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full w-fit">
                      ID: {staff.staff_profile.employee_id}
                    </p>
                  )}
                </div>
                <Badge 
                  variant={staff.staff_profile?.status === 'active' ? 'default' : 'secondary'}
                  className={staff.staff_profile?.status === 'active' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-700'
                  }
                >
                  {staff.staff_profile?.status || 'Active'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="truncate">{staff.email}</span>
                </div>
                
                {staff.staff_profile?.phone_number && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    <span>{staff.staff_profile.phone_number}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-700">Roles:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {staff.roles?.filter(r => r.is_active).map((role) => (
                    <Badge 
                      key={role.id} 
                      className={`${getRoleColor(role.role)} shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-xs`}
                    >
                      {role.role}
                    </Badge>
                  ))}
                  {(!staff.roles || staff.roles.filter(r => r.is_active).length === 0) && (
                    <Badge variant="outline" className="border-dashed border-gray-300 text-gray-500">
                      No roles assigned
                    </Badge>
                  )}
                </div>
              </div>

              {canManageStaff && (
                <div className="flex space-x-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStaff(staff)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300 transition-all duration-300"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deactivateStaff(staff.id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200 hover:border-red-300 transition-all duration-300"
                  >
                    <UserMinus className="h-4 w-4 mr-1" />
                    Deactivate
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStaff.length === 0 && searchTerm && (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Users className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No team members found</h3>
          <p className="text-gray-500">Try adjusting your search terms.</p>
          <Button 
            variant="outline" 
            onClick={() => setSearchTerm('')} 
            className="mt-4 bg-white/80 backdrop-blur-sm border-white/20"
          >
            Clear Search
          </Button>
        </div>
      )}

      {selectedStaff && (
        <EditStaffModal
          staff={selectedStaff}
          isOpen={!!selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </div>
  );
};

export default StaffList;
