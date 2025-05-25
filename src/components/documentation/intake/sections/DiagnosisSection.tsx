
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Search } from 'lucide-react';
import { IntakeFormData } from '../types/IntakeFormData';

// Mock ICD-10/DSM-5 codes for demonstration
const MOCK_DIAGNOSES = [
  { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
  { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
  { code: 'F43.10', description: 'Post-traumatic stress disorder, unspecified' },
  { code: 'F43.20', description: 'Adjustment disorders, unspecified' },
  { code: 'F90.9', description: 'Attention-deficit hyperactivity disorder, unspecified type' },
  { code: 'F31.9', description: 'Bipolar disorder, unspecified' },
  { code: 'F40.10', description: 'Social phobia, unspecified' },
  { code: 'F42.9', description: 'Obsessive-compulsive disorder, unspecified' },
];

interface DiagnosisSectionProps {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  clientData: any;
}

const DiagnosisSection: React.FC<DiagnosisSectionProps> = ({
  formData,
  updateFormData,
  clientData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrimarySuggestions, setShowPrimarySuggestions] = useState(false);
  const [showSecondarySuggestions, setShowSecondarySuggestions] = useState(false);
  const [secondarySearchTerm, setSecondarySearchTerm] = useState('');

  const filteredDiagnoses = MOCK_DIAGNOSES.filter(
    (diagnosis) =>
      diagnosis.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSecondaryDiagnoses = MOCK_DIAGNOSES.filter(
    (diagnosis) =>
      diagnosis.code.toLowerCase().includes(secondarySearchTerm.toLowerCase()) ||
      diagnosis.description.toLowerCase().includes(secondarySearchTerm.toLowerCase())
  );

  const handlePrimaryDiagnosisSelect = (diagnosis: string) => {
    updateFormData({ primaryDiagnosis: diagnosis });
    setSearchTerm('');
    setShowPrimarySuggestions(false);
  };

  const addSecondaryDiagnosis = (diagnosis: string) => {
    if (!formData.secondaryDiagnoses.includes(diagnosis)) {
      updateFormData({
        secondaryDiagnoses: [...formData.secondaryDiagnoses, diagnosis]
      });
    }
    setSecondarySearchTerm('');
    setShowSecondarySuggestions(false);
  };

  const removeSecondaryDiagnosis = (diagnosis: string) => {
    updateFormData({
      secondaryDiagnoses: formData.secondaryDiagnoses.filter(d => d !== diagnosis)
    });
  };

  const showAddSecondaryForm = () => {
    setSecondarySearchTerm('');
    setShowSecondarySuggestions(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Diagnosis Guidelines</h4>
        <p className="text-blue-700 text-sm">
          Search and select appropriate ICD-10/DSM-5 diagnoses based on your clinical assessment. 
          You can search by code or description. Select one primary diagnosis and add additional 
          secondary diagnoses as needed.
        </p>
      </div>

      {/* Prior Diagnoses from Client Record */}
      {clientData?.prior_diagnoses && clientData.prior_diagnoses.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Prior Diagnoses on Record</h4>
          <div className="flex flex-wrap gap-2">
            {clientData.prior_diagnoses.map((diagnosis: string, index: number) => (
              <Badge key={index} variant="outline" className="text-sm p-2 bg-yellow-100">
                {diagnosis}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (!formData.primaryDiagnosis) {
                      handlePrimaryDiagnosisSelect(diagnosis);
                    } else {
                      addSecondaryDiagnosis(diagnosis);
                    }
                  }}
                  className="ml-2 h-4 w-4 p-0"
                  title="Use this diagnosis"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <p className="text-yellow-700 text-sm mt-2">
            Click the + button to use any of these prior diagnoses.
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
        {formData.primaryDiagnosis ? (
          <div className="mt-2">
            <Badge variant="outline" className="text-sm p-2">
              {formData.primaryDiagnosis}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFormData({ primaryDiagnosis: '' })}
                className="ml-2 h-4 w-4 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          </div>
        ) : (
          <div className="relative mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search ICD-10/DSM-5 diagnoses..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowPrimarySuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowPrimarySuggestions(searchTerm.length > 0)}
                className="pl-10"
              />
            </div>
            
            {showPrimarySuggestions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredDiagnoses.map((diagnosis) => (
                  <button
                    key={diagnosis.code}
                    onClick={() => handlePrimaryDiagnosisSelect(`${diagnosis.code} - ${diagnosis.description}`)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-sm">{diagnosis.code}</div>
                    <div className="text-gray-600 text-sm">{diagnosis.description}</div>
                  </button>
                ))}
                {filteredDiagnoses.length === 0 && (
                  <div className="px-4 py-3 text-gray-500 text-sm">
                    No diagnoses found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Label>Secondary Diagnoses</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={showAddSecondaryForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Secondary Diagnosis
          </Button>
        </div>

        {formData.secondaryDiagnoses.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.secondaryDiagnoses.map((diagnosis, index) => (
              <Badge key={index} variant="outline" className="text-sm p-2">
                {diagnosis}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSecondaryDiagnosis(diagnosis)}
                  className="ml-2 h-4 w-4 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {showSecondarySuggestions && (
          <div className="relative mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search ICD-10/DSM-5 diagnoses for secondary diagnosis..."
                value={secondarySearchTerm}
                onChange={(e) => setSecondarySearchTerm(e.target.value)}
                onBlur={() => setTimeout(() => setShowSecondarySuggestions(false), 200)}
                className="pl-10"
                autoFocus
              />
            </div>
            
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredSecondaryDiagnoses.map((diagnosis) => (
                <button
                  key={diagnosis.code}
                  onClick={() => addSecondaryDiagnosis(`${diagnosis.code} - ${diagnosis.description}`)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-sm">{diagnosis.code}</div>
                  <div className="text-gray-600 text-sm">{diagnosis.description}</div>
                </button>
              ))}
              {filteredSecondaryDiagnoses.length === 0 && (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  No diagnoses found matching "{secondarySearchTerm}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisSection;
