
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Label } from '@/components/basic/label';
import { Input } from '@/components/basic/input';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { Textarea } from '@/components/basic/textarea';
import { Plus, X, History } from 'lucide-react';
import { ProgressNoteFormData } from '@/types/noteType';
import { AVAILABLE_DIAGNOSES } from '@/types/enums/notesEnum';
import DiagnosisSearch, { DiagnosisOption } from '../../IntakeAssessmentNoteEditPage/sections/diagnosis/DiagnosisSearch';
import DiagnosisSuggestions from '../../IntakeAssessmentNoteEditPage/sections/diagnosis/DiagnosisSuggestions';

interface DiagnosisSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
  clientData?: any;
}

const DiagnosisSection: React.FC<DiagnosisSectionProps> = ({
  formData,
  updateFormData,
  clientData,
}) => {
  const availableDiagnoses = AVAILABLE_DIAGNOSES;
  const [primarySearchTerm, setPrimarySearchTerm] = useState('');
  const [showPrimarySuggestions, setShowPrimarySuggestions] = useState(false);
  const [secondarySearchTerm, setSecondarySearchTerm] = useState('');
  const [showSecondarySuggestions, setShowSecondarySuggestions] = useState(false);
  const [showAddSecondary, setShowAddSecondary] = useState(false);
  const [diagnosticJustification, setDiagnosticJustification] = useState('');

  const filteredPrimaryDiagnoses = availableDiagnoses.filter(
    (diagnosis) =>
      diagnosis.code.toLowerCase().includes(primarySearchTerm.toLowerCase()) ||
      diagnosis.description.toLowerCase().includes(primarySearchTerm.toLowerCase())
  );

  const filteredSecondaryDiagnoses = availableDiagnoses.filter(
    (diagnosis) =>
      diagnosis.code.toLowerCase().includes(secondarySearchTerm.toLowerCase()) ||
      diagnosis.description.toLowerCase().includes(secondarySearchTerm.toLowerCase())
  );

  const handlePrimaryDiagnosisSelect = (diagnosis: string) => {
    updateFormData({ primaryDiagnosis: diagnosis });
    setPrimarySearchTerm('');
    setShowPrimarySuggestions(false);
  };

  const handleSecondaryDiagnosisAdd = (diagnosis: string) => {
    const currentDiagnoses = formData.secondaryDiagnoses || [];
    if (!currentDiagnoses.includes(diagnosis)) {
      updateFormData({
        secondaryDiagnoses: [...currentDiagnoses, diagnosis]
      });
    }
    setSecondarySearchTerm('');
    setShowSecondarySuggestions(false);
    setShowAddSecondary(false);
  };

  const removeSecondaryDiagnosis = (diagnosis: string) => {
    const currentDiagnoses = formData.secondaryDiagnoses || [];
    updateFormData({
      secondaryDiagnoses: currentDiagnoses.filter(d => d !== diagnosis)
    });
  };

  const clearPrimaryDiagnosis = () => {
    updateFormData({ primaryDiagnosis: '' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Diagnosis</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Diagnosis */}
        <div>
          <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
          {formData.primaryDiagnosis ? (
            <div className="mt-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div>
                  <div className="font-medium text-sm">
                    {formData.primaryDiagnosis.split(' - ')[0]}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {formData.primaryDiagnosis.split(' - ').slice(1).join(' - ')}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearPrimaryDiagnosis}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative mt-2">
              <DiagnosisSearch
                searchTerm={primarySearchTerm}
                onSearchChange={(value) => {
                  setPrimarySearchTerm(value);
                  setShowPrimarySuggestions(value.length > 0);
                }}
                onFocus={() => setShowPrimarySuggestions(primarySearchTerm.length > 0)}
                placeholder="Search ICD-10 diagnoses..."
              />
              
              {showPrimarySuggestions && (
                <DiagnosisSuggestions
                  diagnoses={filteredPrimaryDiagnoses}
                  onSelect={handlePrimaryDiagnosisSelect}
                  searchTerm={primarySearchTerm}
                />
              )}
            </div>
          )}
        </div>

        {/* Secondary Diagnoses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label>Secondary Diagnoses</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddSecondary(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Secondary Diagnosis
            </Button>
          </div>

          {formData.secondaryDiagnoses && formData.secondaryDiagnoses.length > 0 && (
            <div className="space-y-2 mb-4">
              {formData.secondaryDiagnoses.map((diagnosis, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div>
                    <div className="font-medium text-sm">
                      {diagnosis.split(' - ')[0]}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {diagnosis.split(' - ').slice(1).join(' - ')}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSecondaryDiagnosis(diagnosis)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {showAddSecondary && (
            <div className="relative mb-4">
              <DiagnosisSearch
                searchTerm={secondarySearchTerm}
                onSearchChange={(value) => {
                  setSecondarySearchTerm(value);
                  setShowSecondarySuggestions(value.length > 0);
                }}
                onFocus={() => setShowSecondarySuggestions(secondarySearchTerm.length > 0)}
                placeholder="Search ICD-10 diagnoses for secondary diagnosis..."
                autoFocus
              />
              
              {showSecondarySuggestions && (
                <DiagnosisSuggestions
                  diagnoses={filteredSecondaryDiagnoses}
                  onSelect={handleSecondaryDiagnosisAdd}
                  searchTerm={secondarySearchTerm}
                />
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddSecondary(false);
                  setSecondarySearchTerm('');
                  setShowSecondarySuggestions(false);
                }}
                className="mt-2"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Diagnostic Justification */}
        <div>
          <Label htmlFor="diagnosticJustification">
            Diagnostic justification and/or assessment measures
          </Label>
          <Textarea
            id="diagnosticJustification"
            value={diagnosticJustification}
            onChange={(e) => setDiagnosticJustification(e.target.value)}
            placeholder="Enter diagnostic justification and/or assessment measures..."
            rows={4}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosisSection;
