
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/basic/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Input } from '@/components/basic/input';
import { Button } from '@/components/basic/button';
import { Search, Users, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/basic/alert';
import { useStaffManagement } from '@/pages/staff/hook/useStaffManagement';
import { useEnhancedStaffRoles } from '@/hooks/useEnhancedStaffRoles';
import UserRoleCard from './UserRoleCard';
import RoleAssignmentModal from './RoleAssignmentModal';
import RolePermissionsViewer from './RolePermissionsViewer';

const RoleManagement: React.FC = () => {
  const { staffMembers, isLoading, error } = useStaffManagement();
  const { canAssignRoles } = useEnhancedStaffRoles();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>('');
  const [selectedUserRoles, setSelectedUserRoles] = useState<string[]>([]);

  const filteredStaff = staffMembers?.filter(member =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAssignRole = (userId: string) => {
    const user = staffMembers?.find(m => m.id === userId);
    if (user) {
      setSelectedUserId(userId);
      setSelectedUserName(`${user.firstName} ${user.lastName}`);
      setSelectedUserRoles(user.roles || []);
    }
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
    setSelectedUserName('');
    setSelectedUserRoles([]);
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
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load staff members. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!canAssignRoles) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to manage roles. Contact your Practice Administrator for assistance.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="management" className="space-y-4">
        <TabsList>
          <TabsTrigger value="management" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Role Management</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Role Permissions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Staff Role Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStaff?.map((member) => (
                  <UserRoleCard
                    key={member.id}
                    user={member}
                    onAssignRole={() => handleAssignRole(member.id)}
                  />
                ))}
              </div>

              {filteredStaff?.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No staff members found</h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms.' : 'No staff members have been added yet.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <RolePermissionsViewer />
        </TabsContent>
      </Tabs>

      {selectedUserId && (
        <RoleAssignmentModal
          userId={selectedUserId}
          userName={selectedUserName}
          currentRoles={selectedUserRoles}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default RoleManagement;
