
import React from 'react';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Button } from '@/components/basic/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Plus, X } from 'lucide-react';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';

interface TreatmentProgressSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
}

const TreatmentProgressSection: React.FC<TreatmentProgressSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const addObjective = () => {
    const newObjective = { objectiveText: '', progress: '' };
    const currentObjectives = formData.objectives || [];
    updateFormData({
      objectives: [...currentObjectives, newObjective]
    });
  };

  const removeObjective = (index: number) => {
    const currentObjectives = formData.objectives || [];
    updateFormData({
      objectives: currentObjectives.filter((_, i) => i !== index)
    });
  };

  const updateObjective = (index: number, field: 'objectiveText' | 'progress', value: string) => {
    const currentObjectives = formData.objectives || [];
    const updatedObjectives = currentObjectives.map((obj, i) =>
      i === index ? { ...obj, [field]: value } : obj
    );
    updateFormData({ objectives: updatedObjectives });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treatment Plan Progress</CardTitle>
        <p className="text-sm text-gray-600">Track progress on treatment plan objectives</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {formData.objectives?.map((objective, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Objective {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeObjective(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`objective-${index}`}>Treatment Plan Objective</Label>
              <Textarea
                id={`objective-${index}`}
                value={objective.objectiveText}
                onChange={(e) => updateObjective(index, 'objectiveText', e.target.value)}
                placeholder="Enter the treatment plan objective..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`progress-${index}`}>Progress Made</Label>
              <Textarea
                id={`progress-${index}`}
                value={objective.progress}
                onChange={(e) => updateObjective(index, 'progress', e.target.value)}
                placeholder="Describe progress made toward this objective..."
                rows={3}
              />
            </div>
          </div>
        ))}

        <Button type="button" onClick={addObjective} variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Treatment Objective
        </Button>
      </CardContent>
    </Card>
  );
};

export default TreatmentProgressSection;
