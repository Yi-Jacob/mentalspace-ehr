
import React from 'react';
import { Button } from '@/components/basic/button';
import { Plus } from 'lucide-react';

const RISK_FACTOR_SUGGESTIONS = [
  'Current ideation',
  'Access to means',
  'History of attempts/behaviors',
  'Alcohol/Substance use',
  'Impulsivity',
  'Hopelessness',
  'Recent loss',
  'Family history',
  'Social isolation',
  'Chronic pain',
  'Mental illness',
  'Previous hospitalization'
];

const PROTECTIVE_FACTOR_SUGGESTIONS = [
  'Positive social support',
  'Cultural/religious beliefs',
  'Social responsibility',
  'Children in the home',
  'Life satisfaction',
  'Positive coping skills',
  'Sufficient problem-solving skills',
  'Strong therapeutic rapport',
  'Employment',
  'Financial stability',
  'Future goals',
  'Pets/Animals'
];

interface RiskFactorQuickButtonsProps {
  type: 'riskFactors' | 'protectiveFactors';
  currentFactors: string;
  onAddFactor: (factor: string) => void;
}

export const RiskFactorQuickButtons: React.FC<RiskFactorQuickButtonsProps> = ({
  type,
  currentFactors,
  onAddFactor,
}) => {
  const suggestions = type === 'riskFactors' ? RISK_FACTOR_SUGGESTIONS : PROTECTIVE_FACTOR_SUGGESTIONS;
  
  const existingFactors = (currentFactors || '')
    .split(',')
    .map(f => f.trim().toLowerCase())
    .filter(f => f.length > 0);

  const handleAddFactor = (factor: string) => {
    // Check if factor already exists (case-insensitive)
    if (existingFactors.includes(factor.toLowerCase())) {
      return; // Don't add duplicate factor
    }
    onAddFactor(factor);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {suggestions.map((factor) => {
        const isAlreadyAdded = existingFactors.includes(factor.toLowerCase());
        
        return (
          <Button
            key={factor}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddFactor(factor)}
            disabled={isAlreadyAdded}
            className={`text-xs h-7 ${isAlreadyAdded ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Plus className="h-3 w-3 mr-1" />
            {factor}
          </Button>
        );
      })}
    </div>
  );
};
