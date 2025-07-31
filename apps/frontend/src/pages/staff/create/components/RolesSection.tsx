
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Checkbox } from '@/components/basic/checkbox';
import { Label } from '@/components/basic/label';
import { UserRole } from '@/types/staffType';
import { HelpCircle } from 'lucide-react';

interface RolesSectionProps {
  formData: any;
  onRoleToggle: (role: UserRole) => void;
}

const roleDescriptions = {
  'Practice Administrator': 'A TherapyNotes Practice Administrator can add and edit TherapyNotes users, change user roles, reset passwords, and set account access settings.',
  'Practice Scheduler': 'A Scheduler can schedule, reschedule, and cancel appointments for any clinician. They can add, edit, or remove new patients.',
  'Clinician': 'Clinicians provide services to a client. They can view and edit their own schedule, complete notes and manage records of patients assigned to them.',
  'Intern': 'The Intern role is similar to a Clinician but with limitations. Interns do not have an NPI and can only bill to insurance under a Supervisor\'s credentials.',
  'Assistant': 'The Intern role is similar to a Clinician but with limitations. Interns do not have an NPI and can only bill to insurance under a Supervisor\'s credentials.',
  'Associate': 'The Intern role is similar to a Clinician but with limitations. Interns do not have an NPI and can only bill to insurance under a Supervisor\'s credentials.',
  'Supervisor': 'A Supervisor can be assigned to individual clinicians and interns, granting full access to their supervisees\' patient\'s notes.',
  'Clinical Administrator': 'A Clinical Administrator must also have the Clinician role. They can access any patient\'s records and can give other clinicians access to any patient records.',
  'Biller for Assigned Patients Only': 'Clinicians with this role can collect and enter copay information, including by processing patient credit cards.',
  'Practice Biller': 'A Practice Biller has full billing access to all patients in the practice. They can verify patient insurance, generate and track claims, enter patient and insurance payments, and run billing reports.'
};

const RolesSection: React.FC<RolesSectionProps> = ({
  formData,
  onRoleToggle
}) => {
  const [showInstructions, setShowInstructions] = React.useState(false);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-800">Roles</CardTitle>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setShowInstructions(!showInstructions)}
            className="flex items-center space-x-2 bg-white/80 border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            <span>{showInstructions ? 'Hide Instructions' : 'Show Instructions'}</span>
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Each user can have multiple roles. A user's roles determine what they can access within TherapyNotes.
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Practice Administration */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-700 border-b border-gray-200 pb-2">
              Practice Administration
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <Checkbox
                  id="practice_administrator"
                  checked={formData.roles.includes('Practice Administrator')}
                  onCheckedChange={() => onRoleToggle('Practice Administrator')}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label htmlFor="practice_administrator" className="font-medium text-gray-700 cursor-pointer">
                    Practice Administrator
                  </Label>
                  {showInstructions && (
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {roleDescriptions['Practice Administrator']}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Scheduling Access */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-700 border-b border-gray-200 pb-2">
              Scheduling Access
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <Checkbox
                  id="practice_scheduler"
                  checked={formData.roles.includes('Practice Scheduler')}
                  onCheckedChange={() => onRoleToggle('Practice Scheduler')}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <Label htmlFor="practice_scheduler" className="font-medium text-gray-700 cursor-pointer">
                    Practice Scheduler
                  </Label>
                  {showInstructions && (
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      {roleDescriptions['Practice Scheduler']}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Access */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-700 border-b border-gray-200 pb-2">
              Clinical Access
            </h3>
            <div className="space-y-4">
              {(['Clinician', 'Intern', 'Supervisor', 'Clinical Administrator'] as UserRole[]).map((role) => (
                <div key={role} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id={role.toLowerCase().replace(' ', '_')}
                    checked={formData.roles.includes(role)}
                    onCheckedChange={() => onRoleToggle(role)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label htmlFor={role.toLowerCase().replace(' ', '_')} className="font-medium text-gray-700 cursor-pointer">
                      {role === 'Intern' ? 'Intern / Assistant / Associate' : role}
                    </Label>
                    {showInstructions && (
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {roleDescriptions[role]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing Access */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-700 border-b border-gray-200 pb-2">
              Billing Access
            </h3>
            <div className="space-y-4">
              {(['Biller for Assigned Patients Only', 'Practice Biller'] as UserRole[]).map((role) => (
                <div key={role} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id={role.toLowerCase().replace(/\s+/g, '_')}
                    checked={formData.roles.includes(role)}
                    onCheckedChange={() => onRoleToggle(role)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <Label htmlFor={role.toLowerCase().replace(/\s+/g, '_')} className="font-medium text-gray-700 cursor-pointer">
                      {role}
                    </Label>
                    {showInstructions && (
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {roleDescriptions[role]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesSection;
