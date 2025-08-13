
import React from 'react';
import { Label } from '@/components/basic/label';
import { TextareaField } from '@/components/basic/textarea';
import { Checkbox } from '@/components/basic/checkbox';
import { MiscellaneousNoteFormData } from '@/types/noteType';

interface OutcomesSectionProps {
  formData: Pick<MiscellaneousNoteFormData, 'followUpRequired' | 'followUpDetails' | 'resolution' | 'outcomeSummary'>;
  updateFormData: (updates: Partial<MiscellaneousNoteFormData>) => void;
}

const OutcomesSection: React.FC<OutcomesSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Outcomes & Resolution</h3>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="followUpRequired"
          checked={formData.followUpRequired}
          onCheckedChange={(checked) => updateFormData({ followUpRequired: !!checked })}
        />
        <Label htmlFor="followUpRequired" className="text-sm">
          Follow-up action required
        </Label>
      </div>

      {formData.followUpRequired && (
        <TextareaField
          id="followUpDetails"
          label="Follow-up Details"
          value={formData.followUpDetails}
          onChange={(e) => updateFormData({ followUpDetails: e.target.value })}
          placeholder="Describe the follow-up actions needed..."
          rows={2}
        />
      )}

      <TextareaField
        id="resolution"
        label="Resolution"
        value={formData.resolution}
        onChange={(e) => updateFormData({ resolution: e.target.value })}
        placeholder="How was this matter resolved or what was the outcome..."
        rows={3}
      />

      <TextareaField
        id="outcomeSummary"
        label="Outcome Summary"
        value={formData.outcomeSummary}
        onChange={(e) => updateFormData({ outcomeSummary: e.target.value })}
        placeholder="Brief summary of the final outcome..."
        rows={2}
      />
    </div>
  );
};

export default OutcomesSection;
