
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';
import { InputField } from '@/components/basic/input';
import { SelectField } from '@/components/basic/select';
import { TextareaField } from '@/components/basic/textarea';
import { DateInput } from '@/components/basic/date-input';
import { Checkbox } from '@/components/basic/checkbox';
import { Label } from '@/components/basic/label';
import { Calendar, DollarSign, Clock } from 'lucide-react';
import { CancellationNoteFormData } from '@/types/noteType';
import { 
  CANCELLATION_INITIATORS, 
  NOTIFICATION_METHODS, 
  BILLING_STATUS_OPTIONS 
} from '@/types/enums/notesEnum';
import { useToast } from '@/hooks/use-toast';
import OneSectionNoteEditLayout from '@/pages/notes/components/layout/OneSectionNoteEditLayout';

const CancellationNoteForm = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CancellationNoteFormData>({
    clientId: '',
    noteDate: new Date().toISOString().split('T')[0],
    sessionDate: '',
    sessionTime: '',
    cancellationReason: '',
    cancellationInitiator: 'client',
    notificationMethod: 'phone',
    advanceNoticeHours: 0,
    billingStatus: 'not_billed',
    chargeAmount: 0,
    policyViolation: false,
    policyDetails: '',
    willReschedule: false,
    rescheduleDate: '',
    rescheduleTime: '',
    rescheduleNotes: '',
    followUpRequired: false,
    followUpActions: [],
    providerNotes: '',
    signature: '',
    isFinalized: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch note data if editing
  const { data: noteData } = useQuery({
    queryKey: ['clinical-note', noteId],
    queryFn: async () => {
      return noteService.getNote(noteId!);
    },
    enabled: !!noteId,
  });

  // Load form data when note is fetched
  useEffect(() => {
    if (noteData?.content) {
      const contentData = noteData.content as Record<string, any>;
      setFormData(prev => ({
        ...prev,
        ...contentData,
        clientId: noteData.clientId
      }));
    }
  }, [noteData]);

  const updateFormData = (updates: Partial<CancellationNoteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateForm = () => {
    const required = [
      'clientId', 'sessionDate', 'sessionTime', 'cancellationReason',
      'cancellationInitiator', 'notificationMethod'
    ];
    
    return required.every(field => formData[field as keyof CancellationNoteFormData]);
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        content: formData as any,
        status: 'draft' as 'draft',
      };

      if (noteId) {
        await noteService.updateNote(noteId, updateData);
      } else {
        await noteService.createNote({
          title: `Cancellation Note - ${formData.sessionDate}`,
          content: formData as any,
          clientId: formData.clientId,
          noteType: 'cancellation_note',
          status: 'draft' as 'draft',
        });
      }

      toast({
        title: 'Success',
        description: 'Cancellation note saved as draft successfully.',
      });
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: 'Error',
        description: 'Failed to save note. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.signature) {
      toast({
        title: 'Signature Required',
        description: 'Please provide your signature to finalize the note.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const updateData = {
        content: formData as any,
        status: 'signed' as 'signed',
      };

      if (noteId) {
        await noteService.updateNote(noteId, updateData);
      } else {
        await noteService.createNote({
          title: `Cancellation Note - ${formData.sessionDate}`,
          content: formData as any,
          clientId: formData.clientId,
          noteType: 'cancellation_note',
          status: 'signed' as 'signed',
        });
      }

      toast({
        title: 'Success',
        description: 'Cancellation note finalized successfully.',
      });

      navigate('/notes');
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: 'Error',
        description: 'Failed to save note. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OneSectionNoteEditLayout
      icon={Calendar}
      title="Cancellation Note"
      clientData={noteData?.client}
      onSaveDraft={handleSaveDraft}
      onFinalize={handleFinalize}
      validateForm={validateForm}
      isLoading={isLoading}
      isFinalized={formData.isFinalized}
      signature={formData.signature}
      onSignatureChange={(signature) => updateFormData({ signature })}
      signedBy={formData.signedBy}
      signedAt={formData.signedAt}
      finalizeButtonColor="orange"
    >
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Session Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DateInput
            id="sessionDate"
            label="Scheduled Session Date"
            value={formData.sessionDate}
            onChange={(value) => updateFormData({ sessionDate: value })}
            required
          />
          <InputField
            id="sessionTime"
            label="Scheduled Session Time"
            type="time"
            value={formData.sessionTime}
            onChange={(e) => updateFormData({ sessionTime: e.target.value })}
            required
          />
          <DateInput
            id="noteDate"
            label="Note Date"
            value={formData.noteDate}
            onChange={(value) => updateFormData({ noteDate: value })}
          />
        </div>
      </div>

      {/* Cancellation Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Cancellation Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Who Initiated Cancellation?"
            value={formData.cancellationInitiator}
            onValueChange={(value) => updateFormData({ cancellationInitiator: value as 'client' | 'provider' | 'emergency' | 'system' })}
            options={CANCELLATION_INITIATORS}
            required
          />
          <SelectField
            label="Notification Method"
            value={formData.notificationMethod}
            onValueChange={(value) => updateFormData({ notificationMethod: value as 'phone' | 'email' | 'text' | 'in_person' | 'no_show' })}
            options={NOTIFICATION_METHODS}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="advanceNoticeHours"
            label="Advance Notice (Hours)"
            type="number"
            min="0"
            value={formData.advanceNoticeHours.toString()}
            onChange={(e) => updateFormData({ advanceNoticeHours: parseInt(e.target.value) || 0 })}
          />
        </div>
        
        <TextareaField
          id="cancellationReason"
          label="Reason for Cancellation"
          value={formData.cancellationReason}
          onChange={(e) => updateFormData({ cancellationReason: e.target.value })}
          placeholder="Provide detailed reason for cancellation..."
          rows={3}
          required
        />
      </div>

      {/* Billing & Policy */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <span>Billing & Policy Information</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Billing Status"
            value={formData.billingStatus}
            onValueChange={(value) => updateFormData({ billingStatus: value as 'billed' | 'not_billed' | 'partial_charge' | 'pending_review' })}
            options={BILLING_STATUS_OPTIONS}
          />
          <InputField
            id="chargeAmount"
            label="Charge Amount ($)"
            type="number"
            min="0"
            step="0.01"
            value={formData.chargeAmount.toString()}
            onChange={(e) => updateFormData({ chargeAmount: parseFloat(e.target.value) || 0 })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="policyViolation"
            checked={formData.policyViolation}
            onCheckedChange={(checked) => updateFormData({ policyViolation: !!checked })}
          />
          <Label htmlFor="policyViolation" className="text-sm">
            This cancellation violates our cancellation policy
          </Label>
        </div>

        {formData.policyViolation && (
          <TextareaField
            id="policyDetails"
            label="Policy Violation Details"
            value={formData.policyDetails}
            onChange={(e) => updateFormData({ policyDetails: e.target.value })}
            placeholder="Describe the policy violation and any consequences..."
            rows={2}
          />
        )}
      </div>

      {/* Rescheduling */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span>Rescheduling Information</span>
        </h3>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="willReschedule"
            checked={formData.willReschedule}
            onCheckedChange={(checked) => updateFormData({ willReschedule: !!checked })}
          />
          <Label htmlFor="willReschedule" className="text-sm">
            Client wants to reschedule this session
          </Label>
        </div>

        {formData.willReschedule && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
            <DateInput
              id="rescheduleDate"
              label="New Session Date"
              value={formData.rescheduleDate}
              onChange={(value) => updateFormData({ rescheduleDate: value })}
            />
            <InputField
              id="rescheduleTime"
              label="New Session Time"
              type="time"
              value={formData.rescheduleTime}
              onChange={(e) => updateFormData({ rescheduleTime: e.target.value })}
            />
            <div className="md:col-span-2">
              <TextareaField
                id="rescheduleNotes"
                label="Rescheduling Notes"
                value={formData.rescheduleNotes}
                onChange={(e) => updateFormData({ rescheduleNotes: e.target.value })}
                placeholder="Additional notes about rescheduling..."
                rows={2}
              />
            </div>
          </div>
        )}
      </div>

      {/* Follow-up & Provider Notes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Follow-up & Provider Notes</h3>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="followUpRequired"
            checked={formData.followUpRequired}
            onCheckedChange={(checked) => updateFormData({ followUpRequired: !!checked })}
          />
          <Label htmlFor="followUpRequired" className="text-sm">
            Follow-up action required
          </Label>
        </div>

        <TextareaField
          id="providerNotes"
          label="Provider Notes"
          value={formData.providerNotes}
          onChange={(e) => updateFormData({ providerNotes: e.target.value })}
          placeholder="Additional clinical notes, observations, or administrative notes..."
          rows={4}
        />
      </div>
    </OneSectionNoteEditLayout>
  );
};

export default CancellationNoteForm;
