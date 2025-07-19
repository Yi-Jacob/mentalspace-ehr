import React from 'react';
import { Label } from '@/components/shared/ui/label';
import { Checkbox } from '@/components/shared/ui/checkbox';
import { Textarea } from '@/components/shared/ui/textarea';
import { Card, CardContent } from '@/components/shared/ui/card';
import { AlertTriangle } from 'lucide-react';
import { IntakeFormData } from '../types/IntakeFormData';

const RISK_FACTORS = [
  'Current Suicidal Ideation',
  'History of Suicide Attempt(s)',
  'Homicidal Ideation',
  'Self-Harm Behaviors',
  'Significant Impulsivity',
  'Aggression/Violence History',
];

interface RiskAssessmentSectionProps {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  clientData: any;
}

const RiskAssessmentSection: React.FC<RiskAssessmentSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const handleRiskFactorChange = (factor: string, checked: boolean) => {
    const updated = checked
      ? [...formData.riskFactors, factor]
      : formData.riskFactors.filter(f => f !== factor);
    updateFormData({ riskFactors: updated });
    
    // If any risk factors are selected, uncheck "no acute risk"
    if (checked && formData.noAcuteRisk) {
      updateFormData({ noAcuteRisk: false });
    }
  };

  const handleNoAcuteRiskChange = (checked: boolean) => {
    updateFormData({ noAcuteRisk: checked });
    
    // If "no acute risk" is checked, clear all risk factors
    if (checked) {
      updateFormData({ riskFactors: [] });
    }
  };

  const hasRiskFactors = formData.riskFactors.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Risk Assessment Guidelines</h4>
            <p className="text-amber-700 text-sm mt-1">
              Check all that apply. If any risks are identified, you must document your assessment 
              and safety plan in the details section below.
            </p>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Risk Factors</Label>
        <div className="mt-4 space-y-3">
          {RISK_FACTORS.map((factor) => (
            <div key={factor} className="flex items-center space-x-3">
              <Checkbox
                id={`risk-${factor}`}
                checked={formData.riskFactors.includes(factor)}
                onCheckedChange={(checked) => 
                  handleRiskFactorChange(factor, checked as boolean)
                }
                disabled={formData.noAcuteRisk}
              />
              <Label 
                htmlFor={`risk-${factor}`} 
                className={`text-sm ${hasRiskFactors && formData.riskFactors.includes(factor) ? 'font-medium text-red-700' : ''}`}
              >
                {factor}
              </Label>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="no-acute-risk"
              checked={formData.noAcuteRisk}
              onCheckedChange={handleNoAcuteRiskChange}
              disabled={hasRiskFactors}
            />
            <Label htmlFor="no-acute-risk" className="text-sm font-medium">
              No Acute Risk Factors Identified
            </Label>
          </div>
          {formData.noAcuteRisk && (
            <p className="text-green-700 text-sm mt-2 ml-6">
              Client denies current suicidal/homicidal ideation and does not present with 
              significant risk factors at this time.
            </p>
          )}
        </div>
      </div>

      {hasRiskFactors && (
        <div className="space-y-4 border-l-4 border-red-300 pl-6">
          <div>
            <Label htmlFor="riskDetails" className="text-base font-medium text-red-800">
              Risk Assessment Details *
            </Label>
            <Textarea
              id="riskDetails"
              placeholder="Provide detailed assessment of identified risk factors including severity, frequency, triggers, protective factors, and clinical impressions..."
              value={formData.riskDetails}
              onChange={(e) => updateFormData({ riskDetails: e.target.value })}
              rows={4}
              className="border-red-200 focus:border-red-400"
            />
          </div>

          <div>
            <Label htmlFor="safetyPlan" className="text-base font-medium text-red-800">
              Safety Plan *
            </Label>
            <Textarea
              id="safetyPlan"
              placeholder="Document safety planning interventions, coping strategies, support contacts, emergency resources, and follow-up plans..."
              value={formData.safetyPlan}
              onChange={(e) => updateFormData({ safetyPlan: e.target.value })}
              rows={4}
              className="border-red-200 focus:border-red-400"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskAssessmentSection;
