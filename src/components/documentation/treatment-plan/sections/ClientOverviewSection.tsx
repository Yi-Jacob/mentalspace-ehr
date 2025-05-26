
import React from 'react';
import { TreatmentPlanFormData } from '../types/TreatmentPlanFormData';

interface ClientOverviewSectionProps {
  formData: TreatmentPlanFormData;
  updateFormData: (updates: Partial<TreatmentPlanFormData>) => void;
  clientData?: any;
}

const ClientOverviewSection: React.FC<ClientOverviewSectionProps> = ({
  formData,
  updateFormData,
  clientData,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Client Information</h3>
        {clientData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-blue-700">Name</label>
              <p className="text-blue-900">{clientData.first_name} {clientData.last_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700">Date of Birth</label>
              <p className="text-blue-900">{clientData.date_of_birth || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700">Email</label>
              <p className="text-blue-900">{clientData.email || 'Not specified'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-blue-700">Location</label>
              <p className="text-blue-900">{clientData.city && clientData.state ? `${clientData.city}, ${clientData.state}` : 'Not specified'}</p>
            </div>
          </div>
        ) : (
          <p className="text-blue-700">Client information will be loaded automatically.</p>
        )}
      </div>
    </div>
  );
};

export default ClientOverviewSection;
