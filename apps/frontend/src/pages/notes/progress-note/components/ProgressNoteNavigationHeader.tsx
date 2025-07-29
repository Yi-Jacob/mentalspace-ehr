
import React from 'react';
import { Progress } from '@/components/basic/progress';
import { Button } from '@/components/basic/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProgressNoteNavigationHeaderProps {
  clientName?: string;
  progress: number;
  currentSection: number;
  totalSections: number;
}

const ProgressNoteNavigationHeader: React.FC<ProgressNoteNavigationHeaderProps> = ({
  clientName,
  progress,
  currentSection,
  totalSections,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/notes')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Notes
            </Button>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold">Progress Note</h1>
                {clientName && (
                  <p className="text-sm text-gray-600">Client: {clientName}</p>
                )}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Section {currentSection + 1} of {totalSections}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default ProgressNoteNavigationHeader;
