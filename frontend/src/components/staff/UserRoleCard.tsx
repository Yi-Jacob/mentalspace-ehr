
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserPlus, UserMinus, Shield, AlertTriangle } from 'lucide-react';
import { StaffMember, UserRole } from '@/types/staff';
import { useEnhancedStaffRoles } from '@/hooks/useEnhancedStaffRoles';

interface UserRoleCardProps {
  staffMember: StaffMember;
  onAssignRole: (userId: string) => void;
}

const UserRoleCard: React.FC<UserRoleCardProps> = ({ staffMember, onAssignRole }) => {
  const { removeRole, isRemovingRole, canAssignRoles } = useEnhancedStaffRoles();
  const [roleToRemove, setRoleToRemove] = useState<UserRole | null>(null);

  const handleRemoveRole = (role: UserRole) => {
    if (staffMember.id && role) {
      removeRole({ userId: staffMember.id, role });
      setRoleToRemove(null);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'Practice Administrator':
        return 'destructive';
      case 'Clinical Administrator':
        return 'default';
      case 'Supervisor':
        return 'secondary';
      case 'Clinician':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const isRoleRemovalRestricted = (role: UserRole) => {
    // Prevent removing Clinician role if Clinical Administrator role exists
    if (role === 'Clinician') {
      return staffMember.roles.some(r => r.role === 'Clinical Administrator' && r.is_active);
    }
    return false;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {getInitials(staffMember.first_name, staffMember.last_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">
                {staffMember.first_name} {staffMember.last_name}
              </p>
              <p className="text-sm text-gray-600">{staffMember.email}</p>
            </div>
          </div>
          {canAssignRoles && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAssignRole(staffMember.id)}
              className="shrink-0"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Assign Role
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-3">
            <Shield className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Current Roles:</span>
          </div>
          
          {staffMember.roles && staffMember.roles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {staffMember.roles
                .filter(role => role.is_active)
                .map((roleAssignment) => (
                  <div key={roleAssignment.id} className="flex items-center space-x-1">
                    <Badge variant={getRoleBadgeVariant(roleAssignment.role as UserRole)}>
                      {roleAssignment.role}
                    </Badge>
                    {canAssignRoles && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 hover:bg-red-100"
                            disabled={isRoleRemovalRestricted(roleAssignment.role as UserRole)}
                            onClick={() => setRoleToRemove(roleAssignment.role as UserRole)}
                          >
                            <UserMinus className="h-3 w-3 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center space-x-2">
                              <AlertTriangle className="h-5 w-5 text-orange-500" />
                              <span>Remove Role</span>
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove the "{roleAssignment.role}" role from{' '}
                              {staffMember.first_name} {staffMember.last_name}? This action cannot be undone.
                              {isRoleRemovalRestricted(roleAssignment.role as UserRole) && (
                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                  <p className="text-sm text-yellow-800">
                                    Cannot remove Clinician role while Clinical Administrator role is active.
                                  </p>
                                </div>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveRole(roleAssignment.role as UserRole)}
                              disabled={isRemovingRole || isRoleRemovalRestricted(roleAssignment.role as UserRole)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remove Role
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No roles assigned</p>
          )}
          
          {staffMember.staff_profile && (
            <div className="pt-2 border-t">
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                {staffMember.staff_profile.job_title && (
                  <div>
                    <span className="font-medium">Title:</span> {staffMember.staff_profile.job_title}
                  </div>
                )}
                {staffMember.staff_profile.department && (
                  <div>
                    <span className="font-medium">Department:</span> {staffMember.staff_profile.department}
                  </div>
                )}
                {staffMember.staff_profile.npi_number && (
                  <div>
                    <span className="font-medium">NPI:</span> {staffMember.staff_profile.npi_number}
                  </div>
                )}
                <div>
                  <span className="font-medium">Status:</span>{' '}
                  <Badge variant={staffMember.staff_profile.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {staffMember.staff_profile.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRoleCard;
