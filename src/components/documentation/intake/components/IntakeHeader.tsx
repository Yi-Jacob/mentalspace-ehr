
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface IntakeHeaderProps {
  clientName?: string;
  progress: number;
  currentSection: number;
  totalSections: number;
}

const IntakeHeader: React.FC<IntakeHeaderProps> = ({
  clientName,
  progress,
  currentSection,
  totalSections,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Intake Assessment</CardTitle>
            <p className="text-gray-600 mt-1">
              {clientName ? (
                `Client: ${clientName}`
              ) : (
                'No client assigned - Please select a client in the overview section'
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Progress</p>
            <div className="w-32">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {currentSection + 1} of {totalSections}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default IntakeHeader;
