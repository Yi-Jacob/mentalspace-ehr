
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { IntakeFormData } from '../IntakeAssessmentForm';

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
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Client Name</Label>
            <Input
              value={`${clientData?.first_name || ''} ${clientData?.last_name || ''}`}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label>Date of Birth</Label>
            <Input
              value={clientData?.date_of_birth ? format(new Date(clientData.date_of_birth), 'MMM d, yyyy') : 'Not specified'}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label>Intake Date *</Label>
            <Input
              type="date"
              value={formData.intakeDate}
              onChange={(e) => updateFormData({ intakeDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Assessment Overview</h4>
        <p className="text-blue-700 text-sm">
          This comprehensive intake assessment will gather essential information about the client's
          presenting concerns, treatment history, medical background, and psychosocial factors
          to inform treatment planning and care coordination.
        </p>
      </div>
    </div>
  );
};

export default ClientOverviewSection;
