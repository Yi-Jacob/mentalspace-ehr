
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { CheckCircle } from 'lucide-react';
import { ProgressNoteFormData } from '@/types/noteType';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import CompletionStatus from './finalize/CompletionStatus';
import ProgressNoteSummary from './finalize/ProgressNoteSummary';
import FinalizationForm from './finalize/FinalizationForm';
import FinalizedStatus from './finalize/FinalizedStatus';

interface FinalizeSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
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
        name: 'Session Information',
        isComplete: !!(formData.sessionDate && formData.startTime && formData.endTime && formData.serviceCode),
        fields: ['Session Date', 'Start Time', 'End Time', 'Service Code']
      },
      {
        name: 'Diagnosis',
        isComplete: !!(formData.primaryDiagnosis),
        fields: ['Primary Diagnosis']
      },
      {
        name: 'Mental Status',
        isComplete: !!(formData.mood && formData.affect),
        fields: ['Mood', 'Affect']
      },
      {
        name: 'Risk Assessment',
        isComplete: formData.noRiskPresent || (formData.riskAreas && formData.riskAreas.length > 0),
        fields: ['Risk Assessment (either no risk present or risk areas documented)']
      },
      {
        name: 'Content',
        isComplete: !!(formData.symptomDescription && formData.objectiveContent),
        fields: ['Symptom Description', 'Objective Content']
      },
      {
        name: 'Interventions',
        isComplete: !!(formData.selectedInterventions && formData.selectedInterventions.length > 0),
        fields: ['At least one intervention selected']
      },
      {
        name: 'Planning',
        isComplete: !!(formData.planContent && formData.recommendation),
        fields: ['Plan Content', 'Recommendation']
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
      signedBy: user?.id || '',
      signedAt: now,
      signature: `${formData.signature || 'Current User'} - ${new Date().toLocaleString()}`,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span>Finalize & Sign Progress Note</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProgressNoteSummary formData={formData} clientData={clientData} />
        
        <CompletionStatus sectionCompletionStatus={sectionCompletionStatus} />

        {!formData.isFinalized ? (
          <FinalizationForm
            formData={formData}
            updateFormData={updateFormData}
            allSectionsComplete={allSectionsComplete}
            onFinalize={handleFinalize}
            onSaveDraft={handleSaveDraft}
            isLoading={isLoading}
          />
        ) : (
          <FinalizedStatus formData={formData} />
        )}
      </CardContent>
    </Card>
  );
};

export default FinalizeSection;
