
import React from 'react';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Plus, X } from 'lucide-react';
import { IntakeFormData } from '../types/IntakeFormData';

interface MedicalHistorySectionProps {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  clientData: any;
}

const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({
  formData,
  updateFormData,
}) => {
  const addMedication = () => {
    const newMedication = {
      name: '',
      dosage: '',
      frequency: '',
      prescriber: '',
    };
    updateFormData({
      currentMedications: [...formData.currentMedications, newMedication],
    });
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = formData.currentMedications.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    updateFormData({ currentMedications: updated });
  };

  const removeMedication = (index: number) => {
    const updated = formData.currentMedications.filter((_, i) => i !== index);
    updateFormData({ currentMedications: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="medicalConditions">Medical Conditions</Label>
        <Textarea
          id="medicalConditions"
          placeholder="List any current or past medical conditions that may be relevant to treatment (e.g., diabetes, hypertension, thyroid disorders, etc.)"
          value={formData.medicalConditions}
          onChange={(e) => updateFormData({ medicalConditions: e.target.value })}
          rows={3}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <Label className="text-base font-medium">Current Medications</Label>
            <p className="text-sm text-gray-600">Include all prescription medications, over-the-counter drugs, and supplements</p>
          </div>
          <Button onClick={addMedication} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </div>

        {formData.currentMedications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-gray-500">No medications added. Click "Add Medication" to include client's medications.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {formData.currentMedications.map((medication, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Medication {index + 1}</CardTitle>
                    <Button
                      onClick={() => removeMedication(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`med-name-${index}`}>Medication Name *</Label>
                      <Input
                        id={`med-name-${index}`}
                        placeholder="e.g., Sertraline"
                        value={medication.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`med-dosage-${index}`}>Dosage</Label>
                      <Input
                        id={`med-dosage-${index}`}
                        placeholder="e.g., 50mg"
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`med-frequency-${index}`}>Frequency</Label>
                      <Input
                        id={`med-frequency-${index}`}
                        placeholder="e.g., Once daily"
                        value={medication.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`med-prescriber-${index}`}>Prescriber</Label>
                      <Input
                        id={`med-prescriber-${index}`}
                        placeholder="e.g., Dr. Smith"
                        value={medication.prescriber}
                        onChange={(e) => updateMedication(index, 'prescriber', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="medicationAllergies">Medication Allergies</Label>
        <Textarea
          id="medicationAllergies"
          placeholder="List any known medication allergies or adverse reactions"
          value={formData.medicationAllergies}
          onChange={(e) => updateFormData({ medicationAllergies: e.target.value })}
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="familyPsychiatricHistory">Family Psychiatric History</Label>
        <Textarea
          id="familyPsychiatricHistory"
          placeholder="Describe any known mental health conditions in the client's family (parents, siblings, grandparents, etc.)"
          value={formData.familyPsychiatricHistory}
          onChange={(e) => updateFormData({ familyPsychiatricHistory: e.target.value })}
          rows={3}
        />
      </div>
    </div>
  );
};

export default MedicalHistorySection;
