
import React from 'react';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { ConsultationNoteFormData } from '../types/ConsultationNoteFormData';

interface RecommendationsSectionProps {
  formData: Pick<ConsultationNoteFormData, 'treatmentModifications'>;
  updateFormData: (updates: Partial<ConsultationNoteFormData>) => void;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Recommendations & Actions</h3>
      
      <div>
        <Label htmlFor="treatmentModifications">Treatment Modifications</Label>
        <Textarea
          id="treatmentModifications"
          value={formData.treatmentModifications}
          onChange={(e) => updateFormData({ treatmentModifications: e.target.value })}
          placeholder="Any recommended changes to treatment approach..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default RecommendationsSection;
