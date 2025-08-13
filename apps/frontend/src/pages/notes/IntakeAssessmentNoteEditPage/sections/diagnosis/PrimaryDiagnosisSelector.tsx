
import React, { useState } from 'react';
import { Label } from '@/components/basic/label';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { X } from 'lucide-react';
import DiagnosisSearch, { DiagnosisOption } from './DiagnosisSearch';
import DiagnosisSuggestions from './DiagnosisSuggestions';

interface PrimaryDiagnosisSelectorProps {
  primaryDiagnosis: string;
  onSelect: (diagnosis: string) => void;
  availableDiagnoses: DiagnosisOption[];
}

const PrimaryDiagnosisSelector: React.FC<PrimaryDiagnosisSelectorProps> = ({
  primaryDiagnosis,
  onSelect,
  availableDiagnoses,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredDiagnoses = availableDiagnoses.filter(
    (diagnosis) =>
      diagnosis.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (diagnosis: string) => {
    onSelect(diagnosis);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleClear = () => {
    onSelect('');
  };

  return (
    <div>
      <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
      {primaryDiagnosis ? (
        <div className="mt-2">
          <Badge variant="outline" className="text-sm p-2">
            {primaryDiagnosis}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="ml-2 h-4 w-4 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      ) : (
        <div className="relative mt-2">
          <DiagnosisSearch
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setShowSuggestions(value.length > 0);
            }}
            onFocus={() => setShowSuggestions(searchTerm.length > 0)}
          />
          
          {showSuggestions && (
            <DiagnosisSuggestions
              diagnoses={filteredDiagnoses}
              onSelect={handleSelect}
              searchTerm={searchTerm}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PrimaryDiagnosisSelector;
