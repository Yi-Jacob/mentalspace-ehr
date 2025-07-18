
import React from 'react';
import { CheckCircle, AlertCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const getIcon = (section: any, index: number) => {
    if (section.isComplete) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (section.hasRequiredFields && !section.requiredFieldsComplete && index < currentSection) {
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    }
    return <Circle className={cn(
      "h-5 w-5",
      index === currentSection ? "text-blue-600" : "text-gray-400"
    )} />;
  };

  const completedSections = sections.filter(s => s.isComplete).length;
  const progressPercentage = (completedSections / sections.length) * 100;

  return (
    <div className="bg-white border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">Progress Overview</h3>
        <span className="text-sm text-gray-600">
          {completedSections} of {sections.length} sections complete
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="grid grid-cols-1 gap-2">
        {sections.map((section, index) => (
          <div key={section.id} className="flex items-center space-x-3">
            {getIcon(section, index)}
            <span className={cn(
              "text-sm flex-1",
              section.isComplete ? "text-green-800 font-medium" : 
              index === currentSection ? "text-blue-800 font-medium" : "text-gray-600"
            )}>
              {section.title}
            </span>
            {section.hasRequiredFields && !section.requiredFieldsComplete && index < currentSection && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                Incomplete
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionProgressIndicator;
