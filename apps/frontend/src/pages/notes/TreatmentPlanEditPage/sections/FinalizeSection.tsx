
import React from 'react';
import { Button } from '@/components/basic/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Checkbox } from '@/components/basic/checkbox';
import { Label } from '@/components/basic/label';
import { InputField } from '@/components/basic/input';
import { Alert, AlertDescription } from '@/components/basic/alert';
import { AlertTriangle, CheckCircle, XCircle, FileText } from 'lucide-react';
import { TreatmentPlanFormData } from '@/types/noteType';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FinalizeSectionProps {
  formData: TreatmentPlanFormData;
  updateFormData: (updates: Partial<TreatmentPlanFormData>) => void;
  onSave?: (isDraft: boolean) => Promise<void>;
  isLoading?: boolean;
  clientData?: any;
}

const FinalizeSection: React.FC<FinalizeSectionProps> = ({
  formData,
  updateFormData,
  onSave,
  isLoading = false,
  clientData,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  // Check if all required sections are complete
  const checkSectionCompletion = () => {
    const requiredSections = [
      {
        name: 'Client Overview',
        isComplete: !!(formData.clientId),
        fields: ['Client ID', 'Treatment Plan Date']
      },
      {
        name: 'Diagnosis',
        isComplete: !!(formData.primaryDiagnosis),
        fields: ['Primary Diagnosis']
      },
      {
        name: 'Presenting Problem',
        isComplete: !!(formData.presentingProblem),
        fields: ['Presenting Problem']
      },
      {
        name: 'Treatment Goals',
        isComplete: formData.treatmentGoals && formData.treatmentGoals.length > 0 && 
                   formData.treatmentGoals.every(goal => 
                     goal.goalText && goal.objectives && goal.objectives.length > 0 &&
                     goal.objectives.every(obj => obj.objectiveText)
                   ),
        fields: ['At least one goal with objectives']
      },
      {
        name: 'Discharge Planning',
        isComplete: !!(formData.dischargeCriteria),
        fields: ['Discharge Criteria']
      },
      {
        name: 'Frequency',
        isComplete: !!(formData.prescribedFrequency && formData.medicalNecessityDeclaration),
        fields: ['Prescribed Frequency', 'Medical Necessity Declaration']
      }
    ];

    return requiredSections;
  };

  const sectionCompletionStatus = checkSectionCompletion();
  const allSectionsComplete = sectionCompletionStatus.every(section => section.isComplete);
  const incompleteSections = sectionCompletionStatus.filter(section => !section.isComplete);

  const handleFinalize = async () => {
    const missingFields = [];
    
    // Check for incomplete sections
    if (!allSectionsComplete) {
      const incompleteSectionNames = incompleteSections.map(section => section.title).join(', ');
      missingFields.push(`Incomplete sections: ${incompleteSectionNames}`);
    }

    // Check for signature
    if (!formData.signature) {
      missingFields.push('Electronic signature is required');
    }

    // If there are missing fields, show detailed error
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Information",
        description: `Please complete the following before finalizing:\n• ${missingFields.join('\n• ')}`,
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();
    updateFormData({
      isFinalized: true,
      signedBy: user?.id || '',
      signedAt: now,
    });

    if (onSave) {
      await onSave(false);
    }
  };

  const handleSaveDraft = async () => {
    if (onSave) {
      await onSave(true);
    }
  };

  const clientName = clientData 
    ? `${clientData.firstName} ${clientData.lastName}`
    : 'Unknown Client';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>Finalize & Sign Treatment Plan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Treatment Plan Summary</h3>
          <div className="space-y-1 text-sm text-blue-800">
            <p><strong>Client:</strong> {clientName}</p>
            <p><strong>Plan Date:</strong> {formData.treatmentPlanDate}</p>
            <p><strong>Primary Diagnosis:</strong> {formData.primaryDiagnosis}</p>
            <p><strong>Goals:</strong> {formData.treatmentGoals?.length || 0} treatment goals</p>
          </div>
        </div>
{formData.treatmentPlanDate}
        {/* Section Completion Status */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Section Completion Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectionCompletionStatus.map((section, index) => (
              <div key={index} className="flex items-center space-x-2">
                {section.isComplete ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${section.isComplete ? 'text-green-800' : 'text-red-800'}`}>
                    {section.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {section.isComplete ? 'Complete' : `Missing: ${section.fields.join(', ')}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Finalization Section */}
        {!formData.isFinalized && (
          <>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                By signing this treatment plan, you certify that the information is accurate and complete,
                and that the services outlined are medically necessary for the client's treatment.
              </AlertDescription>
            </Alert>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium">Before finalizing:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside">
                    <li>Review all sections for completeness and accuracy</li>
                    <li>Ensure all required fields are completed</li>
                    <li>Verify treatment goals and objectives are specific and measurable</li>
                    <li>Confirm discharge criteria and frequency recommendations</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="reviewComplete"
                  checked={!!formData.signature}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      updateFormData({ signature: '' });
                    }
                  }}
                  disabled={!allSectionsComplete}
                />
                <Label htmlFor="reviewComplete" className={`text-sm ${!allSectionsComplete ? 'text-gray-400' : ''}`}>
                  I have reviewed this treatment plan for completeness and accuracy
                </Label>
              </div>

              <InputField
                id="signature"
                label="Electronic Signature"
                value={formData.signature || ''}
                onChange={(e) => updateFormData({ signature: e.target.value })}
                placeholder="Type your full name to sign"
                disabled={!allSectionsComplete}
                className={!allSectionsComplete ? 'bg-gray-100' : ''}
              />
              <p className={`text-xs ${!allSectionsComplete ? 'text-gray-400' : 'text-gray-600'}`}>
                By typing your name, you are providing your electronic signature
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleSaveDraft}
                variant="outline"
                disabled={isLoading}
              >
                Save as Draft
              </Button>
              <Button
                onClick={handleFinalize}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Finalizing...' : 'Finalize & Sign Treatment Plan'}
              </Button>
            </div>
          </>
        )}

        {formData.isFinalized && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Treatment Plan Finalized</p>
                <p className="text-sm text-green-800">
                  Signed by: {formData.signedBy} on {new Date(formData.signedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinalizeSection;
