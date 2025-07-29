
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Plus, X } from 'lucide-react';
import { TreatmentPlanFormData } from '../types/TreatmentPlanFormData';
import SearchableSelect from '../../components/shared/SearchableSelect';
import { useDiagnosisCodes } from '@/hooks/useDiagnosisCodes';

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
  const { data: diagnosisOptions = [], isLoading } = useDiagnosisCodes();

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
            <SearchableSelect
              label="Primary Diagnosis"
              value={formData.primaryDiagnosis}
              onChange={(value) => updateFormData({ primaryDiagnosis: value })}
              options={diagnosisOptions}
              placeholder={isLoading ? "Loading diagnoses..." : "Search for a diagnosis..."}
              required
              disabled={isLoading}
            />
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
                <div className="flex-1">
                  <SearchableSelect
                    label={`Secondary Diagnosis ${index + 1}`}
                    value={diagnosis}
                    onChange={(value) => updateSecondaryDiagnosis(index, value)}
                    options={diagnosisOptions}
                    placeholder={isLoading ? "Loading diagnoses..." : "Search for a diagnosis..."}
                    disabled={isLoading}
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeSecondaryDiagnosis(index)}
                  className="mt-6"
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
