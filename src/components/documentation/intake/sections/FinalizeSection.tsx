
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, FileSignature } from 'lucide-react';
import { IntakeFormData } from '../IntakeAssessmentForm';
import { useAuth } from '@/hooks/useAuth';

interface FinalizeSectionProps {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  clientData: any;
  onSave: (isDraft: boolean) => void;
  isLoading: boolean;
}

const FinalizeSection: React.FC<FinalizeSectionProps> = ({
  formData,
  updateFormData,
  clientData,
  onSave,
  isLoading,
}) => {
  const { user } = useAuth();
  const [reviewCompleted, setReviewCompleted] = useState(false);

  // Calculate completion percentage
  const calculateCompletion = () => {
    const fields = [
      formData.intakeDate,
      formData.primaryPresentingProblem,
      formData.detailedDescription,
      formData.medicalConditions,
      formData.relationshipStatus,
      formData.occupation,
      formData.livingSituation,
      formData.socialSupport,
      formData.currentStressors,
      formData.strengthsCoping,
    ];
    
    const completed = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((completed / fields.length) * 100);
  };

  const completion = calculateCompletion();
  const isReadyToSign = completion >= 80 && reviewCompleted;

  const handleReviewChange = (checked: boolean) => {
    setReviewCompleted(checked);
  };

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Assessment Completion Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-lg font-bold text-green-600">{completion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${completion}%` }}
              ></div>
            </div>
            {completion < 80 && (
              <div className="flex items-center space-x-2 text-amber-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Complete at least 80% of the assessment before finalizing</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Section */}
      <Card>
        <CardHeader>
          <CardTitle>Review & Finalize</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Almost Done!</h4>
            <p className="text-blue-700 text-sm">
              Please review the entire intake form before signing. Once finalized, changes can only be made through an addendum.
            </p>
          </div>

          {/* Review Checklist */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="review-completed"
                checked={reviewCompleted}
                onCheckedChange={handleReviewChange}
              />
              <label htmlFor="review-completed" className="text-sm font-medium">
                I have reviewed all sections of this intake assessment and confirm the information is accurate
              </label>
            </div>
          </div>

          <Separator />

          {/* Signature Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileSignature className="h-5 w-5 text-gray-600" />
              <h4 className="font-medium">Electronic Signature</h4>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                By clicking "Save as Draft" or "Finalize & Sign", I confirm that I, <strong>
                {user?.email || 'Current User'}</strong>, have completed this intake assessment and that the information contained herein is accurate to the best of my knowledge.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onSave(true)}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button 
              onClick={() => onSave(false)}
              disabled={!isReadyToSign || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Finalizing...' : 'Finalize & Sign'}
            </Button>
          </div>
          
          {!isReadyToSign && (
            <p className="text-sm text-gray-600 text-center">
              Complete the review checklist and ensure 80% completion to finalize
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalizeSection;
