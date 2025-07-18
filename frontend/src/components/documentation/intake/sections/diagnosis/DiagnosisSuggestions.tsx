
import React from 'react';
import { DiagnosisOption } from './DiagnosisSearch';

interface DiagnosisSuggestionsProps {
  diagnoses: DiagnosisOption[];
  onSelect: (diagnosis: string) => void;
  searchTerm: string;
}

const DiagnosisSuggestions: React.FC<DiagnosisSuggestionsProps> = ({
  diagnoses,
  onSelect,
  searchTerm,
}) => {
  return (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
      {diagnoses.map((diagnosis) => (
        <button
          key={diagnosis.code}
          onClick={() => onSelect(`${diagnosis.code} - ${diagnosis.description}`)}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
        >
          <div className="font-medium text-sm">{diagnosis.code}</div>
          <div className="text-gray-600 text-sm">{diagnosis.description}</div>
        </button>
      ))}
      {diagnoses.length === 0 && (
        <div className="px-4 py-3 text-gray-500 text-sm">
          No diagnoses found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default DiagnosisSuggestions;
