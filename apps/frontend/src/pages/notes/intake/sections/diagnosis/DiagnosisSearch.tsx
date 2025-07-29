
import React from 'react';
import { Input } from '@/components/basic/input';
import { Search } from 'lucide-react';

export interface DiagnosisOption {
  code: string;
  description: string;
}

interface DiagnosisSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFocus: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const DiagnosisSearch: React.FC<DiagnosisSearchProps> = ({
  searchTerm,
  onSearchChange,
  onFocus,
  placeholder = "Search ICD-10/DSM-5 diagnoses...",
  autoFocus = false,
}) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={onFocus}
        className="pl-10"
        autoFocus={autoFocus}
      />
    </div>
  );
};

export default DiagnosisSearch;
