
import React, { useState } from 'react';
import { IntakeFormData } from '../types/IntakeFormData';
import ValidatedInput from '@/components/form/ValidatedInput';
import FormErrorBoundary from '@/components/FormErrorBoundary';
import { validationSchemas, sanitizeInput } from '@/utils/validation';
import ClientInfoDisplay from '../../shared/ClientInfoDisplay';
import SearchableSelect from '../../shared/SearchableSelect';
import { useCptCodes } from '@/hooks/useCptCodes';

interface ClientOverviewSectionProps {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  clientData: any;
}

const ClientOverviewSection: React.FC<ClientOverviewSectionProps> = ({
  formData,
  updateFormData,
  clientData,
}) => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { data: cptCodes = [] } = useCptCodes();

  console.log('ClientOverviewSection - clientData:', clientData);

  // Get primary phone number
  const primaryPhone = clientData?.phone_numbers?.find(
    (phone: any) => phone.phone_type === 'Mobile' || phone.phone_type === 'Home' || phone.phone_type === 'Work' || phone.phone_type === 'Other'
  )?.phone_number || '';

  // Get primary insurance
  const primaryInsurance = clientData?.insurance_info?.find(
    (insurance: any) => insurance.is_active
  )?.insurance_company || '';

  // Set initial values if not already set
  React.useEffect(() => {
    if (clientData && !formData.primaryPhone && !formData.primaryInsurance) {
      updateFormData({
        primaryPhone: primaryPhone,
        primaryEmail: clientData.email || '',
        primaryInsurance: primaryInsurance,
      });
    }
  }, [clientData, formData.primaryPhone, formData.primaryInsurance, primaryPhone, primaryInsurance, updateFormData]);

  const handleValidationChange = (field: string) => (isValid: boolean, error?: string) => {
    setValidationErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
  };

  return (
    <FormErrorBoundary formName="Client Overview">
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Client Overview</h4>
          <p className="text-blue-700 text-sm">
            Basic client information and contact details for this intake assessment.
          </p>
        </div>

        <ClientInfoDisplay clientData={clientData} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ValidatedInput
            id="intakeDate"
            label="Intake Date"
            type="date"
            value={formData.intakeDate}
            onChange={(value) => updateFormData({ intakeDate: value })}
            onValidationChange={handleValidationChange('intakeDate')}
            validation={validationSchemas.date}
            required
          />

          <ValidatedInput
            id="primaryPhone"
            label="Primary Phone"
            type="tel"
            value={formData.primaryPhone}
            onChange={(value) => updateFormData({ primaryPhone: value })}
            onValidationChange={handleValidationChange('primaryPhone')}
            validation={validationSchemas.phone}
            sanitizer={sanitizeInput.phone}
            placeholder="Enter primary phone number"
          />

          <ValidatedInput
            id="primaryEmail"
            label="Primary Email"
            type="email"
            value={formData.primaryEmail}
            onChange={(value) => updateFormData({ primaryEmail: value })}
            onValidationChange={handleValidationChange('primaryEmail')}
            validation={validationSchemas.email}
            sanitizer={sanitizeInput.email}
            placeholder="Enter primary email address"
          />

          <ValidatedInput
            id="primaryInsurance"
            label="Primary Insurance"
            value={formData.primaryInsurance}
            onChange={(value) => updateFormData({ primaryInsurance: value })}
            onValidationChange={handleValidationChange('primaryInsurance')}
            validation={validationSchemas.textArea}
            sanitizer={sanitizeInput.text}
            placeholder="Enter primary insurance"
          />

          <div className="md:col-span-2">
            <SearchableSelect
              label="CPT Code"
              value={formData.cptCode}
              onChange={(value) => updateFormData({ cptCode: value })}
              options={cptCodes}
              placeholder="Search CPT codes..."
              required
            />
          </div>
        </div>
      </div>
    </FormErrorBoundary>
  );
};

export default ClientOverviewSection;
