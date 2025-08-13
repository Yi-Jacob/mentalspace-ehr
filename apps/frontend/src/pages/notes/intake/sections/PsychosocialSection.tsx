
import React from 'react';
import { SelectField } from '@/components/basic/select';
import { TextareaField } from '@/components/basic/textarea';
import { IntakeFormData } from '@/types/noteType';
import { RELATIONSHIP_STATUS_OPTIONS, LIVING_SITUATION_OPTIONS } from '@/types/enums/notesEnum';

interface PsychosocialSectionProps {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  clientData: any;
}

const PsychosocialSection: React.FC<PsychosocialSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Relationship/Marital Status"
          value={formData.relationshipStatus}
          onValueChange={(value) => updateFormData({ relationshipStatus: value })}
          options={RELATIONSHIP_STATUS_OPTIONS}
          placeholder="Select relationship status"
        />

        <TextareaField
          id="occupation"
          label="Occupation/Employment"
          placeholder="Current employment status, job title, work environment, etc."
          value={formData.occupation}
          onChange={(e) => updateFormData({ occupation: e.target.value })}
          rows={2}
        />
      </div>

      <SelectField
        label="Living Situation"
        value={formData.livingSituation}
        onValueChange={(value) => updateFormData({ livingSituation: value })}
        options={LIVING_SITUATION_OPTIONS}
        placeholder="Select living situation"
      />

      <TextareaField
        id="socialSupport"
        label="Social Support System"
        placeholder="Describe family relationships, friendships, community connections, and overall social support network"
        value={formData.socialSupport}
        onChange={(e) => updateFormData({ socialSupport: e.target.value })}
        rows={3}
      />

      <TextareaField
        id="currentStressors"
        label="Current Stressors"
        placeholder="Identify current life stressors including financial, work, family, health, or other concerns"
        value={formData.currentStressors}
        onChange={(e) => updateFormData({ currentStressors: e.target.value })}
        rows={3}
      />

      <TextareaField
        id="strengthsCoping"
        label="Strengths & Coping Skills"
        placeholder="Describe client's personal strengths, effective coping strategies, resilience factors, and resources"
        value={formData.strengthsCoping}
        onChange={(e) => updateFormData({ strengthsCoping: e.target.value })}
        rows={3}
      />
    </div>
  );
};

export default PsychosocialSection;
