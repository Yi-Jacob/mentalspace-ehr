import React, { useState, useEffect, useMemo } from 'react';
import { IntakeFormData } from '@/types/noteType';
import ValidatedInput from '@/components/form/ValidatedInput';
import FormErrorBoundary from '@/components/FormErrorBoundary';
import { validationSchemas, sanitizeInput } from '@/utils/validation';
import ClientInfoDisplay from '../../components/shared/ClientInfoDisplay';
import { SelectField } from '@/components/basic/select';
import { useCptCodes } from '@/hooks/useCptCodes';
import { useClientPhoneNumbers } from '@/hooks/useClientPhoneNumbers';
import { useClientInsurance } from '@/hooks/useClientInsurance';

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
  const { data: phoneNumbers = [], isLoading: isLoadingPhones } = useClientPhoneNumbers(clientData?.id);
  const { data: insuranceOptions = [], isLoading: isLoadingInsurance } = useClientInsurance(clientData?.id);
  
  
  // Set initial values if not already set
  useEffect(() => {
    if (clientData && !formData.primaryPhone && !formData.primaryInsurance) {
      updateFormData({
        primaryPhone: '',
        primaryEmail: clientData.email || '',
        primaryInsurance: '',
      });
    }
  }, [clientData, formData.primaryPhone, formData.primaryInsurance, '', '', updateFormData]);  // Create stable validation handlers for each field
  
  
  const validationHandlers = useMemo(() => ({

    intakeDate: (isValid: boolean, error?: string) => {
      setValidationErrors(prev => ({ ...prev, intakeDate: error || '' }));
    },
    primaryEmail: (isValid: boolean, error?: string) => {
      setValidationErrors(prev => ({ ...prev, primaryEmail: error || '' }));
    },
  }), []);

  // Set initial values if not already set
  useEffect(() => {
    if (clientData && !formData.primaryEmail) {
      updateFormData({
        primaryEmail: clientData.email || '',
      });
    }
  }, [clientData, formData.primaryEmail, updateFormData]);

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
            onValidationChange={validationHandlers.intakeDate}
            validation={validationSchemas.date}
            required
          />

          <SelectField
            label="Primary Phone"
            value={formData.primaryPhone}
            onValueChange={(value) => updateFormData({ primaryPhone: value })}
            options={phoneNumbers}
            placeholder={isLoadingPhones ? "Loading phone numbers..." : "Select primary phone"}
            disabled={isLoadingPhones}
            required
          />

          <ValidatedInput
            id="primaryEmail"
            label="Primary Email"
            type="email"
            value={formData.primaryEmail}
            onChange={(value) => updateFormData({ primaryEmail: value })}
            onValidationChange={validationHandlers.primaryEmail}
            validation={validationSchemas.email}
            sanitizer={sanitizeInput.email}
            placeholder="Enter primary email address"
          />

          <SelectField
            label="Primary Insurance"
            value={formData.primaryInsurance}
            onValueChange={(value) => updateFormData({ primaryInsurance: value })}
            options={insuranceOptions}
            placeholder={isLoadingInsurance ? "Loading insurance..." : "Select primary insurance"}
            disabled={isLoadingInsurance}
            required
          />

          <div className="md:col-span-2">
            <SelectField
              label="CPT Code"
              value={formData.cptCode}
              onValueChange={(value) => updateFormData({ cptCode: value })}
              options={cptCodes}
              placeholder="Select CPT code"
              required
            />
          </div>
        </div>
      </div>
    </FormErrorBoundary>
  );
};

export default ClientOverviewSection;