
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { Avatar, AvatarFallback } from '@/components/basic/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/basic/alert-dialog';
import { UserPlus, UserMinus, Shield, AlertTriangle } from 'lucide-react';
import { StaffMember, UserRole } from '@/types/staffType';
import { useEnhancedStaffRoles } from '@/hooks/useEnhancedStaffRoles';

interface UserRoleCardProps {
  user: StaffMember;
  onAssignRole: (userId: string) => void;
}

const UserRoleCard: React.FC<UserRoleCardProps> = ({ user, onAssignRole }) => {
  const { removeRole, isRemovingRole, canAssignRoles } = useEnhancedStaffRoles();
  const [roleToRemove, setRoleToRemove] = useState<string | null>(null);

  const handleRemoveRole = (role: string) => {
    if (user.id && role) {
      removeRole({ userId: user.id, role });
      setRoleToRemove(null);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
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

  const isRoleRemovalRestricted = (role: string) => {
    // Prevent removing Clinician role if Clinical Administrator role exists
    if (role === 'Clinician') {
      return user.roles?.some(r => r === 'Clinical Administrator');
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
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          {canAssignRoles && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAssignRole(user.id)}
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
          
          {user.roles && user.roles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.roles.map((role) => (
                <div key={role} className="flex items-center space-x-1">
                  <Badge variant={getRoleBadgeVariant(role)}>
                    {role}
                  </Badge>
                  {canAssignRoles && !isRoleRemovalRestricted(role) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setRoleToRemove(role)}
                          className="h-4 w-4 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={isRemovingRole}
                        >
                          <UserMinus className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Role</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove the "{role}" role from {user.firstName} {user.lastName}? 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveRole(role)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remove Role
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {isRoleRemovalRestricted(role) && (
                    <AlertTriangle className="h-3 w-3 text-yellow-500" title="This role cannot be removed" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No roles assigned</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRoleCard;
