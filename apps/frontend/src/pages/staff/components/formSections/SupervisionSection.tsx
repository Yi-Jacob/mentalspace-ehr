
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
    staff.isActive && staff.id !== formData.id // Exclude current staff member
  ) || [];

  const requiresSupervisor = formData.supervisionType !== 'Not Supervised';

  // Convert staff members to select options
  const supervisorOptions = availableSupervisors.length > 0 
    ? availableSupervisors.map((supervisor) => ({
        value: supervisor.id,
        label: `${supervisor.firstName} ${supervisor.lastName}${
          supervisor.staffProfile?.jobTitle ? ` - ${supervisor.staffProfile.jobTitle}` : ''
        }`
      }))
    : [{ value: 'no-supervisors', label: 'No supervisors available', disabled: true }];

  const handleSupervisionTypeChange = (value: string) => {
    onInputChange('supervisionType', value);
    // Clear supervisor selection if "Not Supervised" is selected
    if (value === 'Not Supervised') {
      onInputChange('supervisorId', '');
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
          value={formData.supervisionType}
          onValueChange={handleSupervisionTypeChange}
          placeholder="Select supervision type"
          options={SUPERVISION_TYPE_OPTIONS}
        />

        {/* Supervisor Selection - Only show if supervision is required */}
        {requiresSupervisor && (
          <SelectField
            label="Select Supervisor"
            value={formData.supervisorId || ''}
            onValueChange={(value) => onInputChange('supervisorId', value)}
            placeholder="Choose a supervisor"
            options={supervisorOptions}
            required
          />
        )}

        {/* Supervision Type Description */}
        {formData.supervisionType && formData.supervisionType !== 'Not Supervised' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Supervision Requirements:</h4>
            <p className="text-sm text-blue-700">
              {SUPERVISION_TYPE_DESCRIPTIONS[formData.supervisionType as keyof typeof SUPERVISION_TYPE_DESCRIPTIONS]}
            </p>
          </div>
        )}

        {/* Validation Message */}
        {requiresSupervisor && (!formData.supervisorId || formData.supervisorId === '') && (
          <p className="text-sm text-red-500 mt-1">
            A supervisor must be selected for this supervision type
          </p>
        )}
      </div>
    </CategorySection>
  );
};

export default SupervisionSection;
