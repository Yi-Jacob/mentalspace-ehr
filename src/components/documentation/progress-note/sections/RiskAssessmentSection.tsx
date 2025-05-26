
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';

interface RiskAssessmentSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
}

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
          <div className="space-y-4">
            {formData.riskAreas?.map((riskArea, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Risk Area {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRiskArea(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Area of Risk</Label>
                    <Input
                      value={riskArea.areaOfRisk}
                      onChange={(e) => updateRiskArea(index, { areaOfRisk: e.target.value })}
                      placeholder="e.g., Suicide, Self-harm, Violence"
                    />
                  </div>

                  <div>
                    <Label>Level of Risk</Label>
                    <Select
                      value={riskArea.levelOfRisk}
                      onValueChange={(value) => updateRiskArea(index, { levelOfRisk: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Imminent">Imminent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Intent to Act</Label>
                    <Select
                      value={riskArea.intentToAct}
                      onValueChange={(value) => updateRiskArea(index, { intentToAct: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Plan to Act</Label>
                    <Select
                      value={riskArea.planToAct}
                      onValueChange={(value) => updateRiskArea(index, { planToAct: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Means to Act</Label>
                    <Select
                      value={riskArea.meansToAct}
                      onValueChange={(value) => updateRiskArea(index, { meansToAct: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Risk Factors</Label>
                    <Textarea
                      value={riskArea.riskFactors}
                      onChange={(e) => updateRiskArea(index, { riskFactors: e.target.value })}
                      placeholder="Describe risk factors..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Protective Factors</Label>
                    <Textarea
                      value={riskArea.protectiveFactors}
                      onChange={(e) => updateRiskArea(index, { protectiveFactors: e.target.value })}
                      placeholder="Describe protective factors..."
                      rows={3}
                    />
                  </div>
                </div>

                <div>
                  <Label>Additional Details</Label>
                  <Textarea
                    value={riskArea.additionalDetails}
                    onChange={(e) => updateRiskArea(index, { additionalDetails: e.target.value })}
                    placeholder="Additional details about this risk area..."
                    rows={2}
                  />
                </div>
              </div>
            ))}

            <Button type="button" onClick={addRiskArea} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Risk Area
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskAssessmentSection;
