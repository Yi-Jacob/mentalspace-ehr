import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, GripVertical, Trash2, Save, BarChart3 } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { useToast } from '@/hooks/use-toast';
import { outcomeMeasureService } from '@/services/outcomeMeasureService';
import { 
  UpdateOutcomeMeasureDto, 
  OutcomeQuestion, 
  OutcomeOption, 
  ScoringCriterion 
} from '@/types/outcomeMeasureType';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';

const OutcomeMeasureEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sharable, setSharable] = useState<'sharable' | 'not_sharable'>('not_sharable');
  const [accessLevel, setAccessLevel] = useState<'admin' | 'clinician' | 'billing'>('admin');
  
  // Questions and scoring
  const [questions, setQuestions] = useState<OutcomeQuestion[]>([]);
  const [scoringCriteria, setScoringCriteria] = useState<ScoringCriterion[]>([]);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);

  useEffect(() => {
    const fetchMeasure = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const measure = await outcomeMeasureService.getOutcomeMeasureById(id);
        
        setTitle(measure.title);
        setDescription(measure.description || '');
        setSharable(measure.sharable);
        setAccessLevel(measure.accessLevel);
        setQuestions(measure.content.questions);
        setScoringCriteria(measure.content.scoringCriteria);
      } catch (error) {
        console.error('Error fetching outcome measure:', error);
        toast({
          title: "Error",
          description: "Failed to load outcome measure",
          variant: "destructive",
        });
        navigate('/library');
      } finally {
        setLoading(false);
      }
    };

    fetchMeasure();
  }, [id, navigate, toast]);

  const addQuestion = (type: OutcomeQuestion['type']) => {
    const newQuestion: OutcomeQuestion = {
      id: `question_${Date.now()}`,
      question: '',
      type,
      options: [
        { id: `option_${Date.now()}_1`, text: '', score: 0 },
        { id: `option_${Date.now()}_2`, text: '', score: 1 }
      ],
      required: true,
    };
    
    setQuestions([...questions, newQuestion]);
    setShowQuestionSelector(false);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, updates: Partial<OutcomeQuestion>) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    ));
  };

  const addOptionToQuestion = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOption: OutcomeOption = {
          id: `option_${Date.now()}`,
          text: '',
          score: q.options.length
        };
        return { ...q, options: [...q.options, newOption] };
      }
      return q;
    }));
  };

  const removeOptionFromQuestion = (questionId: string, optionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const filteredOptions = q.options.filter(opt => opt.id !== optionId);
        return { ...q, options: filteredOptions };
      }
      return q;
    }));
  };

  const updateOption = (questionId: string, optionId: string, updates: Partial<OutcomeOption>) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map(opt => 
            opt.id === optionId ? { ...opt, ...updates } : opt
          )
        };
      }
      return q;
    }));
  };

  const addScoringCriterion = () => {
    const newCriterion: ScoringCriterion = {
      id: `criterion_${Date.now()}`,
      minScore: 0,
      maxScore: 10,
      label: '',
      description: '',
      color: '#3B82F6'
    };
    setScoringCriteria([...scoringCriteria, newCriterion]);
  };

  const removeScoringCriterion = (criterionId: string) => {
    setScoringCriteria(scoringCriteria.filter(c => c.id !== criterionId));
  };

  const updateScoringCriterion = (criterionId: string, updates: Partial<ScoringCriterion>) => {
    setScoringCriteria(scoringCriteria.map(c => 
      c.id === criterionId ? { ...c, ...updates } : c
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "At least one question is required",
        variant: "destructive",
      });
      return;
    }

    if (scoringCriteria.length === 0) {
      toast({
        title: "Error",
        description: "At least one scoring criterion is required",
        variant: "destructive",
      });
      return;
    }

    // Validate questions
    for (const question of questions) {
      if (!question.question.trim()) {
        toast({
          title: "Error",
          description: "All questions must have text",
          variant: "destructive",
        });
        return;
      }
      if (question.options.length === 0) {
        toast({
          title: "Error",
          description: "All questions must have at least one option",
          variant: "destructive",
        });
        return;
      }
      for (const option of question.options) {
        if (!option.text.trim()) {
          toast({
            title: "Error",
            description: "All options must have text",
            variant: "destructive",
          });
          return;
        }
      }
    }

    // Validate scoring criteria
    for (const criterion of scoringCriteria) {
      if (!criterion.label.trim()) {
        toast({
          title: "Error",
          description: "All scoring criteria must have labels",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setSaving(true);
      
      const updateData: UpdateOutcomeMeasureDto = {
        title: title.trim(),
        description: description.trim() || undefined,
        sharable,
        accessLevel,
        content: {
          questions,
          scoringCriteria
        }
      };

      await outcomeMeasureService.updateOutcomeMeasure(id!, updateData);
      
      toast({
        title: "Success",
        description: "Outcome measure updated successfully",
      });
      
      navigate(`/library/outcome-measures/${id}`);
    } catch (error) {
      console.error('Error updating outcome measure:', error);
      toast({
        title: "Error",
        description: "Failed to update outcome measure",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading outcome measure..." />;
  }

  return (
    <PageLayout>
      <PageHeader
        icon={BarChart3}
        title="Edit Outcome Measure"
        description="Update the survey questions, options, and scoring criteria"
        action={
          <Button
            variant="outline"
            onClick={() => navigate(`/library/outcome-measures/${id}`)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to View</span>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter outcome measure title"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description (optional)"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sharable">Sharable</Label>
                <Select value={sharable} onValueChange={(value: 'sharable' | 'not_sharable') => setSharable(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sharable">Sharable</SelectItem>
                    <SelectItem value="not_sharable">Not Sharable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="accessLevel">Access Level</Label>
                <Select value={accessLevel} onValueChange={(value: 'admin' | 'clinician' | 'billing') => setAccessLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="clinician">Clinician</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Questions</CardTitle>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowQuestionSelector(!showQuestionSelector)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Question</span>
                </Button>
                
                {showQuestionSelector && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                    <button
                      type="button"
                      onClick={() => addQuestion('single_choice')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      Single Choice
                    </button>
                    <button
                      type="button"
                      onClick={() => addQuestion('multiple_choice')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      Multiple Choice
                    </button>
                    <button
                      type="button"
                      onClick={() => addQuestion('scale')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      Scale
                    </button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No questions added yet. Click "Add Question" to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">Question {index + 1}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {question.type.replace('_', ' ')}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Question Text *</Label>
                        <Input
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                          placeholder="Enter your question"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`required-${question.id}`}
                          checked={question.required}
                          onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                        />
                        <Label htmlFor={`required-${question.id}`}>Required</Label>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Options</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOptionToQuestion(question.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <Input
                                value={option.text}
                                onChange={(e) => updateOption(question.id, option.id, { text: e.target.value })}
                                placeholder={`Option ${optionIndex + 1}`}
                                className="flex-1"
                              />
                              <Input
                                type="number"
                                value={option.score}
                                onChange={(e) => updateOption(question.id, option.id, { score: parseInt(e.target.value) || 0 })}
                                placeholder="Score"
                                className="w-20"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOptionFromQuestion(question.id, option.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scoring Criteria */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Scoring Criteria</CardTitle>
              <Button
                type="button"
                variant="outline"
                onClick={addScoringCriterion}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Criterion</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {scoringCriteria.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No scoring criteria added yet. Click "Add Criterion" to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {scoringCriteria.map((criterion, index) => (
                  <div key={criterion.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">Criterion {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeScoringCriterion(criterion.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Min Score</Label>
                        <Input
                          type="number"
                          value={criterion.minScore}
                          onChange={(e) => updateScoringCriterion(criterion.id, { minScore: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label>Max Score</Label>
                        <Input
                          type="number"
                          value={criterion.maxScore}
                          onChange={(e) => updateScoringCriterion(criterion.id, { maxScore: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label>Label *</Label>
                      <Input
                        value={criterion.label}
                        onChange={(e) => updateScoringCriterion(criterion.id, { label: e.target.value })}
                        placeholder="e.g., Low Risk, Medium Risk, High Risk"
                      />
                    </div>
                    
                    <div className="mt-4">
                      <Label>Description</Label>
                      <Textarea
                        value={criterion.description || ''}
                        onChange={(e) => updateScoringCriterion(criterion.id, { description: e.target.value })}
                        placeholder="Optional description"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/library/outcome-measures/${id}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </form>
    </PageLayout>
  );
};

export default OutcomeMeasureEditPage;
