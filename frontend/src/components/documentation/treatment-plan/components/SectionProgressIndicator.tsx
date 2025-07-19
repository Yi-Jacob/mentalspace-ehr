
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface SectionProgressIndicatorProps {
  sections: Array<{
    id: string;
    title: string;
    isComplete: boolean;
    hasRequiredFields: boolean;
    requiredFieldsComplete: boolean;
  }>;
  currentSection: number;
}

const SectionProgressIndicator: React.FC<SectionProgressIndicatorProps> = ({
  sections,
  currentSection,
}) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Progress Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sections.map((section, index) => {
          const isCurrent = index === currentSection;
          const isComplete = section.isComplete;
          const hasErrors = section.hasRequiredFields && !section.requiredFieldsComplete;
          
          return (
            <div 
              key={section.id}
              className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                isCurrent ? 'bg-purple-50 border border-purple-200' : 
                isComplete ? 'bg-green-50' :
                hasErrors ? 'bg-red-50' : 'bg-gray-50'
              }`}
            >
              {isComplete ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : hasErrors ? (
                <AlertCircle className="w-5 h-5 text-red-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
              <span className={`text-sm font-medium ${
                isCurrent ? 'text-purple-900' :
                isComplete ? 'text-green-900' :
                hasErrors ? 'text-red-900' : 'text-gray-700'
              }`}>
                {section.title}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SectionProgressIndicator;
