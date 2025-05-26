
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, UserMinus, Phone, Mail } from 'lucide-react';
import { useStaffManagement } from '@/hooks/useStaffManagement';
import { useStaffRoles } from '@/hooks/useStaffRoles';
import { StaffMember } from '@/types/staff';
import EditStaffModal from './EditStaffModal';

const StaffList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const { staffMembers, isLoading, deactivateStaff } = useStaffManagement();
  const { hasRole } = useStaffRoles();

  const canManageStaff = hasRole('Practice Administrator');

  const filteredStaff = staffMembers?.filter(staff =>
    `${staff.first_name} ${staff.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.staff_profile?.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getRoleColor = (role: string) => {
    const colors = {
      'Practice Administrator': 'bg-red-100 text-red-800',
      'Clinical Administrator': 'bg-purple-100 text-purple-800',
      'Clinician': 'bg-blue-100 text-blue-800',
      'Supervisor': 'bg-green-100 text-green-800',
      'Intern / Assistant / Associate': 'bg-yellow-100 text-yellow-800',
      'Practice Scheduler': 'bg-indigo-100 text-indigo-800',
      'Biller for Assigned Patients Only': 'bg-orange-100 text-orange-800',
      'Practice Biller': 'bg-pink-100 text-pink-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search staff members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStaff.map((staff) => (
          <Card key={staff.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {staff.first_name} {staff.last_name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{staff.staff_profile?.job_title}</p>
                  {staff.staff_profile?.employee_id && (
                    <p className="text-xs text-gray-500">ID: {staff.staff_profile.employee_id}</p>
                  )}
                </div>
                <Badge 
                  variant={staff.staff_profile?.status === 'active' ? 'default' : 'secondary'}
                  className={staff.staff_profile?.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {staff.staff_profile?.status || 'Active'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{staff.email}</span>
              </div>
              
              {staff.staff_profile?.phone_number && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{staff.staff_profile.phone_number}</span>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium">Roles:</p>
                <div className="flex flex-wrap gap-1">
                  {staff.roles?.filter(r => r.is_active).map((role) => (
                    <Badge 
                      key={role.id} 
                      variant="secondary"
                      className={getRoleColor(role.role)}
                    >
                      {role.role}
                    </Badge>
                  ))}
                  {(!staff.roles || staff.roles.filter(r => r.is_active).length === 0) && (
                    <Badge variant="outline">No roles assigned</Badge>
                  )}
                </div>
              </div>

              {canManageStaff && (
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStaff(staff)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deactivateStaff(staff.id)}
                    className="text-red-600 hover:text-red-700"
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

      {filteredStaff.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No staff members found</p>
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
