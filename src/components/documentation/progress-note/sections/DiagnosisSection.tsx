
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';

interface DiagnosisSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
}

const DiagnosisSection: React.FC<DiagnosisSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const [newSecondaryDiagnosis, setNewSecondaryDiagnosis] = React.useState('');

  const addSecondaryDiagnosis = () => {
    if (newSecondaryDiagnosis.trim()) {
      const currentDiagnoses = formData.secondaryDiagnoses || [];
      updateFormData({
        secondaryDiagnoses: [...currentDiagnoses, newSecondaryDiagnosis.trim()]
      });
      setNewSecondaryDiagnosis('');
    }
  };

  const removeSecondaryDiagnosis = (index: number) => {
    const currentDiagnoses = formData.secondaryDiagnoses || [];
    updateFormData({
      secondaryDiagnoses: currentDiagnoses.filter((_, i) => i !== index)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnosis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
          <Input
            id="primaryDiagnosis"
            value={formData.primaryDiagnosis}
            onChange={(e) => updateFormData({ primaryDiagnosis: e.target.value })}
            placeholder="e.g., F06.31 - Depressive Disorder Due to Another Medical Condition"
          />
        </div>

        <div>
          <Label>Secondary Diagnoses</Label>
          <div className="space-y-2">
            {formData.secondaryDiagnoses?.map((diagnosis, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Badge variant="outline" className="flex-1 justify-start">
                  {diagnosis}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSecondaryDiagnosis(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <div className="flex space-x-2">
              <Input
                value={newSecondaryDiagnosis}
                onChange={(e) => setNewSecondaryDiagnosis(e.target.value)}
                placeholder="Enter secondary diagnosis..."
                onKeyPress={(e) => e.key === 'Enter' && addSecondaryDiagnosis()}
              />
              <Button type="button" onClick={addSecondaryDiagnosis}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosisSection;
