import React, { useEffect } from 'react';
import { IntakeFormData } from '@/types/noteType';
import FormErrorBoundary from '@/components/FormErrorBoundary';
import ClientInfoDisplay from '../../components/shared/ClientInfoDisplay';
import { SelectField } from '@/components/basic/select';
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
  const { data: cptCodes = [] } = useCptCodes();
  
  // Set initial values if not already set
  useEffect(() => {
    if (clientData && !formData.primaryPhone && !formData.primaryInsurance) {
      updateFormData({
        primaryPhone: '',
        primaryEmail: clientData.email || '',
        primaryInsurance: '',
      });
    }
  }, [clientData, formData.primaryPhone, formData.primaryInsurance, updateFormData]);

  return (
    <FormErrorBoundary formName="Client Overview">
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Client Overview</h4>
          <p className="text-blue-700 text-sm">
            Basic client information and contact details for this intake assessment.
          </p>
        </div>

        <ClientInfoDisplay clientData={clientData}/>

        {/* Editable CPT Code */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h5 className="font-medium text-gray-900 mb-3">Billing Information</h5>
          <div className="max-w-md">
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