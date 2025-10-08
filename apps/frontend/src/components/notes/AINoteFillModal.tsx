import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Textarea } from '@/components/basic/textarea';
import { Label } from '@/components/basic/label';
import { Alert, AlertDescription } from '@/components/basic/alert';
import { AlertTriangle, Bot, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AINoteFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteType: string;
  clientName: string;
  onFormFill: (formData: any) => void;
}

const AINoteFillModal: React.FC<AINoteFillModalProps> = ({
  isOpen,
  onClose,
  noteType,
  clientName,
  onFormFill
}) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatNoteType = (type: string) => {
    return type?.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleSubmit = async () => {
    if (!summary.trim()) {
      toast({
        title: 'Summary required',
        description: 'Please provide a summary of the note content.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Import the AI service dynamically to avoid circular dependencies
      const { AIChatbotService } = await import('@/services/ai-chatbot/aiChatbotService');
      
      // Use the specialized form generation endpoint
      const response = await AIChatbotService.generateFormData(summary, noteType, clientName);
      
      // Call the parent component's form fill handler
      onFormFill(response.formData);
      
      toast({
        title: 'Form filled successfully',
        description: `AI has generated the ${formatNoteType(noteType)} form based on your summary.`,
      });
      
      onClose();
      setSummary('');
    } catch (error) {
      console.error('Error generating form data:', error);
      toast({
        title: 'Error generating form',
        description: error instanceof Error ? error.message : 'Failed to generate form data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setSummary('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-blue-600" />
            <span>AI Form Assistant</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This will overwrite all current form data. Please provide a detailed summary of the {formatNoteType(noteType)} content for client {clientName}.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="summary">
              Note Summary *
            </Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={`Provide a detailed summary of the ${formatNoteType(noteType)} for ${clientName}. Include relevant details about the session, observations, interventions, and any other important information that should be included in the form.`}
              rows={8}
              className="resize-none"
              disabled={isLoading}
            />
            <p className="text-sm text-gray-600">
              The more detailed your summary, the better the AI can generate comprehensive form data.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !summary.trim()}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Form...
              </>
            ) : (
              <>
                <Bot className="h-4 w-4 mr-2" />
                Generate Form
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AINoteFillModal;
