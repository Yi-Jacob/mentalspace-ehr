import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Alert, AlertDescription } from '@/components/basic/alert';
import { AlertTriangle, CheckCircle, ArrowLeft, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ClientInfoDisplay from '@/pages/notes/components/shared/ClientInfoDisplay';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import AINoteFillModal from '@/components/notes/AINoteFillModal';

interface OneSectionNoteEditLayoutProps {
  icon: LucideIcon;
  title: string;
  clientData?: any;
  children: React.ReactNode;
  onSaveDraft: () => Promise<void> | void;
  onFinalize: () => Promise<void> | void;
  validateForm: () => boolean;
  getValidationErrors?: () => string[];
  isLoading: boolean;
  isFinalized?: boolean;
  signature?: string;
  onSignatureChange?: (signature: string) => void;
  signedBy?: string;
  signedAt?: string;
  showBackButton?: boolean;
  showFinalizationSection?: boolean;
  customHeaderActions?: React.ReactNode;
  finalizeButtonColor?: 'orange' | 'indigo' | 'teal' | 'gray';
  backButtonText?: string;
  // AI Fill support
  noteType?: string;
  onAIFill?: (formData: any) => void;
}

const OneSectionNoteEditLayout: React.FC<OneSectionNoteEditLayoutProps> = ({
  icon: Icon,
  title,
  clientData,
  children,
  onSaveDraft,
  onFinalize,
  validateForm,
  getValidationErrors,
  isLoading,
  isFinalized = false,
  signature = '',
  onSignatureChange,
  signedBy,
  signedAt,
  showBackButton = true,
  showFinalizationSection = true,
  customHeaderActions,
  finalizeButtonColor = 'orange',
  backButtonText = 'Back to Notes',
  noteType,
  onAIFill,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const clientName = clientData 
    ? `${clientData.firstName} ${clientData.lastName}`
    : 'Unknown Client';

  const handleAIFill = (generatedFormData: any) => {
    if (onAIFill) {
      onAIFill(generatedFormData);
    }
  };

  const handleBackToNotes = () => {
    navigate('/notes');
  };

  const handleFinalizeWithValidation = () => {
    const missingFields = [];
    
    // Check form validation
    if (!validateForm()) {
      if (getValidationErrors) {
        missingFields.push(...getValidationErrors());
      } else {
        missingFields.push('Please complete all required fields');
      }
    }

    // Check signature if finalization section is shown
    if (showFinalizationSection && !signature) {
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

    // If validation passes, proceed with finalization
    onFinalize();
  };

  const getFinalizeButtonClass = () => {
    switch (finalizeButtonColor) {
      case 'indigo':
        return 'bg-indigo-600 hover:bg-indigo-700';
      case 'teal':
        return 'bg-teal-600 hover:bg-teal-700';
      case 'gray':
        return 'bg-gray-600 hover:bg-gray-700';
      case 'orange':
      default:
        return 'bg-orange-600 hover:bg-orange-700';
    }
  };

  const defaultHeaderActions = (
    <div className="flex items-center justify-between w-full">
      <div className="flex space-x-2">
        {showBackButton && (
          <Button
            variant="outline"
            onClick={handleBackToNotes}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {backButtonText}
          </Button>
        )}

        {noteType && onAIFill && (
          <Button
            variant="outline"
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center space-x-2 hover:bg-purple-50 transition-colors border-purple-300 hover:border-purple-400 text-purple-700"
          >
            <Bot className="h-4 w-4" />
            <span>AI Fill</span>
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={onSaveDraft}
          disabled={isLoading}
        >
          Save as Draft
        </Button>
        <Button
          onClick={handleFinalizeWithValidation}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          {isLoading ? 'Finalizing...' : 'Finalize & Sign Note'}
        </Button>
      </div>
    </div>
  );

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Icon}
        title={title}
        description={`Client: ${clientName}`}
        action={customHeaderActions || defaultHeaderActions}
      />

      <ClientInfoDisplay clientData={clientData} />

      {/* Form Content */}
      <Card>
        <CardContent className="p-6 space-y-8">
          {children}

          {/* Finalization Section */}
          {showFinalizationSection && !isFinalized && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900">Finalize Note</h3>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  By signing this note, you certify that the information is accurate and complete.
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="signature">Electronic Signature</Label>
                <Input
                  id="signature"
                  value={signature}
                  onChange={(e) => onSignatureChange?.(e.target.value)}
                  placeholder="Type your full name to sign"
                />
              </div>
            </div>
          )}

          {showFinalizationSection && isFinalized && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Note Finalized</p>
                  <p className="text-sm text-green-800">
                    Signed by: {signedBy} on {signedAt && new Date(signedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <div className="flex space-x-2"/>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={onSaveDraft}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button
                  onClick={handleFinalizeWithValidation}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  {isLoading ? 'Finalizing...' : 'Finalize & Sign Note'}
                </Button>
              </div>
            </div>
        </CardContent>
      </Card>
      
      {noteType && onAIFill && (
        <AINoteFillModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          noteType={noteType}
          clientName={clientName}
          onFormFill={handleAIFill}
        />
      )}
    </PageLayout>
  );
};

export default OneSectionNoteEditLayout;
