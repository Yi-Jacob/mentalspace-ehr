
import React from 'react';
import { Button } from '@/components/basic/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';

interface SectionNavigationProps {
  sections: Array<{ id: string; title: string }>;
  currentSection: number;
  onSectionClick: (index: number) => void;
}

const SectionNavigation: React.FC<SectionNavigationProps> = ({
  sections,
  currentSection,
  onSectionClick,
}) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Quick Navigation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sections.map((section, index) => (
          <Button
            key={section.id}
            variant={index === currentSection ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start text-left"
            onClick={() => onSectionClick(index)}
          >
            {index + 1}. {section.title}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default SectionNavigation;
