
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import ClientInfoDisplay from '@/components/documentation/shared/ClientInfoDisplay';
import ConsultationNoteHeader from './components/ConsultationNoteHeader';
import ConsultationInfoSection from './components/ConsultationInfoSection';
import { useConsultationNoteData } from './hooks/useConsultationNoteData';
import { useConsultationNoteForm } from './hooks/useConsultationNoteForm';
import { useConsultationNoteSave } from './hooks/useConsultationNoteSave';

const ConsultationNoteForm = () => {
  const { noteId } = useParams();
  
  const { data: noteData } = useConsultationNoteData(noteId);
  const { formData, updateFormData, validateForm } = useConsultationNoteForm(noteData);
  const { isLoading, handleSave } = useConsultationNoteSave(noteId);

  const clientName = noteData?.clients 
    ? `${noteData.clients.first_name} ${noteData.clients.last_name}`
    : 'Unknown Client';

  const canFinalize = validateForm() && !!formData.signature;

  const handleSaveDraft = () => handleSave(formData, true, validateForm);
  const handleFinalize = () => handleSave(formData, false, validateForm);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <ConsultationNoteHeader
          clientName={clientName}
          onSaveDraft={handleSaveDraft}
          onFinalize={handleFinalize}
          isLoading={isLoading}
          canFinalize={canFinalize}
        />

        <ClientInfoDisplay clientData={noteData?.clients} />

        <Card>
          <CardContent className="p-6 space-y-8">
            <ConsultationInfoSection 
              formData={formData} 
              updateFormData={updateFormData} 
            />

            {/* Participants */}
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
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={participant.name}
                        onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                        placeholder="Participant name"
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        value={participant.role}
                        onChange={(e) => updateParticipant(participant.id, 'role', e.target.value)}
                        placeholder="Professional role"
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <Label>Organization</Label>
                        <Input
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

            {/* Clinical Discussion */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Clinical Discussion</h3>
              
              <div>
                <Label htmlFor="presentingConcerns">Presenting Concerns *</Label>
                <Textarea
                  id="presentingConcerns"
                  value={formData.presentingConcerns}
                  onChange={(e) => updateFormData({ presentingConcerns: e.target.value })}
                  placeholder="Describe the presenting concerns discussed in consultation..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="backgroundInformation">Background Information</Label>
                <Textarea
                  id="backgroundInformation"
                  value={formData.backgroundInformation}
                  onChange={(e) => updateFormData({ backgroundInformation: e.target.value })}
                  placeholder="Relevant background information shared..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="currentTreatment">Current Treatment</Label>
                <Textarea
                  id="currentTreatment"
                  value={formData.currentTreatment}
                  onChange={(e) => updateFormData({ currentTreatment: e.target.value })}
                  placeholder="Current treatment interventions and approaches..."
                  rows={3}
                />
              </div>
            </div>

            {/* Recommendations & Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Recommendations & Actions</h3>
              
              <div>
                <Label htmlFor="treatmentModifications">Treatment Modifications</Label>
                <Textarea
                  id="treatmentModifications"
                  value={formData.treatmentModifications}
                  onChange={(e) => updateFormData({ treatmentModifications: e.target.value })}
                  placeholder="Any recommended changes to treatment approach..."
                  rows={3}
                />
              </div>
            </div>

            {/* Action Items */}
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
                    <div>
                      <Label>Action</Label>
                      <Input
                        value={action.action}
                        onChange={(e) => updateActionItem(index, 'action', e.target.value)}
                        placeholder="Action to be taken"
                      />
                    </div>
                    <div>
                      <Label>Owner</Label>
                      <Input
                        value={action.owner}
                        onChange={(e) => updateActionItem(index, 'owner', e.target.value)}
                        placeholder="Responsible person"
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <Label>Due Date</Label>
                        <Input
                          type="date"
                          value={action.dueDate}
                          onChange={(e) => updateActionItem(index, 'dueDate', e.target.value)}
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

            {/* Agreements & Compliance */}
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

            {/* Finalization */}
            {!formData.isFinalized && (
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
                    value={formData.signature}
                    onChange={(e) => updateFormData({ signature: e.target.value })}
                    placeholder="Type your full name to sign"
                  />
                </div>
              </div>
            )}

            {formData.isFinalized && (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsultationNoteForm;
