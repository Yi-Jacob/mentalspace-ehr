
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Users, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useStaffManagement } from '@/hooks/useStaffManagement';
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
    `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.roles.some(role => role.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAssignRole = (userId: string) => {
    const user = staffMembers?.find(m => m.id === userId);
    if (user) {
      setSelectedUserId(userId);
      setSelectedUserName(`${user.first_name} ${user.last_name}`);
      setSelectedUserRoles(user.roles.filter(r => r.is_active).map(r => r.role));
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
                    placeholder="Search by name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm('')}
                  disabled={!searchTerm}
                >
                  Clear
                </Button>
              </div>

              {filteredStaff && filteredStaff.length > 0 ? (
                <div className="grid gap-4">
                  {filteredStaff.map((staffMember) => (
                    <UserRoleCard
                      key={staffMember.id}
                      staffMember={staffMember}
                      onAssignRole={handleAssignRole}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {searchTerm ? 'No staff members match your search.' : 'No staff members found.'}
                  </p>
                  {searchTerm && (
                    <Button variant="outline" onClick={() => setSearchTerm('')} className="mt-2">
                      Clear Search
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <RolePermissionsViewer />
        </TabsContent>
      </Tabs>

      <RoleAssignmentModal
        isOpen={!!selectedUserId}
        onClose={handleCloseModal}
        userId={selectedUserId || ''}
        userName={selectedUserName}
        currentRoles={selectedUserRoles as any[]}
      />
    </div>
  );
};

export default RoleManagement;
