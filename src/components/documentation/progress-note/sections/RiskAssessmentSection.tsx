import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X } from 'lucide-react';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';

interface RiskAssessmentSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
}

const AREA_OF_RISK_OPTIONS = [
  'Inability to care for self',
  'Inability to care for others',
  'Aggression toward others',
  'Aggression toward property',
  'Self-harm',
  'Suicide',
  'Violence',
  'Substance abuse',
  'Elopement/Wandering',
  'Sexual acting out',
  'Fire setting',
  'Other'
];

const RISK_FACTOR_SUGGESTIONS = [
  'Current ideation',
  'Access to means',
  'History of attempts/behaviors',
  'Alcohol/Substance use',
  'Impulsivity',
  'Hopelessness',
  'Recent loss',
  'Family history',
  'Social isolation',
  'Chronic pain',
  'Mental illness',
  'Previous hospitalization'
];

const PROTECTIVE_FACTOR_SUGGESTIONS = [
  'Positive social support',
  'Cultural/religious beliefs',
  'Social responsibility',
  'Children in the home',
  'Life satisfaction',
  'Positive coping skills',
  'Sufficient problem-solving skills',
  'Strong therapeutic rapport',
  'Employment',
  'Financial stability',
  'Future goals',
  'Pets/Animals'
];

