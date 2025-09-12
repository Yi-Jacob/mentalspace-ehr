import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  User, 
  Monitor, 
  Smartphone, 
  Tablet,
  Globe,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  LogIn,
  LogOut,
  Activity
} from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import PageHeader from '@/components/basic/PageHeader';
import PageLayout from '@/components/basic/PageLayout';
import { auditService, AuditLog, AuditLogFilters } from '@/services/auditService';
import { format } from 'date-fns';

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<AuditLogFilters>({
    limit: 50,
    offset: 0,
  });
  const [filterOptions, setFilterOptions] = useState<{
    actions: string[];
    resources: string[];
    users: string[];
  }>({ actions: [], resources: [], users: [] });

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await auditService.getAuditLogs(filters);
      setLogs(response.logs);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const options = await auditService.getFilterOptions();
      setFilterOptions(options);
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [filters]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const handleFilterChange = (key: keyof AuditLogFilters, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: 0, // Reset pagination when filters change
    }));
  };

  const handleExport = async () => {
    try {
      const blob = await auditService.exportAuditLogs(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export audit logs:', error);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <Plus className="h-4 w-4" />;
      case 'READ': return <Eye className="h-4 w-4" />;
      case 'UPDATE': return <Edit className="h-4 w-4" />;
      case 'DELETE': return <Trash2 className="h-4 w-4" />;
      case 'LOGIN': return <LogIn className="h-4 w-4" />;
      case 'LOGOUT': return <LogOut className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-800';
      case 'READ': return 'bg-blue-100 text-blue-800';
      case 'UPDATE': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'LOGIN': return 'bg-green-100 text-green-800';
      case 'LOGOUT': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType) {
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Activity}
        title="Audit Logs"
        description="Monitor system activity and user actions"
        action={
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
              <Select value={filters.userId || 'all'} onValueChange={(value) => handleFilterChange('userId', value === 'all' ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All users</SelectItem>
                  {filterOptions.users.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <Select value={filters.action || 'all'} onValueChange={(value) => handleFilterChange('action', value === 'all' ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All actions</SelectItem>
                  {filterOptions.actions.map(action => (
                    <SelectItem key={action} value={action}>{action}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resource</label>
              <Select value={filters.resource || 'all'} onValueChange={(value) => handleFilterChange('resource', value === 'all' ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All resources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All resources</SelectItem>
                  {filterOptions.resources.map(resource => (
                    <SelectItem key={resource} value={resource}>{resource}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
                  placeholder="Start date"
                />
                <Input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
                  placeholder="End date"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs ({total} total)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`${getActionColor(log.action)} flex items-center gap-1`}>
                          {getActionIcon(log.action)}
                          {log.action}
                        </Badge>
                        <Badge variant="outline">{log.resource}</Badge>
                        {log.resourceId && (
                          <Badge variant="secondary">ID: {log.resourceId}</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{log.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {log.userEmail} ({log.userRole})
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                        </div>
                        {log.deviceType && (
                          <div className="flex items-center gap-1">
                            {getDeviceIcon(log.deviceType)}
                            {log.deviceType} • {log.browser} • {log.os}
                          </div>
                        )}
                        {log.ipAddress && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {log.ipAddress}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {logs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No audit logs found matching your filters.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {total > (filters.limit || 50) && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {filters.offset || 0 + 1} to {Math.min((filters.offset || 0) + (filters.limit || 50), total)} of {total} results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={(filters.offset || 0) === 0}
              onClick={() => setFilters(prev => ({ ...prev, offset: Math.max(0, (prev.offset || 0) - (prev.limit || 50)) }))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={(filters.offset || 0) + (filters.limit || 50) >= total}
              onClick={() => setFilters(prev => ({ ...prev, offset: (prev.offset || 0) + (prev.limit || 50) }))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      </div>
    </PageLayout>
  );
};

export default AuditLogsPage;
