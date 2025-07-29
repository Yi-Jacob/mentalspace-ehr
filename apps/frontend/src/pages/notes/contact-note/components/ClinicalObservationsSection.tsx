
import React from 'react';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { ContactNoteFormData } from '../types/ContactNoteFormData';

interface ClinicalObservationsSectionProps {
  formData: ContactNoteFormData;
  updateFormData: (updates: Partial<ContactNoteFormData>) => void;
}

const ClinicalObservationsSection: React.FC<ClinicalObservationsSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Clinical Observations & Recommendations</h3>
      
      <div>
        <Label htmlFor="clinicalObservations">Clinical Observations</Label>
        <Textarea
          id="clinicalObservations"
          value={formData.clinicalObservations}
          onChange={(e) => updateFormData({ clinicalObservations: e.target.value })}
          placeholder="Document any clinical observations, symptoms, or behavioral changes..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="providerRecommendations">Provider Recommendations</Label>
        <Textarea
          id="providerRecommendations"
          value={formData.providerRecommendations}
          onChange={(e) => updateFormData({ providerRecommendations: e.target.value })}
          placeholder="Any recommendations, suggestions, or guidance provided..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default ClinicalObservationsSection;
