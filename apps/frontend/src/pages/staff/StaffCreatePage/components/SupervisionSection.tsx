
import React from 'react';
import { SelectField } from '@/components/basic/select';
import CategorySection from '@/components/basic/CategorySection';
import { useStaffQueries } from '@/pages/staff/hook/useStaffQueries';
import { SUPERVISION_TYPE_OPTIONS, SUPERVISION_TYPE_DESCRIPTIONS } from '@/types/enums/staffEnum';

interface SupervisionSectionProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const SupervisionSection: React.FC<SupervisionSectionProps> = ({
  formData,
  onInputChange
}) => {
  const { staffMembers } = useStaffQueries();
  
  // For now, show all active staff members as potential supervisors
  // In the future, this could be filtered by roles when the API supports it
  const availableSupervisors = staffMembers?.filter(staff => 
    staff.is_active && staff.id !== formData.id // Exclude current staff member
  ) || [];

  const requiresSupervisor = formData.supervision_type !== 'Not Supervised';

  // Convert staff members to select options
  const supervisorOptions = availableSupervisors.length > 0 
    ? availableSupervisors.map((supervisor) => ({
        value: supervisor.id,
        label: `${supervisor.first_name} ${supervisor.last_name}${
          supervisor.staff_profile?.job_title ? ` - ${supervisor.staff_profile.job_title}` : ''
        }`
      }))
    : [{ value: 'no-supervisors', label: 'No supervisors available', disabled: true }];

  const handleSupervisionTypeChange = (value: string) => {
    onInputChange('supervision_type', value);
    // Clear supervisor selection if "Not Supervised" is selected
    if (value === 'Not Supervised') {
      onInputChange('supervisor_id', '');
    }
  };

  return (
    <CategorySection
      title="Supervision"
      description="Configure supervision requirements for this staff member"
    >
      <div className="space-y-6">
        {/* Supervision Type */}
        <SelectField
          label="Supervision Type"
          value={formData.supervision_type}
          onValueChange={handleSupervisionTypeChange}
          placeholder="Select supervision type"
          options={SUPERVISION_TYPE_OPTIONS}
        />

        {/* Supervisor Selection - Only show if supervision is required */}
        {requiresSupervisor && (
          <SelectField
            label="Select Supervisor"
            value={formData.supervisor_id || ''}
            onValueChange={(value) => onInputChange('supervisor_id', value)}
            placeholder="Choose a supervisor"
            options={supervisorOptions}
            required
          />
        )}

        {/* Supervision Type Description */}
        {formData.supervision_type && formData.supervision_type !== 'Not Supervised' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Supervision Requirements:</h4>
            <p className="text-sm text-blue-700">
              {SUPERVISION_TYPE_DESCRIPTIONS[formData.supervision_type as keyof typeof SUPERVISION_TYPE_DESCRIPTIONS]}
            </p>
          </div>
        )}

        {/* Validation Message */}
        {requiresSupervisor && (!formData.supervisor_id || formData.supervisor_id === '') && (
          <p className="text-sm text-red-500 mt-1">
            A supervisor must be selected for this supervision type
          </p>
        )}
      </div>
    </CategorySection>
  );
};

export default SupervisionSection;
