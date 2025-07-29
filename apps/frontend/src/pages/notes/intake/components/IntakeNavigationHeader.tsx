
import React from 'react';
import { Button } from '@/components/basic/button';
import { SidebarTrigger } from '@/components/basic/sidebar';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IntakeNavigationHeaderProps {
  clientName?: string;
  progress: number;
  currentSection: number;
  totalSections: number;
}

const IntakeNavigationHeader: React.FC<IntakeNavigationHeaderProps> = ({
  clientName,
  progress,
  currentSection,
  totalSections
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/notes')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Notes</span>
            </Button>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <div>
              <h1 className="text-xl font-semibold">Intake Assessment</h1>
              <p className="text-sm text-gray-600">
                {clientName || 'No client assigned - Please select a client in the overview section'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Progress: {currentSection + 1} of {totalSections}
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntakeNavigationHeader;
