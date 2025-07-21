import React from 'react';
import { useStaffManagement } from '@/hooks/useStaffManagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const StaffList: React.FC = () => {
  const {
    staffMembers,
    isLoading,
    error,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
    isCreating,
    isUpdating,
    isDeleting,
  } = useStaffManagement();

  const handleCreateStaff = async () => {
    try {
      await createStaffMember({
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      });
    } catch (error) {
      console.error('Error creating staff:', error);
    }
  };

  const handleUpdateStaff = async (id: string) => {
    try {
      await updateStaffMember(id, {
        firstName: 'Updated Name',
      });
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      await deleteStaffMember(id);
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  if (isLoading) {
    return <div>Loading staff members...</div>;
  }

  if (error) {
    return <div>Error loading staff: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <Button 
          onClick={handleCreateStaff} 
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Add Staff Member'}
        </Button>
      </div>

      <div className="grid gap-4">
        {staffMembers.map((staff) => (
          <Card key={staff.id}>
            <CardHeader>
              <CardTitle>
                {staff.firstName} {staff.lastName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{staff.email}</p>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  onClick={() => handleUpdateStaff(staff.id)}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Edit'}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteStaff(staff.id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {staffMembers.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No staff members found. Click "Add Staff Member" to create one.
        </div>
      )}
    </div>
  );
}; 