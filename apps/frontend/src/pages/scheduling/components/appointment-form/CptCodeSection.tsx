import React, { useMemo } from 'react';
import { CPT_CODES_BY_TYPE } from '@/types/enums/notesEnum';
import { AppointmentTypeValue } from '@/types/scheduleType';
import { SelectField } from '@/components/basic/select';

interface CptCodeSectionProps {
  appointmentType: AppointmentTypeValue;
  cptCode: string;
  onCptCodeChange: (value: string) => void;
  error?: string;
}

const CptCodeSection: React.FC<CptCodeSectionProps> = ({
  appointmentType,
  cptCode,
  onCptCodeChange,
  error
}) => {
  // Map appointment types to CPT code categories
  const getCptCodeCategory = (type: AppointmentTypeValue): string => {
    switch (type) {
      case 'Initial Consultation':
        return 'therapy intake';
      case 'Follow-up':
      case 'Therapy Session':
        return 'therapy session';
      case 'Group Therapy':
        return 'group therapy';
      case 'Assessment':
        return 'psychological evaluation';
      case 'Medication Management':
        return 'consultation';
      case 'Crisis Intervention':
        return 'therapy session';
      case 'Other':
        return 'consultation';
      default:
        return 'therapy session';
    }
  };

  const availableCptCodes = useMemo(() => {
    const category = getCptCodeCategory(appointmentType);
    return CPT_CODES_BY_TYPE[category] || [];
  }, [appointmentType]);

  const selectOptions = useMemo(() => {
    return availableCptCodes.map(code => ({
      value: code.value,
      label: code.label
    }));
  }, [availableCptCodes]);

  const handleCptCodeChange = (value: string) => {
    console.log('CPT Code changed to:', value);
    onCptCodeChange(value);
  };

  return (
    <div>
      <SelectField
        label="CPT Code"
        required={true}
        value={cptCode}
        onValueChange={handleCptCodeChange}
        placeholder="Select CPT Code"
        options={selectOptions}
        containerClassName="w-full"
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {availableCptCodes.length === 0 && (
        <p className="mt-1 text-sm text-gray-500">
          No CPT codes available for this appointment type.
        </p>
      )}
    </div>
  );
};

export default CptCodeSection;
