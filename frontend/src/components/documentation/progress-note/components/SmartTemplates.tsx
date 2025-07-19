
import React, { useState } from 'react';
import { Button } from '@/components/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Badge } from '@/components/shared/ui/badge';
import { Textarea } from '@/components/shared/ui/textarea';
import { Lightbulb, Plus, X } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/shared/ui/collapsible';

interface Template {
  id: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
}

interface SmartTemplatesProps {
  onInsertTemplate: (content: string) => void;
  currentFieldValue?: string;
  fieldType: 'intervention' | 'subjective' | 'objective' | 'assessment' | 'plan';
}

const CLINICAL_TEMPLATES: Record<string, Template[]> = {
  intervention: [
    {
      id: 'cbt-thought-challenging',
      category: 'CBT',
      title: 'Cognitive Challenging',
      content: 'Explored client\'s automatic thoughts and cognitive distortions. Used Socratic questioning to help client examine evidence for and against negative thoughts. Client demonstrated improved ability to identify and challenge catastrophic thinking patterns.',
      tags: ['CBT', 'Thought Records', 'Cognitive Distortions']
    },
    {
      id: 'dbt-distress-tolerance',
      category: 'DBT',
      title: 'Distress Tolerance Skills',
      content: 'Reviewed and practiced DBT distress tolerance skills including TIPP (Temperature, Intense exercise, Paced breathing, Paired muscle relaxation). Client reported increased confidence in managing emotional crises without engaging in self-destructive behaviors.',
      tags: ['DBT', 'Distress Tolerance', 'TIPP', 'Crisis Survival']
    },
    {
      id: 'mindfulness-practice',
      category: 'Mindfulness',
      title: 'Mindfulness Training',
      content: 'Guided client through mindfulness meditation focusing on breath awareness and present-moment attention. Discussed application of mindfulness techniques to daily life situations. Client practiced observing thoughts without judgment.',
      tags: ['Mindfulness', 'Meditation', 'Present Moment']
    }
  ],
  subjective: [
    {
      id: 'mood-report',
      category: 'Mood',
      title: 'Mood Assessment',
      content: 'Client reports mood as [rating/10] this week. Describes feeling [emotions] particularly related to [triggers/situations]. Sleep pattern [description]. Appetite [normal/decreased/increased]. Energy level [description].',
      tags: ['Mood', 'Sleep', 'Appetite', 'Energy']
    },
    {
      id: 'anxiety-symptoms',
      category: 'Anxiety',
      title: 'Anxiety Symptoms',
      content: 'Client reports experiencing anxiety symptoms including [physical symptoms]. Triggers identified as [specific situations]. Frequency of panic attacks [description]. Current coping strategies include [strategies used].',
      tags: ['Anxiety', 'Panic', 'Triggers', 'Coping']
    }
  ],
  objective: [
    {
      id: 'appearance-cooperative',
      category: 'Presentation',
      title: 'Cooperative Presentation',
      content: 'Client appeared well-groomed and appropriately dressed for the session. Maintained good eye contact and was cooperative throughout. Speech was clear and goal-directed. No signs of acute distress observed.',
      tags: ['Appearance', 'Cooperative', 'Speech', 'Eye Contact']
    },
    {
      id: 'agitated-presentation',
      category: 'Presentation',
      title: 'Agitated Presentation',
      content: 'Client appeared restless and fidgety during session. Speech was rapid and pressured at times. Demonstrated some difficulty focusing on session content. Required redirection to therapeutic tasks.',
      tags: ['Agitation', 'Restless', 'Pressured Speech', 'Focus']
    }
  ],
  plan: [
    {
      id: 'homework-assignment',
      category: 'Homework',
      title: 'Therapeutic Homework',
      content: 'Assigned [specific homework task] to practice between sessions. Client will track [specific behaviors/thoughts/feelings] using provided worksheet. Follow-up on progress next session.',
      tags: ['Homework', 'Practice', 'Tracking', 'Worksheets']
    },
    {
      id: 'crisis-planning',
      category: 'Safety',
      title: 'Crisis Plan Review',
      content: 'Reviewed and updated safety plan. Client identified warning signs, coping strategies, and support contacts. Discussed when to implement crisis plan and emergency resources available.',
      tags: ['Crisis Plan', 'Safety', 'Warning Signs', 'Support']
    }
  ]
};

const SmartTemplates: React.FC<SmartTemplatesProps> = ({
  onInsertTemplate,
  currentFieldValue = '',
  fieldType
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const templates = CLINICAL_TEMPLATES[fieldType] || [];
  const categories = Array.from(new Set(templates.map(t => t.category)));

  const handleInsertTemplate = (template: Template) => {
    const newContent = currentFieldValue 
      ? `${currentFieldValue}\n\n${template.content}`
      : template.content;
    onInsertTemplate(newContent);
    setIsOpen(false);
  };

  if (templates.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="mb-2 text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Smart Templates
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="mb-4 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-blue-900">Clinical Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                type="button"
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="h-7"
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  type="button"
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="h-7"
                >
                  {category}
                </Button>
              ))}
            </div>
            
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {templates
                .filter(template => !selectedCategory || template.category === selectedCategory)
                .map(template => (
                  <div key={template.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{template.title}</h4>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleInsertTemplate(template)}
                        className="h-6 px-2 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Insert
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {template.content}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SmartTemplates;
