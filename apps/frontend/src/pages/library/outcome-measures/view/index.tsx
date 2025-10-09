import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, BarChart3, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { useToast } from '@/hooks/use-toast';
import { outcomeMeasureService } from '@/services/outcomeMeasureService';
import { OutcomeMeasure } from '@/types/outcomeMeasureType';
import LoadingSpinner from '@/components/LoadingSpinner';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';

const OutcomeMeasureViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [measure, setMeasure] = useState<OutcomeMeasure | null>(null);

  useEffect(() => {
    const fetchMeasure = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const measureData = await outcomeMeasureService.getOutcomeMeasureById(id);
        setMeasure(measureData);
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

  const getAccessLevelBadge = (accessLevel: string) => {
    const variants = {
      admin: 'destructive' as const,
      clinician: 'secondary' as const,
      billing: 'outline' as const,
    };
    
    return (
      <Badge variant={variants[accessLevel as keyof typeof variants] || 'outline'}>
        {accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1)}
      </Badge>
    );
  };

  const getSharableBadge = (sharable: string) => {
    return (
      <Badge variant={sharable === 'sharable' ? 'default' : 'secondary'}>
        {sharable === 'sharable' ? 'Sharable' : 'Not Sharable'}
      </Badge>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading outcome measure..." />;
  }

  if (!measure) {
    return (
      <PageLayout>
        <div className="text-center py-8">
          <p className="text-gray-500">Outcome measure not found</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        icon={BarChart3}
        title={measure.title}
        description={measure.description || 'Outcome measure details'}
        action={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate('/library')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Library</span>
            </Button>
            <Button
              onClick={() => navigate(`/library/outcome-measures/${measure.id}/edit`)}
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Access Level</label>
                <div className="mt-1">
                  {getAccessLevelBadge(measure.accessLevel)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Sharable</label>
                <div className="mt-1">
                  {getSharableBadge(measure.sharable)}
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Created By</label>
              <p className="mt-1 text-sm text-gray-900">
                {measure.creator.firstName} {measure.creator.lastName}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Created Date</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(measure.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Questions ({measure.content.questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {measure.content.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Question {index + 1}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {question.type.replace('_', ' ')}
                      </span>
                      {question.required && (
                        <Badge variant="outline" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-900">{question.question}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Options:</label>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={option.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-900">{option.text}</span>
                          <Badge variant="outline" className="text-xs">
                            Score: {option.score}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scoring Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>Scoring Criteria ({measure.content.scoringCriteria.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {measure.content.scoringCriteria.map((criterion, index) => (
                <div key={criterion.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">{criterion.label}</h4>
                    <Badge variant="outline" className="text-xs">
                      {criterion.minScore} - {criterion.maxScore} points
                    </Badge>
                  </div>
                  {criterion.description && (
                    <p className="text-sm text-gray-600">{criterion.description}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default OutcomeMeasureViewPage;
