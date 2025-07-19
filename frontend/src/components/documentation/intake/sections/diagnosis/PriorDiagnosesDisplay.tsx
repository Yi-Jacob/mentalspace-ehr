
import React from 'react';
import { Badge } from '@/components/shared/ui/badge';
import { Button } from '@/components/shared/ui/button';
import { Plus } from 'lucide-react';

interface PriorDiagnosesDisplayProps {
  priorDiagnoses: string[];
  onUseDiagnosis: (diagnosis: string) => void;
}

const PriorDiagnosesDisplay: React.FC<PriorDiagnosesDisplayProps> = ({
  priorDiagnoses,
  onUseDiagnosis,
}) => {
  if (!priorDiagnoses || priorDiagnoses.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 p-4 rounded-lg">
      <h4 className="font-medium text-yellow-800 mb-2">Prior Diagnoses on Record</h4>
      <div className="flex flex-wrap gap-2">
        {priorDiagnoses.map((diagnosis: string, index: number) => (
          <Badge key={index} variant="outline" className="text-sm p-2 bg-yellow-100">
            {diagnosis}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUseDiagnosis(diagnosis)}
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
  );
};

export default PriorDiagnosesDisplay;
