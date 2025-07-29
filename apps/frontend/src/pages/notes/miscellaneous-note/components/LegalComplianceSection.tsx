
import React from 'react';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Checkbox } from '@/components/basic/checkbox';
import { AlertTriangle } from 'lucide-react';
import { MiscellaneousNoteFormData } from '../types/MiscellaneousNoteFormData';

interface LegalComplianceSectionProps {
  formData: Pick<MiscellaneousNoteFormData, 'mandatoryReporting' | 'reportingDetails' | 'legalImplications'>;
  updateFormData: (updates: Partial<MiscellaneousNoteFormData>) => void;
}

const LegalComplianceSection: React.FC<LegalComplianceSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        <span>Legal & Compliance</span>
      </h3>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="mandatoryReporting"
          checked={formData.mandatoryReporting}
          onCheckedChange={(checked) => updateFormData({ mandatoryReporting: !!checked })}
        />
        <Label htmlFor="mandatoryReporting" className="text-sm">
          This matter involves mandatory reporting requirements
        </Label>
      </div>

      {formData.mandatoryReporting && (
        <div>
          <Label htmlFor="reportingDetails">Mandatory Reporting Details</Label>
          <Textarea
            id="reportingDetails"
            value={formData.reportingDetails}
            onChange={(e) => updateFormData({ reportingDetails: e.target.value })}
            placeholder="Describe the reporting requirements and actions taken..."
            rows={3}
          />
        </div>
      )}

      <div>
        <Label htmlFor="legalImplications">Legal Implications</Label>
        <Textarea
          id="legalImplications"
          value={formData.legalImplications}
          onChange={(e) => updateFormData({ legalImplications: e.target.value })}
          placeholder="Any legal implications or considerations..."
          rows={2}
        />
      </div>
    </div>
  );
};

export default LegalComplianceSection;
