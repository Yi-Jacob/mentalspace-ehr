
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { IntakeFormData } from '../IntakeAssessmentForm';

interface FinalizeSectionProps {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  clientData: any;
}

const FinalizeSection: React.FC<FinalizeSectionProps> = ({
  formData,
  updateFormData,
  clientData,
}) => {
  const [isReviewed, setIsReviewed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const requiredFields = [
    { field: 'primaryProblem', label: 'Primary Presenting Problem' },
    { field: 'symptomOnset', label: 'Symptom Onset' },
    { field: 'symptomSeverity', label: 'Symptom Severity' },
    { field: 'detailedDescription', label: 'Detailed Description' },
    { field: 'impactOnFunctioning', label: 'Impact on Functioning' },
  ];

  const isComplete = requiredFields.every(({ field }) => {
    const value = formData[field as keyof IntakeFormData];
    return value && value.toString().trim().length > 0;
  });

  const handleFinalize = () => {
    if (!isComplete) {
      toast({
        title: 'Incomplete Assessment',
        description: 'Please complete all required fields before finalizing.',
        variant: 'destructive',
      });
      return;
    }

    if (!isReviewed) {
      toast({
        title: 'Review Required',
        description: 'Please review the entire intake form before signing.',
        variant: 'destructive',
      });
      return;
    }

    const signature = `${user?.first_name || ''} ${user?.last_name || ''}`.trim();
    const signedAt = new Date().toISOString();

    updateFormData({
      isFinalized: true,
      signature,
      signedBy: user?.id || '',
      signedAt,
    });

    setShowConfirmation(true);
    
    toast({
      title: 'Assessment Finalized',
      description: 'The intake assessment has been successfully completed and signed.',
    });
  };

  if (showConfirmation) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <CardTitle className="text-green-800">Assessment Complete!</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-green-700">
                The intake assessment for <strong>{clientData?.first_name} {clientData?.last_name}</strong> has been 
                successfully completed and electronically signed.
              </p>
              
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Signature Details</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Signed by:</strong> {formData.signature}</p>
                  <p><strong>Date & Time:</strong> {new Date(formData.signedAt).toLocaleString()}</p>
                  <p><strong>IP Address:</strong> [System Generated]</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate PDF
                </Button>
                <Button className="flex-1">
                  View Completed Assessment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <span>Almost Done!</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            Please review the entire intake form before signing. Once finalized, changes can only be 
            made through an addendum.
          </p>
        </CardContent>
      </Card>

      {/* Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Completion Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requiredFields.map(({ field, label }) => {
              const value = formData[field as keyof IntakeFormData];
              const isCompleted = value && value.toString().trim().length > 0;
              
              return (
                <div key={field} className="flex items-center space-x-3">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                  )}
                  <span className={isCompleted ? 'text-green-700' : 'text-gray-500'}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          
          {!isComplete && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                Please complete all required fields marked above before finalizing the assessment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Electronic Signature */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Electronic Signature</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="review-confirmation"
                checked={isReviewed}
                onCheckedChange={setIsReviewed}
                disabled={!isComplete}
              />
              <Label htmlFor="review-confirmation" className="text-sm">
                I have reviewed the entire intake assessment and confirm its accuracy
              </Label>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Signature:</strong> By clicking "Finalize & Sign", I confirm that I, 
                <strong> {user?.first_name} {user?.last_name}</strong>, have completed this intake 
                assessment and that the information contained herein is accurate to the best of my knowledge.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                disabled={!isComplete}
              >
                Save as Draft
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleFinalize}
                disabled={!isComplete || !isReviewed}
              >
                Finalize & Sign
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalizeSection;
