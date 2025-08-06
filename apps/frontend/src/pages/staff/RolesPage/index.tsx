
import React, { useState, useEffect, useMemo } from 'react';
import { Check, Users, Shield, Search, ChevronUp, ChevronDown } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Checkbox } from '@/components/basic/checkbox';
import { Badge } from '@/components/basic/badge';
import { Input } from '@/components/basic/input';
import { Button } from '@/components/basic/button';
import { staffService } from '@/services/staffService';
import { StaffMember } from '@/types/staffType';
import { USER_ROLE_OPTIONS, ROLE_DESCRIPTIONS } from '@/types/enums/staffEnum';
import { useToast } from '@/hooks/use-toast';

interface RoleAssignmentData {
  staffId: string;
  staffName: string;
  email: string;
  roles: string[];
}

interface RoleColumn {
  key: string;
  header: React.ReactNode;
  accessor: (item: RoleAssignmentData) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
}

const RolesPage: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  // Fetch all staff members
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const staff = await staffService.getAllStaff();
        setStaffMembers(staff);
      } catch (error) {
        console.error('Error fetching staff:', error);
        toast({
          title: 'Error',
          description: 'Failed to load staff members',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [toast]);

  // Handle role assignment/unassignment
  const handleRoleToggle = async (staffId: string, role: string, isChecked: boolean) => {
    try {
      setUpdatingRole(`${staffId}-${role}`);
      
      if (isChecked) {
        await staffService.assignRole(staffId, role);
        toast({
          title: 'Success',
          description: `Role "${role}" assigned successfully`,
        });
      } else {
        await staffService.removeRole(staffId, role);
        toast({
          title: 'Success',
          description: `Role "${role}" removed successfully`,
        });
      }

      // Refresh staff data
      const updatedStaff = await staffService.getAllStaff();
      setStaffMembers(updatedStaff);
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isChecked ? 'assign' : 'remove'} role`,
        variant: 'destructive',
      });
    } finally {
      setUpdatingRole(null);
    }
  };

  // Create table columns
  const columns: RoleColumn[] = useMemo(() => {
    const baseColumns: RoleColumn[] = [
      {
        key: 'staffName',
        header: 'Staff Member',
        accessor: (item) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{item.staffName}</span>
            <span className="text-sm text-gray-500">{item.email}</span>
          </div>
        ),
        sortable: true,
        width: '250px',
      },
    ];

    // Add role columns
    const roleColumns: RoleColumn[] = USER_ROLE_OPTIONS.map((roleOption) => ({
      key: `role_${roleOption.value}`,
      header: (
        <div className="flex flex-col items-center space-y-1">
          <span className="text-xs font-medium text-gray-700">{roleOption.label}</span>
          <Badge variant="secondary" className="text-xs">
            {staffMembers.filter(staff => staff.roles?.includes(roleOption.value)).length}
          </Badge>
        </div>
      ),
      accessor: (item) => {
        const hasRole = item.roles.includes(roleOption.value);
        const isUpdating = updatingRole === `${item.staffId}-${roleOption.value}`;
        
        return (
          <div className="flex justify-center">
            <Checkbox
              checked={hasRole}
              onCheckedChange={(checked) => 
                handleRoleToggle(item.staffId, roleOption.value, checked as boolean)
              }
              disabled={isUpdating}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            {isUpdating && (
              <div className="ml-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        );
      },
      sortable: false,
      width: '120px',
      className: 'text-center',
    }));

    return [...baseColumns, ...roleColumns];
  }, [staffMembers, updatingRole]);

  // Transform staff data for table
  const tableData: RoleAssignmentData[] = useMemo(() => {
    return staffMembers.map(staff => ({
      staffId: staff.id,
      staffName: `${staff.firstName} ${staff.lastName}`,
      email: staff.email,
      roles: staff.roles || [],
    }));
  }, [staffMembers]);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = tableData;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortColumn === 'staffName') {
          aValue = a.staffName;
          bValue = b.staffName;
        } else if (sortColumn.startsWith('role_')) {
          const role = sortColumn.replace('role_', '');
          aValue = a.roles.includes(role) ? 1 : 0;
          bValue = b.roles.includes(role) ? 1 : 0;
        } else {
          return 0;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      });
    }

    return filtered;
  }, [tableData, searchTerm, sortColumn, sortDirection]);

  // Handle sort
  const handleSort = (columnKey: string) => {
    setSortColumn(columnKey);
    setSortDirection(prev => 
      prev === 'asc' && sortColumn === columnKey ? 'desc' : 'asc'
    );
  };

  // Calculate role statistics
  const roleStats = useMemo(() => {
    const stats = USER_ROLE_OPTIONS.map(role => ({
      role: role.value,
      label: role.label,
      count: staffMembers.filter(staff => staff.roles?.includes(role.value)).length,
      description: ROLE_DESCRIPTIONS[role.value as keyof typeof ROLE_DESCRIPTIONS] || '',
    }));

    return stats.sort((a, b) => b.count - a.count);
  }, [staffMembers]);

  return (
    <PageLayout>
      <PageHeader
        icon={Shield}
        title="Role Management"
        description="Manage staff roles and permissions across the organization"
        action={
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              {staffMembers.length} Staff Members
            </Badge>
            <Badge variant="outline" className="text-sm">
              {USER_ROLE_OPTIONS.length} Roles
            </Badge>
          </div>
        }
      />

      {/* Role Statistics */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {roleStats.map((stat) => (
            <div
              key={stat.role}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                <Badge variant={stat.count > 0 ? "default" : "secondary"}>
                  {stat.count}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Role Assignment Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Role Assignments</h3>
              <p className="text-sm text-gray-600 mt-1">
                Click the checkboxes to assign or remove roles from staff members
              </p>
            </div>
            <div className="relative w-80">
              <Input
                placeholder="Search staff members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                    } ${column.className || ''}`}
                    style={{ width: column.width }}
                    onClick={() => {
                      if (column.sortable) {
                        handleSort(column.key);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          {sortColumn === column.key ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )
                          ) : (
                            <div className="flex flex-col">
                              <ChevronUp className="h-3 w-3 text-gray-300" />
                              <ChevronDown className="h-3 w-3 text-gray-300" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : processedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                    {searchTerm ? 'No staff members found matching your search' : 'No staff members found'}
                  </td>
                </tr>
              ) : (
                processedData.map((item) => (
                  <tr
                    key={item.staffId}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-4 py-3 text-sm text-gray-900 ${column.className || ''}`}
                      >
                        {column.accessor(item)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
};

export default RolesPage;
