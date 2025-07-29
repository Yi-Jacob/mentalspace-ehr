
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';

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
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">Sections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => onSectionClick(index)}
            className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
              index === currentSection
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : index < currentSection
                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                index === currentSection
                  ? 'bg-blue-600 text-white'
                  : index < currentSection
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </span>
              <span>{section.title}</span>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default SectionNavigation;
