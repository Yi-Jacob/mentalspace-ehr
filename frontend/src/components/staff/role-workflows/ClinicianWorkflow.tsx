
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Users, DollarSign, Clock } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

const ClinicianWorkflow: React.FC = () => {
  const { canManageClinicalNotes, canManageSchedule, canManageBilling } = usePermissions();

  const clinicalActions = [
    {
      title: 'Clinical Notes',
      description: 'Create and manage patient notes',
      icon: FileText,
      action: 'clinical_notes',
      enabled: canManageClinicalNotes()
    },
    {
      title: 'My Schedule',
      description: 'View and manage appointments',
      icon: Calendar,
      action: 'schedule',
      enabled: canManageSchedule('own_only')
    },
    {
      title: 'Patient Records',
      description: 'Access assigned patient information',
      icon: Users,
      action: 'patient_records',
      enabled: true
    },
    {
      title: 'Billing',
      description: 'Process payments and billing',
      icon: DollarSign,
      action: 'billing',
      enabled: canManageBilling()
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Clinician Dashboard</h2>
          <p className="text-gray-600">Manage your clinical practice and patient care</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Clinician
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {clinicalActions.map((action) => (
          <Card key={action.action} className={!action.enabled ? 'opacity-50' : 'hover:shadow-md transition-shadow cursor-pointer'}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center space-x-2">
                <action.icon className="h-4 w-4" />
                <span>{action.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 mb-3">{action.description}</p>
              <Button 
                size="sm" 
                disabled={!action.enabled}
                className="w-full"
              >
                {action.enabled ? 'Access' : 'Limited Access'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Today's Tasks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 border-l-4 border-yellow-400">
              <div>
                <p className="font-medium">3 Progress Notes Due</p>
                <p className="text-sm text-gray-600">Complete notes for today's sessions</p>
              </div>
              <Badge variant="outline" className="text-yellow-700">Urgent</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 border-l-4 border-blue-400">
              <div>
                <p className="font-medium">5 Appointments Today</p>
                <p className="text-sm text-gray-600">Next appointment at 2:00 PM</p>
              </div>
              <Badge variant="outline" className="text-blue-700">Scheduled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicianWorkflow;
