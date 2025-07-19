
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStaffQueries } from '@/hooks/useStaffQueries';

interface SupervisionSectionProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const supervisionOptions = [
  { value: 'Not Supervised', label: 'Not Supervised' },
  { value: 'Access patient notes and co-sign notes for selected payers', label: 'Access patient notes and co-sign notes for selected payers' },
  { value: 'Must review and approve all notes', label: 'Must review and approve all notes' },
  { value: 'Must review and co-sign all notes', label: 'Must review and co-sign all notes' }
];

const SupervisionSection: React.FC<SupervisionSectionProps> = ({
  formData,
  onInputChange
}) => {
  const { staffMembers } = useStaffQueries();
  
  // Filter staff members who can be supervisors (have Supervisor role)
  const availableSupervisors = staffMembers?.filter(staff => 
    staff.roles?.some(role => role.role === 'Supervisor' && role.is_active)
  ) || [];

  const requiresSupervisor = formData.supervision_type !== 'Not Supervised';

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="text-xl font-semibold text-gray-800">Supervision</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Configure supervision requirements for this staff member
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Supervision Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Supervision Type:</Label>
            <Select 
              value={formData.supervision_type} 
              onValueChange={(value) => {
                onInputChange('supervision_type', value);
                // Clear supervisor selection if "Not Supervised" is selected
                if (value === 'Not Supervised') {
                  onInputChange('supervisor_id', '');
                }
              }}
            >
              <SelectTrigger className="bg-white border-gray-200 focus:border-blue-400">
                <SelectValue placeholder="Select supervision type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg max-h-60 z-50">
                {supervisionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-blue-50">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Supervisor Selection - Only show if supervision is required */}
          {requiresSupervisor && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Select Supervisor: <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.supervisor_id || ''} 
                onValueChange={(value) => onInputChange('supervisor_id', value)}
              >
                <SelectTrigger className="bg-white border-gray-200 focus:border-blue-400">
                  <SelectValue placeholder="Choose a supervisor" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg max-h-60 z-50">
                  {availableSupervisors.length > 0 ? (
                    availableSupervisors.map((supervisor) => (
                      <SelectItem key={supervisor.id} value={supervisor.id} className="hover:bg-blue-50">
                        {supervisor.first_name} {supervisor.last_name}
                        {supervisor.staff_profile?.job_title && ` - ${supervisor.staff_profile.job_title}`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-supervisors" disabled className="text-gray-500">
                      No supervisors available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {requiresSupervisor && (!formData.supervisor_id || formData.supervisor_id === '') && (
                <p className="text-sm text-red-500 mt-1">
                  A supervisor must be selected for this supervision type
                </p>
              )}
            </div>
          )}

          {/* Supervision Type Description */}
          {formData.supervision_type && formData.supervision_type !== 'Not Supervised' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Supervision Requirements:</h4>
              <p className="text-sm text-blue-700">
                {formData.supervision_type === 'Access patient notes and co-sign notes for selected payers' && 
                  'This staff member will have access to patient notes and can co-sign notes for specific insurance payers as designated by their supervisor.'}
                {formData.supervision_type === 'Must review and approve all notes' && 
                  'All clinical notes created by this staff member must be reviewed and approved by their assigned supervisor before being finalized.'}
                {formData.supervision_type === 'Must review and co-sign all notes' && 
                  'All clinical notes created by this staff member must be reviewed and co-signed by their assigned supervisor for billing and compliance purposes.'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SupervisionSection;
