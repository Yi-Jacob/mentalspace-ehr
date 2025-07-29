
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/basic/tabs';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { Eye, EyeOff } from 'lucide-react';
import { UserRole } from '@/types/staff';

const RolePermissionsViewer: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Clinician');
  const [showDetails, setShowDetails] = useState(false);

  const rolePermissions: Record<UserRole, {
    description: string;
    permissions: string[];
    restrictions: string[];
    accessLevel: 'Full' | 'Limited' | 'Restricted';
  }> = {
    'Practice Administrator': {
      description: 'Complete system administration with full access to all features and data.',
      permissions: [
        'Add, edit, and deactivate user accounts',
        'Assign and modify user roles',
        'Access all patient records',
        'Manage practice-wide settings',
        'View audit logs and system reports',
        'Manage billing for all patients',
        'Schedule appointments for all providers',
        'Access all clinical notes'
      ],
      restrictions: [],
      accessLevel: 'Full'
    },
    'Clinical Administrator': {
      description: 'Administrative access to clinical operations. Must also have Clinician role.',
      permissions: [
        'Access any patient records',
        'Grant patient access to other clinicians',
        'View all clinical notes',
        'Manage clinical workflows',
        'Oversee clinical compliance'
      ],
      restrictions: [
        'Must have Clinician role assigned',
        'Cannot modify system settings',
        'Cannot manage user accounts'
      ],
      accessLevel: 'Full'
    },
    'Clinician': {
      description: 'Licensed healthcare providers who deliver direct patient care.',
      permissions: [
        'Access assigned patient records',
        'Create and edit clinical notes',
        'Schedule own appointments',
        'Bill insurance with own credentials',
        'Manage treatment plans for assigned patients',
        'View own schedule and patient list'
      ],
      restrictions: [
        'Cannot access unassigned patient records',
        'Cannot modify other clinicians\' notes',
        'Cannot assign roles or manage users'
      ],
      accessLevel: 'Limited'
    },
    'Supervisor': {
      description: 'Experienced clinicians who provide oversight to other clinical staff.',
      permissions: [
        'Access supervisee patient records',
        'Co-sign supervisee notes',
        'View supervisee schedules',
        'Provide clinical oversight',
        'All Clinician permissions for own patients'
      ],
      restrictions: [
        'Access limited to assigned supervisees',
        'Cannot supervise without assignment',
        'Cannot access admin functions'
      ],
      accessLevel: 'Limited'
    },
    'Intern': {
      description: 'Students or trainees providing services under supervision.',
      permissions: [
        'Access assigned patient records',
        'Create clinical notes (requires co-signature)',
        'View own schedule',
        'Participate in assigned patient care'
      ],
      restrictions: [
        'Cannot bill insurance independently',
        'All notes require supervisor co-signature',
        'Must have assigned supervisor',
        'Limited administrative access'
      ],
      accessLevel: 'Restricted'
    },
    'Assistant': {
      description: 'Clinical support staff with limited patient access.',
      permissions: [
        'Access assigned patient records',
        'Create limited note types',
        'Assist with patient care activities',
        'View assigned schedules'
      ],
      restrictions: [
        'Cannot bill insurance independently',
        'Limited note creation capabilities',
        'Cannot access admin functions',
        'Requires supervision for billing'
      ],
      accessLevel: 'Restricted'
    },
    'Associate': {
      description: 'Early-career clinicians with some practice limitations.',
      permissions: [
        'Access assigned patient records',
        'Create clinical notes',
        'Limited scheduling access',
        'Provide clinical services'
      ],
      restrictions: [
        'Cannot bill insurance independently',
        'May require supervision for complex cases',
        'Limited administrative access'
      ],
      accessLevel: 'Restricted'
    },
    'Practice Scheduler': {
      description: 'Administrative staff responsible for appointment management.',
      permissions: [
        'Schedule appointments for all providers',
        'Reschedule and cancel appointments',
        'Add and edit patient demographics',
        'Create scheduling-related notes',
        'View provider schedules'
      ],
      restrictions: [
        'Cannot access clinical notes',
        'Cannot view detailed patient records',
        'Cannot manage billing information',
        'Limited to scheduling functions'
      ],
      accessLevel: 'Limited'
    },
    'Practice Biller': {
      description: 'Dedicated billing staff with comprehensive financial access.',
      permissions: [
        'Access all patient billing information',
        'Process insurance claims',
        'Generate billing reports',
        'Verify insurance benefits',
        'Manage patient accounts',
        'Process payments and adjustments'
      ],
      restrictions: [
        'Cannot access clinical notes',
        'Cannot schedule appointments',
        'Cannot modify patient clinical data'
      ],
      accessLevel: 'Limited'
    },
    'Biller for Assigned Patients Only': {
      description: 'Clinicians with billing responsibilities for their assigned patients.',
      permissions: [
        'Collect copays from assigned patients',
        'Process credit card payments',
        'Enter payment information',
        'View billing status for assigned patients'
      ],
      restrictions: [
        'Billing access limited to assigned patients only',
        'Cannot access practice-wide billing',
        'Cannot generate comprehensive billing reports'
      ],
      accessLevel: 'Restricted'
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'Full': return 'bg-green-100 text-green-800';
      case 'Limited': return 'bg-yellow-100 text-yellow-800';
      case 'Restricted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const allRoles: UserRole[] = [
    'Practice Administrator',
    'Clinical Administrator',
    'Clinician',
    'Supervisor',
    'Intern',
    'Assistant',
    'Associate',
    'Practice Scheduler',
    'Practice Biller',
    'Biller for Assigned Patients Only'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Role Permissions Reference</h2>
          <p className="text-gray-600">Understanding what each role can access and do in the system</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-2"
        >
          {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span>{showDetails ? 'Hide' : 'Show'} Details</span>
        </Button>
      </div>

      <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
        <TabsList className="grid grid-cols-5 lg:grid-cols-10 gap-1">
          {allRoles.map(role => (
            <TabsTrigger
              key={role}
              value={role}
              className="text-xs px-2 py-1"
              title={role}
            >
              {role.split(' ')[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {allRoles.map(role => (
          <TabsContent key={role} value={role}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{role}</span>
                  <Badge className={getAccessLevelColor(rolePermissions[role].accessLevel)}>
                    {rolePermissions[role].accessLevel} Access
                  </Badge>
                </CardTitle>
                <p className="text-gray-600">{rolePermissions[role].description}</p>
              </CardHeader>
              
              {showDetails && (
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Permissions:</h4>
                    <ul className="space-y-1">
                      {rolePermissions[role].permissions.map((permission, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span className="text-sm">{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {rolePermissions[role].restrictions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">Restrictions:</h4>
                      <ul className="space-y-1">
                        {rolePermissions[role].restrictions.map((restriction, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-red-600 mt-1">•</span>
                            <span className="text-sm">{restriction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default RolePermissionsViewer;