const RiskAssessmentSection: React.FC<RiskAssessmentSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const addRiskArea = () => {
    const newRiskArea = {
      areaOfRisk: '',
      levelOfRisk: 'Low' as const,
      intentToAct: 'No' as const,
      planToAct: 'No' as const,
      meansToAct: 'No' as const,
      riskFactors: '',
      protectiveFactors: '',
      additionalDetails: '',
    };
    
    updateFormData({
      riskAreas: [...(formData.riskAreas || []), newRiskArea]
    });
  };

  const updateRiskArea = (index: number, updates: any) => {
    const updatedRiskAreas = [...(formData.riskAreas || [])];
    updatedRiskAreas[index] = { ...updatedRiskAreas[index], ...updates };
    updateFormData({ riskAreas: updatedRiskAreas });
  };

  const removeRiskArea = (index: number) => {
    const updatedRiskAreas = formData.riskAreas?.filter((_, i) => i !== index) || [];
    updateFormData({ riskAreas: updatedRiskAreas });
  };

  const addQuickFactor = (index: number, type: 'riskFactors' | 'protectiveFactors', factor: string) => {
    const riskArea = formData.riskAreas?.[index];
    if (!riskArea) return;
    
    const currentFactors = riskArea[type] || '';
    
    // Check if factor already exists (case-insensitive)
    const existingFactors = currentFactors
      .split(',')
      .map(f => f.trim().toLowerCase())
      .filter(f => f.length > 0);
    
    if (existingFactors.includes(factor.toLowerCase())) {
      return; // Don't add duplicate factor
    }
    
    const newFactors = currentFactors 
      ? `${currentFactors}, ${factor}`
      : factor;
    
    updateRiskArea(index, { [type]: newFactors });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="noRiskPresent"
            checked={formData.noRiskPresent}
            onCheckedChange={(checked) => {
              updateFormData({ 
                noRiskPresent: checked as boolean,
                riskAreas: checked ? [] : formData.riskAreas
              });
            }}
          />
          <Label htmlFor="noRiskPresent">
            Patient denies all areas of risk. No contrary clinical indications present.
          </Label>
        </div>

        {!formData.noRiskPresent && (
          <div className="space-y-6">
            {formData.riskAreas?.map((riskArea, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Risk Area {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRiskArea(index)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Area of Risk Dropdown */}
                <div>
                  <Label>Area of Risk:</Label>
                  <Select
                    value={riskArea.areaOfRisk}
                    onValueChange={(value) => updateRiskArea(index, { areaOfRisk: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select area of risk..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {AREA_OF_RISK_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Level of Risk, Intent, Plan, Means - Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Level of Risk:</Label>
                    <RadioGroup
                      value={riskArea.levelOfRisk}
                      onValueChange={(value) => updateRiskArea(index, { levelOfRisk: value })}
                      className="mt-2"
                    >
                      {['Low', 'Medium', 'High', 'Imminent'].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <RadioGroupItem value={level} id={`level-${index}-${level}`} />
                          <Label htmlFor={`level-${index}-${level}`} className="text-sm">
                            {level}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Intent to Act:</Label>
                    <RadioGroup
                      value={riskArea.intentToAct}
                      onValueChange={(value) => updateRiskArea(index, { intentToAct: value })}
                      className="mt-2"
                    >
                      {['Yes', 'No', 'Not Applicable'].map((intent) => (
                        <div key={intent} className="flex items-center space-x-2">
                          <RadioGroupItem value={intent} id={`intent-${index}-${intent}`} />
                          <Label htmlFor={`intent-${index}-${intent}`} className="text-sm">
                            {intent}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Plan to Act:</Label>
                    <RadioGroup
                      value={riskArea.planToAct}
                      onValueChange={(value) => updateRiskArea(index, { planToAct: value })}
                      className="mt-2"
                    >
                      {['Yes', 'No', 'Not Applicable'].map((plan) => (
                        <div key={plan} className="flex items-center space-x-2">
                          <RadioGroupItem value={plan} id={`plan-${index}-${plan}`} />
                          <Label htmlFor={`plan-${index}-${plan}`} className="text-sm">
                            {plan}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Means to Act:</Label>
                    <RadioGroup
                      value={riskArea.meansToAct}
                      onValueChange={(value) => updateRiskArea(index, { meansToAct: value })}
                      className="mt-2"
                    >
                      {['Yes', 'No', 'Not Applicable'].map((means) => (
                        <div key={means} className="flex items-center space-x-2">
                          <RadioGroupItem value={means} id={`means-${index}-${means}`} />
                          <Label htmlFor={`means-${index}-${means}`} className="text-sm">
                            {means}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                {/* Risk Factors */}
                <div>
                  <Label>Risk Factors:</Label>
                  <Textarea
                    value={riskArea.riskFactors}
                    onChange={(e) => updateRiskArea(index, { riskFactors: e.target.value })}
                    placeholder="Enter risk factors..."
                    rows={3}
                    className="mt-1"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {RISK_FACTOR_SUGGESTIONS.map((factor) => {
                      const currentFactors = riskArea.riskFactors || '';
                      const existingFactors = currentFactors
                        .split(',')
                        .map(f => f.trim().toLowerCase())
                        .filter(f => f.length > 0);
                      const isAlreadyAdded = existingFactors.includes(factor.toLowerCase());
                      
                      return (
                        <Button
                          key={factor}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addQuickFactor(index, 'riskFactors', factor)}
                          disabled={isAlreadyAdded}
                          className={`text-xs h-7 ${isAlreadyAdded ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {factor}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Protective Factors */}
                <div>
                  <Label>Protective Factors:</Label>
                  <Textarea
                    value={riskArea.protectiveFactors}
                    onChange={(e) => updateRiskArea(index, { protectiveFactors: e.target.value })}
                    placeholder="Enter protective factors..."
                    rows={3}
                    className="mt-1"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {PROTECTIVE_FACTOR_SUGGESTIONS.map((factor) => {
                      const currentFactors = riskArea.protectiveFactors || '';
                      const existingFactors = currentFactors
                        .split(',')
                        .map(f => f.trim().toLowerCase())
                        .filter(f => f.length > 0);
                      const isAlreadyAdded = existingFactors.includes(factor.toLowerCase());
                      
                      return (
                        <Button
                          key={factor}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addQuickFactor(index, 'protectiveFactors', factor)}
                          disabled={isAlreadyAdded}
                          className={`text-xs h-7 ${isAlreadyAdded ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {factor}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <Label>Additional Details:</Label>
                  <Textarea
                    value={riskArea.additionalDetails}
                    onChange={(e) => updateRiskArea(index, { additionalDetails: e.target.value })}
                    placeholder="Additional details about this risk area..."
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </div>
            ))}

            <Button type="button" onClick={addRiskArea} variant="outline" className="text-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Area of Risk
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskAssessmentSection;
