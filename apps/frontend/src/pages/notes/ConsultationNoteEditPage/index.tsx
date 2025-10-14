
import React from 'react';
import { useParams } from 'react-router-dom';
import { InputField } from '@/components/basic/input';
import { SelectField } from '@/components/basic/select';
import { TextareaField } from '@/components/basic/textarea';
import { DateInput } from '@/components/basic/date-input';
import { Card } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Label } from '@/components/basic/label';
import { Checkbox } from '@/components/basic/checkbox';
import { Alert, AlertDescription } from '@/components/basic/alert';
import { Plus, Trash2, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { useConsultationNoteData } from '../hooks/useConsultationNoteData';
import { useConsultationNoteForm } from '../hooks/useConsultationNoteForm';
import { useConsultationNoteSave } from '../hooks/useConsultationNoteSave';
import OneSectionNoteEditLayout from '@/pages/notes/components/layout/OneSectionNoteEditLayout';
import { ConsultationNoteFormData } from '@/types/noteType';
import { CONSULTATION_TYPES } from '@/types/enums/notesEnum';

const ConsultationNoteForm = () => {
  const { noteId } = useParams();
  
  const { data: noteData } = useConsultationNoteData(noteId);
  const { formData, updateFormData, validateForm, getValidationErrors } = useConsultationNoteForm(noteData);
  const { isLoading, handleSave } = useConsultationNoteSave(noteId);

  const handleSaveDraft = () => handleSave(formData, true, validateForm);
  const handleFinalize = () => handleSave(formData, false, validateForm);

  const handleAIFill = (generatedFormData: any) => {
    // Merge with existing form data, preserving clientId
    const mergedData = {
      ...generatedFormData,
      clientId: formData.clientId,
    };
    updateFormData(mergedData);
  };

  const addParticipant = () => {
    const newParticipant = {
      id: Date.now().toString(),
      name: '',
      role: '',
      organization: ''
    };
    updateFormData({
      participants: [...formData.participants, newParticipant]
    });
  };

  const updateParticipant = (id: string, field: string, value: string) => {
    const updatedParticipants = formData.participants.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    );
    updateFormData({ participants: updatedParticipants });
  };

  const removeParticipant = (id: string) => {
    updateFormData({
      participants: formData.participants.filter(p => p.id !== id)
    });
  };

  const addActionItem = () => {
    const newAction = {
      action: '',
      owner: '',
      dueDate: ''
    };
    updateFormData({
      actionItemOwners: [...formData.actionItemOwners, newAction]
    });
  };

  const updateActionItem = (index: number, field: string, value: string) => {
    const updatedActions = formData.actionItemOwners.map((action, i) =>
      i === index ? { ...action, [field]: value } : action
    );
    updateFormData({ actionItemOwners: updatedActions });
  };

  const removeActionItem = (index: number) => {
    updateFormData({
      actionItemOwners: formData.actionItemOwners.filter((_, i) => i !== index)
    });
  };

  return (
    <OneSectionNoteEditLayout
      icon={Users}
      title="Consultation Note"
      clientData={noteData?.client}
      onSaveDraft={handleSaveDraft}
      onFinalize={handleFinalize}
      validateForm={validateForm}
      getValidationErrors={getValidationErrors}
      isLoading={isLoading}
      isFinalized={formData.isFinalized}
      signature={formData.signature}
      onSignatureChange={(signature) => updateFormData({ signature })}
      signedBy={formData.signedBy}
      signedAt={formData.signedAt}
      showFinalizationSection={false}
      finalizeButtonColor="indigo"
      noteType="consultation_note"
      onAIFill={handleAIFill}
    >
      {/* Consultation Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Consultation Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DateInput
            id="consultationDate"
            label="Consultation Date"
            value={formData.consultationDate}
            onChange={(value) => updateFormData({ consultationDate: value })}
            required
          />
          <InputField
            id="consultationTime"
            label="Consultation Time"
            type="time"
            value={formData.consultationTime}
            onChange={(e) => updateFormData({ consultationTime: e.target.value })}
          />
          <InputField
            id="consultationDuration"
            label="Duration (minutes)"
            type="number"
            min="1"
            value={formData.consultationDuration.toString()}
            onChange={(e) => updateFormData({ consultationDuration: parseInt(e.target.value) || 0 })}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Consultation Type"
            value={formData.consultationType}
            onValueChange={(value) => updateFormData({ consultationType: value as 'case_review' | 'treatment_planning' | 'supervision' | 'peer_consultation' | 'multidisciplinary_team' })}
            options={CONSULTATION_TYPES}
            required
          />
        </div>

        <TextareaField
          id="consultationPurpose"
          label="Consultation Purpose"
          value={formData.consultationPurpose}
          onChange={(e) => updateFormData({ consultationPurpose: e.target.value })}
          placeholder="Describe the purpose and goals of this consultation..."
          rows={3}
          required
        />
      </div>

      {/* Participants Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
          <Button type="button" onClick={addParticipant} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Participant
          </Button>
        </div>
        
        {formData.participants.map((participant) => (
          <Card key={participant.id} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Name"
                value={participant.name}
                onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                placeholder="Participant name"
              />
              <InputField
                label="Role"
                value={participant.role}
                onChange={(e) => updateParticipant(participant.id, 'role', e.target.value)}
                placeholder="Professional role"
              />
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <InputField
                    label="Organization"
                    value={participant.organization}
                    onChange={(e) => updateParticipant(participant.id, 'organization', e.target.value)}
                    placeholder="Organization/Agency"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeParticipant(participant.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Clinical Discussion Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Clinical Discussion</h3>
        
        <TextareaField
          id="presentingConcerns"
          label="Presenting Concerns"
          value={formData.presentingConcerns}
          onChange={(e) => updateFormData({ presentingConcerns: e.target.value })}
          placeholder="Describe the presenting concerns discussed in consultation..."
          rows={3}
          required
        />

        <TextareaField
          id="backgroundInformation"
          label="Background Information"
          value={formData.backgroundInformation}
          onChange={(e) => updateFormData({ backgroundInformation: e.target.value })}
          placeholder="Relevant background information shared..."
          rows={3}
        />

        <TextareaField
          id="currentTreatment"
          label="Current Treatment"
          value={formData.currentTreatment}
          onChange={(e) => updateFormData({ currentTreatment: e.target.value })}
          placeholder="Current treatment interventions and approaches..."
          rows={3}
        />
      </div>

      {/* Recommendations Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Recommendations & Actions</h3>
        
        <TextareaField
          id="treatmentModifications"
          label="Treatment Modifications"
          value={formData.treatmentModifications}
          onChange={(e) => updateFormData({ treatmentModifications: e.target.value })}
          placeholder="Any recommended changes to treatment approach..."
          rows={3}
        />
      </div>

      {/* Action Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Action Items</h3>
          <Button type="button" onClick={addActionItem} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Action Item
          </Button>
        </div>
        
        {formData.actionItemOwners.map((action, index) => (
          <Card key={index} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Action"
                value={action.action}
                onChange={(e) => updateActionItem(index, 'action', e.target.value)}
                placeholder="Action to be taken"
              />
              <InputField
                label="Owner"
                value={action.owner}
                onChange={(e) => updateActionItem(index, 'owner', e.target.value)}
                placeholder="Responsible person"
              />
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <DateInput
                    label="Due Date"
                    value={action.dueDate}
                    onChange={(value) => updateActionItem(index, 'dueDate', value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeActionItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Compliance Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Agreements & Compliance</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="confidentialityAgreement"
              checked={formData.confidentialityAgreement}
              onCheckedChange={(checked) => updateFormData({ confidentialityAgreement: !!checked })}
            />
            <Label htmlFor="confidentialityAgreement" className="text-sm">
              Confidentiality agreement reviewed and confirmed with all participants *
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="consentObtained"
              checked={formData.consentObtained}
              onCheckedChange={(checked) => updateFormData({ consentObtained: !!checked })}
            />
            <Label htmlFor="consentObtained" className="text-sm">
              Appropriate consent obtained for information sharing *
            </Label>
          </div>
        </div>
      </div>

      {/* Finalization Section */}
      {formData.isFinalized ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Note Finalized</p>
              <p className="text-sm text-green-800">
                Signed by: {formData.signedBy} on {formData.signedAt && new Date(formData.signedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900">Finalize Note</h3>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              By signing this note, you certify that the information is accurate and complete.
            </AlertDescription>
          </Alert>

          <InputField
            id="signature"
            label="Electronic Signature"
            value={formData.signature}
            onChange={(e) => updateFormData({ signature: e.target.value })}
            placeholder="Type your full name to sign"
          />
        </div>
      )}
    </OneSectionNoteEditLayout>
  );
};

export default ConsultationNoteForm;
