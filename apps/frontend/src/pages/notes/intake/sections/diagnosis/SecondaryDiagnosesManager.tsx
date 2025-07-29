
import React, { useState } from 'react';
import { Label } from '@/components/basic/label';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { Plus, X } from 'lucide-react';
import DiagnosisSearch, { DiagnosisOption } from './DiagnosisSearch';
import DiagnosisSuggestions from './DiagnosisSuggestions';

interface SecondaryDiagnosesManagerProps {
  secondaryDiagnoses: string[];
  onAdd: (diagnosis: string) => void;
  onRemove: (diagnosis: string) => void;
  availableDiagnoses: DiagnosisOption[];
}

const SecondaryDiagnosesManager: React.FC<SecondaryDiagnosesManagerProps> = ({
  secondaryDiagnoses,
  onAdd,
  onRemove,
  availableDiagnoses,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredDiagnoses = availableDiagnoses.filter(
    (diagnosis) =>
      diagnosis.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (diagnosis: string) => {
    if (!secondaryDiagnoses.includes(diagnosis)) {
      onAdd(diagnosis);
    }
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const showAddForm = () => {
    setSearchTerm('');
    setShowSuggestions(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label>Secondary Diagnoses</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={showAddForm}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Secondary Diagnosis
        </Button>
      </div>

      {secondaryDiagnoses.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {secondaryDiagnoses.map((diagnosis, index) => (
            <Badge key={index} variant="outline" className="text-sm p-2">
              {diagnosis}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(diagnosis)}
                className="ml-2 h-4 w-4 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {showSuggestions && (
        <div className="relative mb-4">
          <DiagnosisSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFocus={() => {}}
            placeholder="Search ICD-10/DSM-5 diagnoses for secondary diagnosis..."
            autoFocus
          />
          
          <DiagnosisSuggestions
            diagnoses={filteredDiagnoses}
            onSelect={handleAdd}
            searchTerm={searchTerm}
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSuggestions(false)}
            className="mt-2"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default SecondaryDiagnosesManager;
