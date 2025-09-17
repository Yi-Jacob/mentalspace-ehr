import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { Plus, X, Stethoscope } from 'lucide-react';

interface DiagnosisSectionProps {
  formData: any;
  updateFormData: (updates: any) => void;
  noteType: string;
}

const DiagnosisSection: React.FC<DiagnosisSectionProps> = ({
  formData,
  updateFormData,
  noteType
}) => {
  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
  };

  const addSecondaryDiagnosis = () => {
    const newDiagnosis = '';
    const currentDiagnoses = formData.secondaryDiagnoses || [];
    updateFormData({
      secondaryDiagnoses: [...currentDiagnoses, newDiagnosis]
    });
  };

  const removeSecondaryDiagnosis = (index: number) => {
    const currentDiagnoses = formData.secondaryDiagnoses || [];
    const updatedDiagnoses = currentDiagnoses.filter((_: any, i: number) => i !== index);
    updateFormData({
      secondaryDiagnoses: updatedDiagnoses
    });
  };

  const updateSecondaryDiagnosis = (index: number, value: string) => {
    const currentDiagnoses = formData.secondaryDiagnoses || [];
    const updatedDiagnoses = currentDiagnoses.map((diagnosis: string, i: number) => 
      i === index ? value : diagnosis
    );
    updateFormData({
      secondaryDiagnoses: updatedDiagnoses
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Diagnosis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Diagnosis */}
        <div>
          <Label htmlFor="primaryDiagnosis">Primary Diagnosis *</Label>
          <Input
            id="primaryDiagnosis"
            placeholder="Enter primary diagnosis..."
            value={formData.primaryDiagnosis || ''}
            onChange={(e) => handleInputChange('primaryDiagnosis', e.target.value)}
          />
        </div>

        {/* Secondary Diagnoses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Secondary Diagnoses</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSecondaryDiagnosis}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Diagnosis
            </Button>
          </div>
          
          <div className="space-y-3">
            {(formData.secondaryDiagnoses || []).map((diagnosis: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Secondary diagnosis ${index + 1}...`}
                  value={diagnosis}
                  onChange={(e) => updateSecondaryDiagnosis(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSecondaryDiagnosis(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnosis Notes */}
        <div>
          <Label htmlFor="diagnosisNotes">Diagnosis Notes</Label>
          <Textarea
            id="diagnosisNotes"
            placeholder="Additional notes about the diagnosis..."
            value={formData.diagnosisNotes || ''}
            onChange={(e) => handleInputChange('diagnosisNotes', e.target.value)}
            rows={3}
          />
        </div>

        {/* Current Diagnoses Display */}
        {(formData.primaryDiagnosis || (formData.secondaryDiagnoses && formData.secondaryDiagnoses.length > 0)) && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Current Diagnoses:</h4>
            <div className="flex flex-wrap gap-2">
              {formData.primaryDiagnosis && (
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  Primary: {formData.primaryDiagnosis}
                </Badge>
              )}
              {(formData.secondaryDiagnoses || []).filter((d: string) => d.trim()).map((diagnosis: string, index: number) => (
                <Badge key={index} variant="secondary">
                  Secondary: {diagnosis}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiagnosisSection;
