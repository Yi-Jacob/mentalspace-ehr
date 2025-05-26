
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { TreatmentPlanFormData } from '../types/TreatmentPlanFormData';
import { Textarea } from '@/components/ui/textarea';

interface TreatmentGoalsSectionProps {
  formData: TreatmentPlanFormData;
  updateFormData: (updates: Partial<TreatmentPlanFormData>) => void;
  clientData?: any;
}

// Predefined intervention strategies
const interventionStrategies = [
  'Cognitive Challenging',
  'Cognitive Refocusing', 
  'Cognitive Reframing',
  'Communication Skills',
  'Compliance Issues',
  'DBT',
  'Exploration of Coping Patterns',
  'Exploration of Emotions',
  'Exploration of Relationship Patterns',
  'Guided Imagery',
  'Interactive Feedback',
  'Interpersonal Resolutions',
  'Mindfulness Training',
  'Preventative Services',
  'Psycho-Education',
  'Relaxation/Deep Breathing',
  'Review of Treatment Plan/Progress',
  'Role-Play/Behavioral Rehearsal',
  'Structured Problem Solving',
  'Supportive Reflection',
  'Symptom Management',
  'Other'
];

const TreatmentGoalsSection: React.FC<TreatmentGoalsSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const [openGoals, setOpenGoals] = React.useState<number[]>([]);

  const addGoal = () => {
    const newGoals = [...formData.treatmentGoals, {
      goalText: '',
      objectives: []
    }];
    updateFormData({ treatmentGoals: newGoals });
    setOpenGoals([...openGoals, newGoals.length - 1]);
  };

  const removeGoal = (goalIndex: number) => {
    const newGoals = formData.treatmentGoals.filter((_, i) => i !== goalIndex);
    updateFormData({ treatmentGoals: newGoals });
    setOpenGoals(openGoals.filter(i => i !== goalIndex).map(i => i > goalIndex ? i - 1 : i));
  };

  const updateGoal = (goalIndex: number, goalText: string) => {
    const newGoals = [...formData.treatmentGoals];
    newGoals[goalIndex] = { ...newGoals[goalIndex], goalText };
    updateFormData({ treatmentGoals: newGoals });
  };

  const addObjective = (goalIndex: number) => {
    const newGoals = [...formData.treatmentGoals];
    newGoals[goalIndex].objectives.push({
      objectiveText: '',
      estimatedCompletion: '3 months',
      completionDate: '',
      strategies: []
    });
    updateFormData({ treatmentGoals: newGoals });
  };

  const removeObjective = (goalIndex: number, objectiveIndex: number) => {
    const newGoals = [...formData.treatmentGoals];
    newGoals[goalIndex].objectives = newGoals[goalIndex].objectives.filter((_, i) => i !== objectiveIndex);
    updateFormData({ treatmentGoals: newGoals });
  };

  const updateObjective = (goalIndex: number, objectiveIndex: number, field: string, value: string) => {
    const newGoals = [...formData.treatmentGoals];
    newGoals[goalIndex].objectives[objectiveIndex] = {
      ...newGoals[goalIndex].objectives[objectiveIndex],
      [field]: value
    };
    updateFormData({ treatmentGoals: newGoals });
  };

  const toggleStrategy = (goalIndex: number, objectiveIndex: number, strategy: string) => {
    const newGoals = [...formData.treatmentGoals];
    const objective = newGoals[goalIndex].objectives[objectiveIndex];
    const strategies = objective.strategies.includes(strategy)
      ? objective.strategies.filter(s => s !== strategy)
      : [...objective.strategies, strategy];
    
    newGoals[goalIndex].objectives[objectiveIndex] = {
      ...objective,
      strategies
    };
    updateFormData({ treatmentGoals: newGoals });
  };

  const toggleGoal = (goalIndex: number) => {
    setOpenGoals(prev => 
      prev.includes(goalIndex) 
        ? prev.filter(i => i !== goalIndex)
        : [...prev, goalIndex]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Treatment Goals & Objectives</h3>
          <p className="text-sm text-gray-600">Define treatment goals and their specific objectives</p>
        </div>
        <Button onClick={addGoal}>
          <Plus className="w-4 h-4 mr-2" />
          + New Goal
        </Button>
      </div>

      {formData.treatmentGoals.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">No treatment goals added yet. Click "New Goal" to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {formData.treatmentGoals.map((goal, goalIndex) => (
            <Card key={goalIndex}>
              <Collapsible open={openGoals.includes(goalIndex)} onOpenChange={() => toggleGoal(goalIndex)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Treatment Goal {goalIndex + 1}
                        {goal.goalText && (
                          <span className="text-sm font-normal text-gray-600 ml-2">
                            - {goal.goalText.substring(0, 50)}...
                          </span>
                        )}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {goal.objectives.length} objective{goal.objectives.length !== 1 ? 's' : ''}
                        </Badge>
                        {openGoals.includes(goalIndex) ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        }
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="flex items-start space-x-2">
                      <div className="flex-1">
                        <Label htmlFor={`goal-${goalIndex}`}>Goal Description</Label>
                        <Textarea
                          id={`goal-${goalIndex}`}
                          value={goal.goalText}
                          onChange={(e) => updateGoal(goalIndex, e.target.value)}
                          placeholder="Describe the treatment goal..."
                          rows={3}
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeGoal(goalIndex)}
                        className="mt-6"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Objectives</h4>
                        <Button size="sm" onClick={() => addObjective(goalIndex)}>
                          <Plus className="w-4 h-4 mr-2" />
                          + New Objective
                        </Button>
                      </div>

                      {goal.objectives.length === 0 ? (
                        <p className="text-gray-500 text-sm">No objectives added for this goal yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {goal.objectives.map((objective, objectiveIndex) => (
                            <Card key={objectiveIndex} className="bg-gray-50">
                              <CardContent className="p-4 space-y-4">
                                <div className="flex items-start justify-between">
                                  <h5 className="font-medium">Objective {objectiveIndex + 1}</h5>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeObjective(goalIndex, objectiveIndex)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>

                                <div>
                                  <Label>Objective Description</Label>
                                  <Textarea
                                    value={objective.objectiveText}
                                    onChange={(e) => updateObjective(goalIndex, objectiveIndex, 'objectiveText', e.target.value)}
                                    placeholder="Describe the specific objective..."
                                    rows={2}
                                  />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Estimated Completion</Label>
                                    <Select
                                      value={objective.estimatedCompletion}
                                      onValueChange={(value) => updateObjective(goalIndex, objectiveIndex, 'estimatedCompletion', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="3 months">3 months</SelectItem>
                                        <SelectItem value="6 months">6 months</SelectItem>
                                        <SelectItem value="9 months">9 months</SelectItem>
                                        <SelectItem value="12 months">12 months</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label>Target Completion Date</Label>
                                    <Input
                                      type="date"
                                      value={objective.completionDate}
                                      onChange={(e) => updateObjective(goalIndex, objectiveIndex, 'completionDate', e.target.value)}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Strategy / Intervention</Label>
                                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {interventionStrategies.map((strategy) => (
                                      <Button
                                        key={strategy}
                                        size="sm"
                                        variant={objective.strategies.includes(strategy) ? "default" : "outline"}
                                        onClick={() => toggleStrategy(goalIndex, objectiveIndex, strategy)}
                                        className="text-xs"
                                      >
                                        + {strategy}
                                      </Button>
                                    ))}
                                  </div>
                                  {objective.strategies.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {objective.strategies.map((strategy) => (
                                        <Badge key={strategy} variant="secondary" className="text-xs">
                                          {strategy}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TreatmentGoalsSection;
