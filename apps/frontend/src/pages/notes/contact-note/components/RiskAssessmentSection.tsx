
import React from 'react';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Checkbox } from '@/components/basic/checkbox';
import { AlertTriangle } from 'lucide-react';
import { ContactNoteFormData } from '../types/ContactNoteFormData';

interface RiskAssessmentSectionProps {
  formData: ContactNoteFormData;
  updateFormData: (updates: Partial<ContactNoteFormData>) => void;
}

const RiskAssessmentSection: React.FC<RiskAssessmentSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <span>Risk Assessment</span>
      </h3>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="riskFactorsDiscussed"
          checked={formData.riskFactorsDiscussed}
          onCheckedChange={(checked) => updateFormData({ riskFactorsDiscussed: !!checked })}
        />
        <Label htmlFor="riskFactorsDiscussed" className="text-sm">
          Risk factors were discussed or identified
        </Label>
      </div>

      {formData.riskFactorsDiscussed && (
        <div>
          <Label htmlFor="riskDetails">Risk Details</Label>
          <Textarea
            id="riskDetails"
            value={formData.riskDetails}
            onChange={(e) => updateFormData({ riskDetails: e.target.value })}
            placeholder="Describe any risk factors, safety concerns, or interventions provided..."
            rows={3}
          />
        </div>
      )}
    </div>
  );
};

export default RiskAssessmentSection;
