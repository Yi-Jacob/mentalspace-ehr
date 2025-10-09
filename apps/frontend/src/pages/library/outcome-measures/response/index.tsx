import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, BarChart3 } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { useToast } from '@/hooks/use-toast';
import { outcomeMeasureService } from '@/services/outcomeMeasureService';
import { OutcomeMeasure, OutcomeMeasureResponse, QuestionResponse } from '@/types/outcomeMeasureType';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';

const OutcomeMeasureResponsePage: React.FC = () => {
  const { outcomeMeasureResponseId } = useParams<{ outcomeMeasureResponseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<OutcomeMeasureResponse | null>(null);
  const [measure, setMeasure] = useState<OutcomeMeasure | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: string[] }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchResponse = async () => {
      if (!outcomeMeasureResponseId) return;
      
      try {
        setLoading(true);
        const responseData = await outcomeMeasureService.getOutcomeMeasureResponse(outcomeMeasureResponseId);
        setResponse(responseData);
        
        // If response exists and has responses, load the answers
        if (responseData.responses && responseData.responses.length > 0) {
          const loadedAnswers: { [questionId: string]: string[] } = {};
          responseData.responses.forEach((resp: QuestionResponse) => {
            loadedAnswers[resp.questionId] = resp.selectedOptions;
          });
          setAnswers(loadedAnswers);
          setIsCompleted(true);
        }
        
        // Fetch the outcome measure details
        const measureData = await outcomeMeasureService.getOutcomeMeasureById(responseData.clientFile.outcomeMeasure.id);
        setMeasure(measureData);
      } catch (error) {
        console.error('Error fetching outcome measure response:', error);
        toast({
          title: "Error",
          description: "Failed to load outcome measure",
          variant: "destructive",
        });
        navigate('/client-files');
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, [outcomeMeasureResponseId, navigate, toast]);

  const handleAnswerChange = (questionId: string, optionId: string, isMultiple: boolean) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      
      if (isMultiple) {
        // Multiple choice - toggle option
        const newAnswers = currentAnswers.includes(optionId)
          ? currentAnswers.filter(id => id !== optionId)
          : [...currentAnswers, optionId];
        return { ...prev, [questionId]: newAnswers };
      } else {
        // Single choice - replace option
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < (measure?.content.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!measure || !response) return;

    try {
      setSubmitting(true);
      
      // Calculate responses with scores
      const questionResponses: QuestionResponse[] = measure.content.questions.map(question => {
        const selectedOptions = answers[question.id] || [];
        let score = 0;
        
        if (question.type === 'scale') {
          // For scale questions, the selected value is the score
          score = selectedOptions.length > 0 ? parseInt(selectedOptions[0]) || 0 : 0;
        } else {
          // For choice questions, sum up the option scores
          const questionOptions = question.options.filter(opt => selectedOptions.includes(opt.id));
          score = questionOptions.reduce((sum, opt) => sum + opt.score, 0);
        }
        
        return {
          questionId: question.id,
          selectedOptions,
          score
        };
      });

      await outcomeMeasureService.submitOutcomeMeasureResponse(response.clientFile.id, questionResponses);
      
      toast({
        title: "Success",
        description: "Outcome measure completed successfully",
      });
      
      setIsCompleted(true);
    } catch (error) {
      console.error('Error submitting outcome measure response:', error);
      toast({
        title: "Error",
        description: "Failed to submit response",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotalScore = () => {
    if (!measure) return 0;
    
    return measure.content.questions.reduce((total, question) => {
      const selectedOptions = answers[question.id] || [];
      
      if (question.type === 'scale') {
        // For scale questions, the selected value is the score
        return total + (selectedOptions.length > 0 ? parseInt(selectedOptions[0]) || 0 : 0);
      } else {
        // For choice questions, sum up the option scores
        const questionOptions = question.options.filter(opt => selectedOptions.includes(opt.id));
        const questionScore = questionOptions.reduce((sum, opt) => sum + opt.score, 0);
        return total + questionScore;
      }
    }, 0);
  };

  const getCriteriaForScore = (score: number) => {
    if (!measure) return 'Unknown';
    
    for (const criterion of measure.content.scoringCriteria) {
      if (score >= criterion.minScore && score <= criterion.maxScore) {
        return criterion.label;
      }
    }
    return 'Unknown';
  };

  if (loading) {
    return <LoadingSpinner message="Loading outcome measure..." />;
  }

  if (!measure || !response) {
    return (
      <PageLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Outcome measure not found</p>
        </div>
      </PageLayout>
    );
  }

  const currentQuestion = measure.content.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === measure.content.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const totalScore = calculateTotalScore();
  const criteria = getCriteriaForScore(totalScore);

  return (
    <PageLayout>
      <PageHeader
        icon={BarChart3}
        title={measure.title}
        description={measure.description || 'Please complete this outcome measure'}
        action={
          <Button
            variant="outline"
            onClick={() => navigate('/client-files')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Files</span>
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Progress Indicator */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestionIndex + 1} of {measure.content.questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentQuestionIndex + 1) / measure.content.questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / measure.content.questions.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {isCompleted ? (
          /* Results View */
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Outcome Measure Completed</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {totalScore} Points
                </div>
                <div className="text-lg font-medium text-gray-900 mb-4">
                  {criteria}
                </div>
                <p className="text-gray-600">
                  Thank you for completing this outcome measure. Your responses have been recorded.
                </p>
              </div>
              
              {/* Scoring Criteria Reference */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Scoring Criteria</h3>
                <div className="grid gap-4">
                  {measure.content.scoringCriteria.map((criterion, index) => (
                    <div 
                      key={criterion.id} 
                      className={`p-4 rounded-lg border-2 ${
                        criteria === criterion.label ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{criterion.label}</h4>
                          {criterion.description && (
                            <p className="text-sm text-gray-600 mt-1">{criterion.description}</p>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          {criterion.minScore} - {criterion.maxScore} points
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Question View */
          <Card>
            <CardHeader>
              <CardTitle>
                {currentQuestion.question}
                {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
              </CardTitle>
              <p className="text-sm text-gray-600 capitalize">
                {currentQuestion.type.replace('_', ' ')} question
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion.type === 'scale' ? (
                /* Scale Question Component */
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-6">
                      Please select a value on the scale below:
                    </p>
                    
                    {/* Linear Scale */}
                    <div className="relative">
                      {/* Scale Line */}
                      <div className="w-full h-2 bg-gray-200 rounded-full mb-4"></div>
                      
                      {/* Scale Points */}
                      <div className="flex justify-between items-center">
                        {(() => {
                          const config = currentQuestion.scaleConfig || { minValue: 1, maxValue: 10, step: 1 };
                          const points = [];
                          for (let i = config.minValue; i <= config.maxValue; i += config.step) {
                            points.push(i);
                          }
                          return points.map((value) => (
                            <div key={value} className="flex flex-col items-center">
                              <label className="cursor-pointer">
                                <input
                                  type="radio"
                                  name={`question-${currentQuestion.id}`}
                                  value={value}
                                  checked={(answers[currentQuestion.id] || []).includes(value.toString())}
                                  onChange={() => handleAnswerChange(
                                    currentQuestion.id, 
                                    value.toString(), 
                                    false
                                  )}
                                  className="sr-only"
                                />
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                                  (answers[currentQuestion.id] || []).includes(value.toString())
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                                }`}>
                                  {value}
                                </div>
                              </label>
                            </div>
                          ));
                        })()}
                      </div>
                      
                      {/* Scale Labels */}
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>{currentQuestion.scaleConfig?.minLabel || 'Lowest'}</span>
                        <span>{currentQuestion.scaleConfig?.maxLabel || 'Highest'}</span>
                      </div>
                    </div>
                    
                    {/* Selected Value Display */}
                    {answers[currentQuestion.id] && answers[currentQuestion.id].length > 0 && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Selected:</strong> {answers[currentQuestion.id][0]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Multiple Choice / Single Choice Component */
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type={currentQuestion.type === 'multiple_choice' ? 'checkbox' : 'radio'}
                        name={`question-${currentQuestion.id}`}
                        value={option.id}
                        checked={(answers[currentQuestion.id] || []).includes(option.id)}
                        onChange={() => handleAnswerChange(
                          currentQuestion.id, 
                          option.id, 
                          currentQuestion.type === 'multiple_choice'
                        )}
                        className="rounded"
                      />
                      <span className="flex-1 text-gray-900">{option.text}</span>
                      <span className="text-sm text-gray-500">({option.score} points)</span>
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        {!isCompleted && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <div className="flex space-x-2">
              {isLastQuestion ? (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !answers[currentQuestion.id]?.length}
                  className="flex items-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>{submitting ? 'Submitting...' : 'Finish'}</span>
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]?.length}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default OutcomeMeasureResponsePage;
