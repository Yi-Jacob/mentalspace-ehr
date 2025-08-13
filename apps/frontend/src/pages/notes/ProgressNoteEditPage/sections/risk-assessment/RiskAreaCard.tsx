
import React from 'react';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Button } from '@/components/basic/button';
import { RadioGroup, RadioGroupItem } from '@/components/basic/radio-group';
import { X } from 'lucide-react';
import { RiskFactorQuickButtons } from './RiskFactorQuickButtons';

interface RiskArea {
  areaOfRisk: string;
  levelOfRisk: 'Low' | 'Medium' | 'High' | 'Imminent';
  intentToAct: 'Yes' | 'No' | 'Not Applicable';
  planToAct: 'Yes' | 'No' | 'Not Applicable';
  meansToAct: 'Yes' | 'No' | 'Not Applicable';
  riskFactors: string;
  protectiveFactors: string;
  additionalDetails: string;
}

interface RiskAreaCardProps {
  riskArea: RiskArea;
  index: number;
  onUpdate: (index: number, updates: Partial<RiskArea>) => void;
  onRemove: (index: number) => void;
  areaOfRiskOptions: string[];
}

export const RiskAreaCard: React.FC<RiskAreaCardProps> = ({
  riskArea,
  index,
  onUpdate,
  onRemove,
  areaOfRiskOptions,
}) => {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Risk Area {index + 1}</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Area of Risk Dropdown */}
      <div>
        <Label>Area of Risk:</Label>
        <Select
          value={riskArea.areaOfRisk}
          onValueChange={(value) => onUpdate(index, { areaOfRisk: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select area of risk..." />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {areaOfRiskOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Level of Risk, Intent, Plan, Means - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label className="text-sm font-medium">Level of Risk:</Label>
          <RadioGroup
            value={riskArea.levelOfRisk}
            onValueChange={(value) => onUpdate(index, { levelOfRisk: value as 'Low' | 'Medium' | 'High' | 'Imminent' })}
            className="mt-2"
          >
            {['Low', 'Medium', 'High', 'Imminent'].map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <RadioGroupItem value={level} id={`level-${index}-${level}`} />
                <Label htmlFor={`level-${index}-${level}`} className="text-sm">
                  {level}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium">Intent to Act:</Label>
          <RadioGroup
            value={riskArea.intentToAct}
            onValueChange={(value) => onUpdate(index, { intentToAct: value as 'Yes' | 'No' | 'Not Applicable' })}
            className="mt-2"
          >
            {['Yes', 'No', 'Not Applicable'].map((intent) => (
              <div key={intent} className="flex items-center space-x-2">
                <RadioGroupItem value={intent} id={`intent-${index}-${intent}`} />
                <Label htmlFor={`intent-${index}-${intent}`} className="text-sm">
                  {intent}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium">Plan to Act:</Label>
          <RadioGroup
            value={riskArea.planToAct}
            onValueChange={(value) => onUpdate(index, { planToAct: value as 'Yes' | 'No' | 'Not Applicable' })}
            className="mt-2"
          >
            {['Yes', 'No', 'Not Applicable'].map((plan) => (
              <div key={plan} className="flex items-center space-x-2">
                <RadioGroupItem value={plan} id={`plan-${index}-${plan}`} />
                <Label htmlFor={`plan-${index}-${plan}`} className="text-sm">
                  {plan}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium">Means to Act:</Label>
          <RadioGroup
            value={riskArea.meansToAct}
            onValueChange={(value) => onUpdate(index, { meansToAct: value as 'Yes' | 'No' | 'Not Applicable' })}
            className="mt-2"
          >
            {['Yes', 'No', 'Not Applicable'].map((means) => (
              <div key={means} className="flex items-center space-x-2">
                <RadioGroupItem value={means} id={`means-${index}-${means}`} />
                <Label htmlFor={`means-${index}-${means}`} className="text-sm">
                  {means}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Risk Factors */}
      <div>
        <Label>Risk Factors:</Label>
        <Textarea
          value={riskArea.riskFactors}
          onChange={(e) => onUpdate(index, { riskFactors: e.target.value })}
          placeholder="Enter risk factors..."
          rows={3}
          className="mt-1"
        />
        <RiskFactorQuickButtons
          type="riskFactors"
          currentFactors={riskArea.riskFactors}
          onAddFactor={(factor) => {
            const currentFactors = riskArea.riskFactors || '';
            const newFactors = currentFactors 
              ? `${currentFactors}, ${factor}`
              : factor;
            onUpdate(index, { riskFactors: newFactors });
          }}
        />
      </div>

      {/* Protective Factors */}
      <div>
        <Label>Protective Factors:</Label>
        <Textarea
          value={riskArea.protectiveFactors}
          onChange={(e) => onUpdate(index, { protectiveFactors: e.target.value })}
          placeholder="Enter protective factors..."
          rows={3}
          className="mt-1"
        />
        <RiskFactorQuickButtons
          type="protectiveFactors"
          currentFactors={riskArea.protectiveFactors}
          onAddFactor={(factor) => {
            const currentFactors = riskArea.protectiveFactors || '';
            const newFactors = currentFactors 
              ? `${currentFactors}, ${factor}`
              : factor;
            onUpdate(index, { protectiveFactors: newFactors });
          }}
        />
      </div>

      {/* Additional Details */}
      <div>
        <Label>Additional Details:</Label>
        <Textarea
          value={riskArea.additionalDetails}
          onChange={(e) => onUpdate(index, { additionalDetails: e.target.value })}
          placeholder="Additional details about this risk area..."
          rows={2}
          className="mt-1"
        />
      </div>
    </div>
  );
};
