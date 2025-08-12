
import React from 'react';
import { Label } from '@/components/basic/label';
import { Checkbox } from '@/components/basic/checkbox';
import { ConsultationNoteFormData } from '@/types/noteType';

interface ComplianceSectionProps {
  formData: Pick<ConsultationNoteFormData, 'confidentialityAgreement' | 'consentObtained'>;
  updateFormData: (updates: Partial<ConsultationNoteFormData>) => void;
}

const ComplianceSection: React.FC<ComplianceSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Agreements & Compliance</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="confidentialityAgreement"
            checked={formData.confidentialityAgreement}
            onCheckedChange={(checked) => updateFormData({ confidentialityAgreement: !!checked })}
          />
          <Label htmlFor="confidentialityAgreement" className="text-sm">
            Confidentiality agreement reviewed and confirmed with all participants *
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="consentObtained"
            checked={formData.consentObtained}
            onCheckedChange={(checked) => updateFormData({ consentObtained: !!checked })}
          />
          <Label htmlFor="consentObtained" className="text-sm">
            Appropriate consent obtained for information sharing *
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ComplianceSection;
