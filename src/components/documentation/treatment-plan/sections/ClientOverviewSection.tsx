
import React from 'react';
import { TreatmentPlanFormData } from '../types/TreatmentPlanFormData';
import ClientInfoDisplay from '../../shared/ClientInfoDisplay';

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
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Treatment Plan Overview</h4>
        <p className="text-blue-700 text-sm">
          Client information and treatment planning details.
        </p>
      </div>

      <ClientInfoDisplay clientData={clientData} />
    </div>
  );
};

export default ClientOverviewSection;
