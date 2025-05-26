
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Download, Eye, Shield, Users, FileText, Calendar } from 'lucide-react';

const AuditTrail: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  const auditEntries = [
    {
      id: '1',
      timestamp: '2024-01-15 14:30:25',
      user: 'Dr. Sarah Smith',
      action: 'LOGIN',
      resource: 'System',
      details: 'Successful login from IP 192.168.1.100',
      severity: 'info'
    },
    {
      id: '2',
      timestamp: '2024-01-15 14:25:10',
      user: 'Admin User',
      action: 'ROLE_ASSIGNED',
      resource: 'User Management',
      details: 'Assigned Clinical Administrator role to Dr. Johnson',
      severity: 'medium'
    },
    {
      id: '3',
      timestamp: '2024-01-15 14:20:45',
      user: 'Dr. Michael Johnson',
      action: 'PATIENT_ACCESS',
      resource: 'Patient Records',
      details: 'Accessed patient file: Jane Doe (ID: 12345)',
      severity: 'info'
    },
    {
      id: '4',
      timestamp: '2024-01-15 14:15:30',
      user: 'System',
      action: 'PERMISSION_DENIED',
      resource: 'Clinical Notes',
      details: 'User Alex Wilson denied access to delete clinical note',
      severity: 'high'
    },
    {
      id: '5',
      timestamp: '2024-01-15 14:10:15',
      user: 'Practice Admin',
      action: 'SETTINGS_CHANGED',
      resource: 'System Settings',
      details: 'Updated practice-wide notification settings',
      severity: 'medium'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN':
      case 'LOGOUT': return Shield;
      case 'ROLE_ASSIGNED':
      case 'PERMISSION_DENIED': return Users;
      case 'PATIENT_ACCESS':
      case 'CLINICAL_NOTES': return FileText;
      default: return Eye;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Audit Trail</h2>
          <p className="text-gray-600">Track system access and administrative actions</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export Logs</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Filters & Search</span>
            <Badge variant="outline">{auditEntries.length} entries</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="login">Login/Logout</SelectItem>
                <SelectItem value="access">Access Events</SelectItem>
                <SelectItem value="admin">Administrative</SelectItem>
                <SelectItem value="security">Security Events</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="access">Access</TabsTrigger>
          <TabsTrigger value="admin">Administrative</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Recent Audit Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditEntries.map((entry) => {
                  const ActionIcon = getActionIcon(entry.action);
                  return (
                    <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded">
                          <ActionIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{entry.action.replace('_', ' ')}</p>
                            <Badge variant="outline" className={getSeverityColor(entry.severity)}>
                              {entry.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{entry.details}</p>
                          <p className="text-xs text-gray-500">
                            {entry.user} • {entry.timestamp} • {entry.resource}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditEntries.filter(entry => 
                  entry.action.includes('LOGIN') || 
                  entry.action.includes('PERMISSION') ||
                  entry.severity === 'high'
                ).map((entry) => {
                  const ActionIcon = getActionIcon(entry.action);
                  return (
                    <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-red-100 rounded">
                          <ActionIcon className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{entry.action.replace('_', ' ')}</p>
                            <Badge variant="outline" className={getSeverityColor(entry.severity)}>
                              {entry.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{entry.details}</p>
                          <p className="text-xs text-gray-500">
                            {entry.user} • {entry.timestamp}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Access Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Patient access and record viewing events</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Administrative Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Role assignments, settings changes, and system administration</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Error Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">System errors and failed operations</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditTrail;
