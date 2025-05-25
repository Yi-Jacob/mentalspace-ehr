
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { IntakeFormData } from '../types/IntakeFormData';
import ValidatedInput from '@/components/form/ValidatedInput';
import FormErrorBoundary from '@/components/FormErrorBoundary';
import { validationSchemas, sanitizeInput } from '@/utils/validation';

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

  console.log('ClientOverviewSection - clientData:', clientData);

  // Fetch CPT codes from database
  const { data: cptCodes = [] } = useQuery({
    queryKey: ['cpt-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cpt_codes')
        .select('code, description, category')
        .eq('is_active', true)
        .order('code');
      
      if (error) throw error;
      return data;
    },
  });

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

        {/* Client Information Display */}
        {clientData && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3">Client Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Full Name</span>
                <p className="text-gray-900">{`${clientData.first_name} ${clientData.last_name}`}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Date of Birth</span>
                <p className="text-gray-900">{clientData.date_of_birth || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Address</span>
                <p className="text-gray-900">
                  {clientData.address_1 ? 
                    `${clientData.address_1}${clientData.address_2 ? `, ${clientData.address_2}` : ''}, ${clientData.city || ''} ${clientData.state || ''} ${clientData.zip_code || ''}`.trim() 
                    : 'Not provided'
                  }
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Gender Identity</span>
                <p className="text-gray-900">{clientData.gender_identity || 'Not provided'}</p>
              </div>
            </div>
          </div>
        )}

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
            <span className="text-sm font-medium">CPT Code</span>
            <Select
              value={formData.cptCode}
              onValueChange={(value) => updateFormData({ cptCode: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select CPT Code" />
              </SelectTrigger>
              <SelectContent>
                {cptCodes.map((cpt) => (
                  <SelectItem key={cpt.code} value={cpt.code}>
                    {cpt.code} - {cpt.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </FormErrorBoundary>
  );
};

export default ClientOverviewSection;
