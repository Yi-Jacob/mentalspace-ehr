import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { Plus, Stethoscope, Edit, UserMinus, Eye, Star, Users, AlertCircle, Key, UserCheck, UserX, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/basic/alert';
import { useStaffManagement } from '@/pages/staff/hook/useStaffManagement';
import { useStaffRoles } from '@/pages/staff/hook/useStaffRoles';
import { StaffMember, UserRole } from '@/types/staffType';
import { Table, TableColumn } from '@/components/basic/table';
import { staffService } from '@/services/staffService';
import { useToast } from '@/hooks/use-toast';
import ConfirmationModal from '@/components/basic/confirmation-modal';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';

const StaffPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const { staffMembers, isLoading, error, refetchStaff } = useStaffManagement();
  const { hasRole } = useStaffRoles();
  const canManageStaff = hasRole('Practice Administrator');

  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: 'default' | 'destructive';
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const [passwordModal, setPasswordModal] = useState<{
    isOpen: boolean;
    staffName: string;
    generatedPassword: string;
  }>({
    isOpen: false,
    staffName: '',
    generatedPassword: '',
  });

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleAddTeamMember = () => {
    navigate('/staff/create');
  };

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

  // Sort staff members: active first, then inactive
  const sortedStaffMembers = useMemo(() => {
    if (!staffMembers) return [];
    
    return [...staffMembers].sort((a, b) => {
      // First sort by active status (active users first)
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }
      // Then sort by name
      const aName = `${a.firstName} ${a.lastName}`.toLowerCase();
      const bName = `${b.firstName} ${b.lastName}`.toLowerCase();
      return aName.localeCompare(bName);
    });
  }, [staffMembers]);

  if (error) {
    return (
      <PageLayout variant="gradient">
        <PageHeader
          icon={Stethoscope}
          title="Staff Management"
          description="Manage your team with style and efficiency"
          action={
            <Button 
              onClick={handleAddTeamMember}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Staff
            </Button>
          }
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading staff members. Please try again.
          </AlertDescription>
        </Alert>
      </PageLayout>
    );
  }

  // Define table columns
  const columns: TableColumn<StaffMember>[] = [
    {
      key: 'avatar',
      header: '',
      width: '60px',
      accessor: (staff) => (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {staff.firstName?.[0]}{staff.lastName?.[0]}
        </div>
      ),
      sortable: false,
      searchable: false,
      className: 'text-center'
    },
    {
      key: 'name',
      header: 'Full Name',
      accessor: (staff) => (
          <div className="font-medium text-gray-900">
            {staff.firstName} {staff.middleName ? `${staff.middleName} ` : ''}{staff.lastName}{staff.suffix ? ` ${staff.suffix}` : ''}
          </div>
      ),
      searchValue: (staff) => `${staff.firstName} ${staff.middleName || ''} ${staff.lastName} ${staff.suffix || ''}`.trim(),
      sortable: true,
      searchable: true
    },
    {
      key: 'username',
      header: 'Username',
      accessor: (staff) => (
        <div className="text-gray-900">
          {staff.userName}
        </div>
      ),
      searchValue: (staff) => staff.userName,
      sortable: true,
      searchable: true
    },
    {
      key: 'email',
      header: 'Email',
      accessor: (staff) => (
        <div className="text-gray-900">
          {staff.email}
        </div>
      ),
      searchValue: (staff) => staff.email,
      sortable: true,
      searchable: true
    },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      accessor: (staff) => (
        <Badge variant={staff.isActive ? 'default' : 'secondary'} className="text-xs">
          {staff.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
      searchValue: (staff) => staff.isActive ? 'Active' : 'Inactive',
      sortable: true,
      searchable: true,
      className: 'text-center'
    },
    {
      key: 'roles',
      header: 'Roles',
      accessor: (staff) => {
        const roles = staff.roles || [];
        const displayRoles = roles.slice(0, 2);
        const hasMore = roles.length > 2;
        
        return (
          <div className="flex flex-wrap gap-1">
            {displayRoles.map((role) => (
              <Badge key={role} variant="outline" className="text-xs">
                {role}
              </Badge>
            ))}
            {hasMore && (
              <Badge variant="outline" className="text-xs">
                ...
              </Badge>
            )}
            {roles.length === 0 && (
              <span className="text-gray-400 text-sm">No roles assigned</span>
            )}
          </div>
        );
      },
      searchValue: (staff) => (staff.roles || []).join(' '),
      sortable: false,
      searchable: true
    }
  ];

  // Define table actions
  const actions = [
    {
      label: 'View Details',
      icon: <Eye className="h-4 w-4" />,
      onClick: (staff: StaffMember) => navigate(`/staff/${staff.id}`),
      variant: 'ghost' as const
    },
    {
      label: 'Edit Staff',
      icon: <Edit className="h-4 w-4" />,
      onClick: (staff: StaffMember) => navigate(`/staff/${staff.id}/edit`),
      variant: 'ghost' as const
    },
    {
      label: 'Set Random Password',
      icon: <Key className="h-4 w-4" />,
      onClick: (staff: StaffMember) => {
        setConfirmationModal({
          isOpen: true,
          title: 'Set Random Password',
          description: `Are you sure you want to generate a new random password for ${staff.firstName} ${staff.lastName}? This will reset their current password.`,
          onConfirm: async () => {
            try {
              const response = await staffService.setDefaultPassword(staff.id);
              setPasswordModal({
                isOpen: true,
                staffName: `${staff.firstName} ${staff.lastName}`,
                generatedPassword: response.generatedPassword,
              });
              refetchStaff();
            } catch (err) {
              toast({
                title: 'Error setting random password',
                description: `Failed to set random password for ${staff.firstName} ${staff.lastName}.`,
                variant: 'destructive',
              });
            }
          },
          variant: 'destructive'
        });
      },
      variant: 'ghost' as const
    },
    {
      label: staff => staff.isActive ? 'Deactivate Staff' : 'Activate Staff',
      icon: staff => staff.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />,
      onClick: async (staff: StaffMember) => {
        try {
          if (staff.isActive) {
            await staffService.deactivateUser(staff.id);
          } else {
            await staffService.activateUser(staff.id);
          }
          toast({
            title: staff.isActive ? 'Staff deactivated' : 'Staff activated',
            description: `Staff ${staff.isActive ? 'deactivated' : 'activated'}.`,
          });
          refetchStaff();
        } catch (err) {
          toast({
            title: staff.isActive ? 'Error deactivating staff' : 'Error activating staff',
            description: `Failed to ${staff.isActive ? 'deactivate' : 'activate'} staff ${staff.firstName} ${staff.lastName}.`,
            variant: 'destructive',
          });
        }
      },
      variant: staff => staff.isActive ? 'destructive' as const : 'default' as const
    }
  ];

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Stethoscope}
        title="Staff Management"
        description="Manage your team with style and efficiency"
        action={
          <Button 
            onClick={handleAddTeamMember}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Staff
          </Button>
        }
      />

      <div className="space-y-6">
        <Table
          data={sortedStaffMembers}
          columns={columns}
          sortable={true}
          pagination={true}
          searchable={true}
          selectable={canManageStaff}
          onRowClick={(staff) => navigate(`/staff/${staff.id}`)}
          onSelectionChange={(selectedItems) => {
            console.log('Selected staff:', selectedItems);
          }}
          pageSize={10}
          pageSizeOptions={[10, 25, 50]}
          className="shadow-sm"
          emptyMessage={
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No staff members found</h3>
              <p className="text-gray-500">
                No staff members have been added yet.
              </p>
            </div>
          }
          loading={isLoading}
          actions={actions}
        />
                <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmationModal.onConfirm}
          title={confirmationModal.title}
          description={confirmationModal.description}
          variant={confirmationModal.variant}
          confirmText="Confirm"
          cancelText="Cancel"
        />

        {/* Password Display Modal */}
        {passwordModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Password Generated</h3>
                <button
                  onClick={() => setPasswordModal(prev => ({ ...prev, isOpen: false }))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  A new random password has been generated for <strong>{passwordModal.staffName}</strong>
                </p>
                <p className="text-xs text-amber-600 mb-3 font-medium">
                  ⚠️ This password will be shown only once. Please copy it now.
                </p>
                
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded border">
                  <code className="flex-1 font-mono text-sm break-all">
                    {passwordModal.generatedPassword}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(passwordModal.generatedPassword)}
                    className="shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={() => setPasswordModal(prev => ({ ...prev, isOpen: false }))}
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default StaffPage; 