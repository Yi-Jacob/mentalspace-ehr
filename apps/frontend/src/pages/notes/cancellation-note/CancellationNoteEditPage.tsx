
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Checkbox } from '@/components/basic/checkbox';
import { Calendar, DollarSign, Clock } from 'lucide-react';
import { CancellationNoteFormData } from '@/types/noteType';
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
          <div>
            <Label htmlFor="sessionDate">Scheduled Session Date *</Label>
            <Input
              id="sessionDate"
              type="date"
              value={formData.sessionDate}
              onChange={(e) => updateFormData({ sessionDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="sessionTime">Scheduled Session Time *</Label>
            <Input
              id="sessionTime"
              type="time"
              value={formData.sessionTime}
              onChange={(e) => updateFormData({ sessionTime: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="noteDate">Note Date</Label>
            <Input
              id="noteDate"
              type="date"
              value={formData.noteDate}
              onChange={(e) => updateFormData({ noteDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Cancellation Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Cancellation Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cancellationInitiator">Who Initiated Cancellation? *</Label>
            <Select value={formData.cancellationInitiator} onValueChange={(value: any) => updateFormData({ cancellationInitiator: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="provider">Provider</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="system">System/Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notificationMethod">Notification Method *</Label>
            <Select value={formData.notificationMethod} onValueChange={(value: any) => updateFormData({ notificationMethod: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="text">Text Message</SelectItem>
                <SelectItem value="in_person">In Person</SelectItem>
                <SelectItem value="no_show">No Show (No Notice)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="advanceNoticeHours">Advance Notice (Hours)</Label>
            <Input
              id="advanceNoticeHours"
              type="number"
              min="0"
              value={formData.advanceNoticeHours}
              onChange={(e) => updateFormData({ advanceNoticeHours: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="cancellationReason">Reason for Cancellation *</Label>
          <Textarea
            id="cancellationReason"
            value={formData.cancellationReason}
            onChange={(e) => updateFormData({ cancellationReason: e.target.value })}
            placeholder="Provide detailed reason for cancellation..."
            rows={3}
          />
        </div>
      </div>

      {/* Billing & Policy */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <span>Billing & Policy Information</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="billingStatus">Billing Status</Label>
            <Select value={formData.billingStatus} onValueChange={(value: any) => updateFormData({ billingStatus: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_billed">Not Billed</SelectItem>
                <SelectItem value="billed">Full Charge Applied</SelectItem>
                <SelectItem value="partial_charge">Partial Charge Applied</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="chargeAmount">Charge Amount ($)</Label>
            <Input
              id="chargeAmount"
              type="number"
              min="0"
              step="0.01"
              value={formData.chargeAmount}
              onChange={(e) => updateFormData({ chargeAmount: parseFloat(e.target.value) || 0 })}
            />
          </div>
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
          <div>
            <Label htmlFor="policyDetails">Policy Violation Details</Label>
            <Textarea
              id="policyDetails"
              value={formData.policyDetails}
              onChange={(e) => updateFormData({ policyDetails: e.target.value })}
              placeholder="Describe the policy violation and any consequences..."
              rows={2}
            />
          </div>
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
            <div>
              <Label htmlFor="rescheduleDate">New Session Date</Label>
              <Input
                id="rescheduleDate"
                type="date"
                value={formData.rescheduleDate}
                onChange={(e) => updateFormData({ rescheduleDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="rescheduleTime">New Session Time</Label>
              <Input
                id="rescheduleTime"
                type="time"
                value={formData.rescheduleTime}
                onChange={(e) => updateFormData({ rescheduleTime: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="rescheduleNotes">Rescheduling Notes</Label>
              <Textarea
                id="rescheduleNotes"
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

        <div>
          <Label htmlFor="providerNotes">Provider Notes</Label>
          <Textarea
            id="providerNotes"
            value={formData.providerNotes}
            onChange={(e) => updateFormData({ providerNotes: e.target.value })}
            placeholder="Additional clinical notes, observations, or administrative notes..."
            rows={4}
          />
        </div>
      </div>
    </OneSectionNoteEditLayout>
  );
};

export default CancellationNoteForm;
