
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useEnhancedStaffRoles } from '@/hooks/useEnhancedStaffRoles';

const SupervisorWorkflow: React.FC = () => {
  const { canSupervise } = useEnhancedStaffRoles();

  const supervisionActions = [
    {
      title: 'Supervisee Notes',
      description: 'Review and co-sign supervisee notes',
      icon: FileText,
      action: 'supervisee_notes',
      enabled: canSupervise()
    },
    {
      title: 'Supervision Sessions',
      description: 'Schedule and document supervision',
      icon: Users,
      action: 'supervision_sessions',
      enabled: canSupervise()
    },
    {
      title: 'Co-signing Queue',
      description: 'Notes pending your signature',
      icon: CheckCircle,
      action: 'cosign_queue',
      enabled: canSupervise()
    },
    {
      title: 'Supervisee Progress',
      description: 'Track supervisee development',
      icon: AlertTriangle,
      action: 'progress_tracking',
      enabled: canSupervise()
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Supervisor Dashboard</h2>
          <p className="text-gray-600">Oversee supervisee clinical work and development</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Supervisor
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {supervisionActions.map((action) => (
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
                {action.enabled ? 'Access' : 'No Permission'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Pending Co-signatures</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 border-l-4 border-red-400">
                <div>
                  <p className="font-medium">Progress Note - Jane Smith</p>
                  <p className="text-sm text-gray-600">Intern A. Johnson - Due today</p>
                </div>
                <Button size="sm" variant="outline">Review</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 border-l-4 border-yellow-400">
                <div>
                  <p className="font-medium">Treatment Plan - John Doe</p>
                  <p className="text-sm text-gray-600">Associate B. Wilson - Due tomorrow</p>
                </div>
                <Button size="sm" variant="outline">Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>My Supervisees</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Alex Johnson (Intern)</p>
                  <p className="text-sm text-gray-600">Next supervision: Tomorrow 3 PM</p>
                </div>
                <Badge variant="outline" className="text-green-700">On Track</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Blake Wilson (Associate)</p>
                  <p className="text-sm text-gray-600">Next supervision: Friday 2 PM</p>
                </div>
                <Badge variant="outline" className="text-yellow-700">Needs Review</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupervisorWorkflow;
