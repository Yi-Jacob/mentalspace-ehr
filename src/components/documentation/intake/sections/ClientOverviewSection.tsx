
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { IntakeFormData } from '../types/IntakeFormData';

// CPT Codes for mental health services
const CPT_CODES = [
  { code: '90791', description: 'Psychiatric diagnostic evaluation' },
  { code: '90792', description: 'Psychiatric diagnostic evaluation with medical services' },
  { code: '90834', description: 'Psychotherapy, 45 minutes' },
  { code: '90837', description: 'Psychotherapy, 60 minutes' },
  { code: '90847', description: 'Family psychotherapy with patient present' },
  { code: '90853', description: 'Group psychotherapy' },
  { code: '90901', description: 'Biofeedback training' },
];

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
  console.log('ClientOverviewSection - clientData:', clientData);

  // Get primary phone number
  const primaryPhone = clientData?.client_phone_numbers?.find(
    (phone: any) => phone.phone_type === 'Mobile' || phone.phone_type === 'Home' || phone.phone_type === 'Work' || phone.phone_type === 'Other'
  )?.phone_number || '';

  // Get primary insurance
  const primaryInsurance = clientData?.client_insurance?.find(
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

  return (
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
              <Label className="text-sm font-medium text-gray-600">Full Name</Label>
              <p className="text-gray-900">{`${clientData.first_name} ${clientData.last_name}`}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Date of Birth</Label>
              <p className="text-gray-900">{clientData.date_of_birth || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Address</Label>
              <p className="text-gray-900">
                {clientData.address_1 ? 
                  `${clientData.address_1}${clientData.address_2 ? `, ${clientData.address_2}` : ''}, ${clientData.city || ''} ${clientData.state || ''} ${clientData.zip_code || ''}`.trim() 
                  : 'Not provided'
                }
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Gender Identity</Label>
              <p className="text-gray-900">{clientData.gender_identity || 'Not provided'}</p>
            </div>
          </div>

          {/* Prior Diagnoses */}
          {clientData.prior_diagnoses && clientData.prior_diagnoses.length > 0 && (
            <div className="mt-4">
              <Label className="text-sm font-medium text-gray-600">Prior Diagnoses on Record</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {clientData.prior_diagnoses.map((diagnosis: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {diagnosis}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="intakeDate">Intake Date</Label>
          <Input
            id="intakeDate"
            type="date"
            value={formData.intakeDate}
            onChange={(e) => updateFormData({ intakeDate: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="primaryPhone">Primary Phone</Label>
          <Input
            id="primaryPhone"
            type="tel"
            value={formData.primaryPhone}
            onChange={(e) => updateFormData({ primaryPhone: e.target.value })}
            placeholder="Enter primary phone number"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="primaryEmail">Primary Email</Label>
          <Input
            id="primaryEmail"
            type="email"
            value={formData.primaryEmail}
            onChange={(e) => updateFormData({ primaryEmail: e.target.value })}
            placeholder="Enter primary email address"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="primaryInsurance">Primary Insurance</Label>
          <Input
            id="primaryInsurance"
            value={formData.primaryInsurance}
            onChange={(e) => updateFormData({ primaryInsurance: e.target.value })}
            placeholder="Enter primary insurance"
            className="mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="cptCode">CPT Code</Label>
          <Select
            value={formData.cptCode}
            onValueChange={(value) => updateFormData({ cptCode: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select CPT Code" />
            </SelectTrigger>
            <SelectContent>
              {CPT_CODES.map((cpt) => (
                <SelectItem key={cpt.code} value={cpt.code}>
                  {cpt.code} - {cpt.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ClientOverviewSection;
