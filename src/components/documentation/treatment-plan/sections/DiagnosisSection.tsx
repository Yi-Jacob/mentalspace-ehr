
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { TreatmentPlanFormData } from '../types/TreatmentPlanFormData';

interface DiagnosisSectionProps {
  formData: TreatmentPlanFormData;
  updateFormData: (updates: Partial<TreatmentPlanFormData>) => void;
  clientData?: any;
}

const DiagnosisSection: React.FC<DiagnosisSectionProps> = ({
  formData,
  updateFormData,
  clientData,
}) => {
  const addSecondaryDiagnosis = () => {
    updateFormData({
      secondaryDiagnoses: [...formData.secondaryDiagnoses, '']
    });
  };

  const updateSecondaryDiagnosis = (index: number, value: string) => {
    const newDiagnoses = [...formData.secondaryDiagnoses];
    newDiagnoses[index] = value;
    updateFormData({ secondaryDiagnoses: newDiagnoses });
  };

  const removeSecondaryDiagnosis = (index: number) => {
    const newDiagnoses = formData.secondaryDiagnoses.filter((_, i) => i !== index);
    updateFormData({ secondaryDiagnoses: newDiagnoses });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Primary Diagnosis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="primary-diagnosis">Primary Diagnosis *</Label>
              <Input
                id="primary-diagnosis"
                value={formData.primaryDiagnosis}
                onChange={(e) => updateFormData({ primaryDiagnosis: e.target.value })}
                placeholder="Enter primary diagnosis (e.g., F06.31 - Depressive Disorder Due to Another Medical Condition)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Secondary Diagnoses
            <Button size="sm" onClick={addSecondaryDiagnosis}>
              <Plus className="w-4 h-4 mr-2" />
              Add Secondary Diagnosis
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {formData.secondaryDiagnoses.map((diagnosis, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={diagnosis}
                  onChange={(e) => updateSecondaryDiagnosis(index, e.target.value)}
                  placeholder="Enter secondary diagnosis"
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeSecondaryDiagnosis(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {formData.secondaryDiagnoses.length === 0 && (
              <p className="text-gray-500 text-sm">No secondary diagnoses added yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosisSection;
