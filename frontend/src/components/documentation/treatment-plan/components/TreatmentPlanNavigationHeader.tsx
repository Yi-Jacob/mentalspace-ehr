
import React from 'react';
import { Button } from '@/components/shared/ui/button';
import { Progress } from '@/components/shared/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TreatmentPlanNavigationHeaderProps {
  clientName?: string;
  progress: number;
  currentSection: number;
  totalSections: number;
}

const TreatmentPlanNavigationHeader: React.FC<TreatmentPlanNavigationHeaderProps> = ({
  clientName,
  progress,
  currentSection,
  totalSections,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/documentation')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Documentation
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Treatment Plan</h1>
              {clientName && (
                <p className="text-sm text-gray-600">Client: {clientName}</p>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Section {currentSection + 1} of {totalSections}
            </p>
            <div className="w-32">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentPlanNavigationHeader;
