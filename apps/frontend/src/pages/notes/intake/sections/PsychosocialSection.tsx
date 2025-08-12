
import React from 'react';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { IntakeFormData } from '@/types/noteType';

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
        <div>
          <Label htmlFor="relationshipStatus">Relationship/Marital Status</Label>
          <Textarea
            id="relationshipStatus"
            placeholder="e.g., Single, Married, Divorced, In a relationship, etc."
            value={formData.relationshipStatus}
            onChange={(e) => updateFormData({ relationshipStatus: e.target.value })}
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="occupation">Occupation/Employment</Label>
          <Textarea
            id="occupation"
            placeholder="Current employment status, job title, work environment, etc."
            value={formData.occupation}
            onChange={(e) => updateFormData({ occupation: e.target.value })}
            rows={2}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="livingSituation">Living Situation</Label>
        <Textarea
          id="livingSituation"
          placeholder="Describe current living arrangements, household members, housing stability, etc."
          value={formData.livingSituation}
          onChange={(e) => updateFormData({ livingSituation: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="socialSupport">Social Support System</Label>
        <Textarea
          id="socialSupport"
          placeholder="Describe family relationships, friendships, community connections, and overall social support network"
          value={formData.socialSupport}
          onChange={(e) => updateFormData({ socialSupport: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="currentStressors">Current Stressors</Label>
        <Textarea
          id="currentStressors"
          placeholder="Identify current life stressors including financial, work, family, health, or other concerns"
          value={formData.currentStressors}
          onChange={(e) => updateFormData({ currentStressors: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="strengthsCoping">Strengths & Coping Skills</Label>
        <Textarea
          id="strengthsCoping"
          placeholder="Describe client's personal strengths, effective coping strategies, resilience factors, and resources"
          value={formData.strengthsCoping}
          onChange={(e) => updateFormData({ strengthsCoping: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
};

export default PsychosocialSection;
