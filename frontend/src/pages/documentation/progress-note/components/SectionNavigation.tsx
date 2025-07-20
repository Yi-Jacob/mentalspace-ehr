
import React from 'react';
import { cn } from '@/utils/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  component: React.ComponentType<any>;
}

interface SectionNavigationProps {
  sections: Section[];
  currentSection: number;
  onSectionClick: (index: number) => void;
}

const SectionNavigation: React.FC<SectionNavigationProps> = ({
  sections,
  currentSection,
  onSectionClick,
}) => {
  return (
    <Card className="lg:sticky lg:top-6">
      <CardHeader>
        <CardTitle className="text-lg">Progress Note Sections</CardTitle>
      </CardHeader>
      <CardContent>
        <nav className="space-y-2">
          {sections.map((section, index) => {
            const isActive = currentSection === index;
            const isCompleted = index < currentSection;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionClick(index)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-3",
                  isActive
                    ? "bg-blue-100 text-blue-900 border border-blue-200"
                    : isCompleted
                    ? "bg-green-50 text-green-800 hover:bg-green-100"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className={cn(
                      "h-5 w-5",
                      isActive ? "text-blue-600" : "text-gray-400"
                    )} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {section.title}
                  </div>
                  <div className="text-xs opacity-75">
                    Step {index + 1}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
};

export default SectionNavigation;
