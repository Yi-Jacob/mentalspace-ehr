
import React, { useState, useMemo } from 'react';
import { Shield, Search, ChevronUp, ChevronDown, Info } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Badge } from '@/components/basic/badge';
import { Input } from '@/components/basic/input';
import { 
  USER_ROLE_OPTIONS, 
  PERMISSION_OPTIONS, 
  PERMISSION_DESCRIPTIONS, 
  ROLE_PERMISSIONS 
} from '@/types/enums/staffEnum';

interface PermissionData {
  permission: string;
  description: string;
  roles: string[];
}

interface PermissionColumn {
  key: string;
  header: React.ReactNode;
  accessor: (item: PermissionData) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  className?: string;
}

const PermissionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Create permission data
  const permissionData: PermissionData[] = useMemo(() => {
    return PERMISSION_OPTIONS.map(permission => {
      const roles = USER_ROLE_OPTIONS.filter(role => 
        ROLE_PERMISSIONS[role.value as keyof typeof ROLE_PERMISSIONS]?.includes(permission.value)
      ).map(role => role.value);

      return {
        permission: permission.value,
        description: PERMISSION_DESCRIPTIONS[permission.value as keyof typeof PERMISSION_DESCRIPTIONS] || '',
        roles
      };
    });
  }, []);

  // Create table columns
  const columns: PermissionColumn[] = useMemo(() => {
    const baseColumns: PermissionColumn[] = [
      {
        key: 'permission',
        header: 'Permission',
        accessor: (item) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{item.permission}</span>
            <span className="text-sm text-gray-500 line-clamp-2">{item.description}</span>
          </div>
        ),
        sortable: true,
        width: '300px',
      },
    ];

    // Add role columns
    const roleColumns: PermissionColumn[] = USER_ROLE_OPTIONS.map((roleOption) => ({
      key: `role_${roleOption.value}`,
      header: (
        <div className="flex flex-col items-center space-y-1">
          <span className="text-xs font-medium text-gray-700 text-center">{roleOption.label}</span>
          <Badge variant="secondary" className="text-xs">
            {permissionData.filter(perm => perm.roles.includes(roleOption.value)).length}
          </Badge>
        </div>
      ),
      accessor: (item) => {
        const hasPermission = item.roles.includes(roleOption.value);
        
        return (
          <div className="flex justify-center">
            {hasPermission ? (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">✓</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-xs text-gray-400">-</span>
              </div>
            )}
          </div>
        );
      },
      sortable: true,
      width: '120px',
      className: 'text-center',
    }));

    return [...baseColumns, ...roleColumns];
  }, [permissionData]);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = permissionData;

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.permission.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortColumn === 'permission') {
          aValue = a.permission;
          bValue = b.permission;
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
  }, [permissionData, searchTerm, sortColumn, sortDirection]);

  // Handle sort
  const handleSort = (columnKey: string) => {
    setSortColumn(columnKey);
    setSortDirection(prev => 
      prev === 'asc' && sortColumn === columnKey ? 'desc' : 'asc'
    );
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPermissions = PERMISSION_OPTIONS.length;
    const totalRoles = USER_ROLE_OPTIONS.length;
    const totalAssignments = permissionData.reduce((sum, perm) => sum + perm.roles.length, 0);
    
    return {
      totalPermissions,
      totalRoles,
      totalAssignments,
      averagePermissionsPerRole: totalRoles > 0 ? (totalAssignments / totalRoles).toFixed(1) : '0'
    };
  }, [permissionData]);

  return (
    <PageLayout>
      <PageHeader
        icon={Shield}
        title="Permission Matrix"
        description="View which permissions are granted to each role in the system"
        action={
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              {stats.totalPermissions} Permissions
            </Badge>
            <Badge variant="outline" className="text-sm">
              {stats.totalRoles} Roles
            </Badge>
            <Badge variant="outline" className="text-sm">
              {stats.totalAssignments} Assignments
            </Badge>
          </div>
        }
      />

      {/* Statistics */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Permission Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Permissions</span>
              <Badge variant="default">{stats.totalPermissions}</Badge>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Roles</span>
              <Badge variant="default">{stats.totalRoles}</Badge>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Assignments</span>
              <Badge variant="default">{stats.totalAssignments}</Badge>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Avg. Permissions/Role</span>
              <Badge variant="secondary">{stats.averagePermissionsPerRole}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Permission Matrix</h3>
              <p className="text-sm text-gray-600 mt-1">
                View which permissions are granted to each role. Green dots indicate granted permissions.
              </p>
            </div>
            <div className="relative w-80">
              <Input
                placeholder="Search permissions..."
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
              {processedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                    {searchTerm ? 'No permissions found matching your search' : 'No permissions found'}
                  </td>
                </tr>
              ) : (
                processedData.map((item) => (
                  <tr
                    key={item.permission}
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

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Legend</h4>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Permission Granted</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-sm text-gray-600">Permission Not Granted</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PermissionsPage;
