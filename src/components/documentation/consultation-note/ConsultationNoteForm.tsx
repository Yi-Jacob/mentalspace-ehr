
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { ConsultationNoteFormData } from './types/ConsultationNoteFormData';
import { useToast } from '@/hooks/use-toast';

const ConsultationNoteForm = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ConsultationNoteFormData>({
    clientId: '',
    noteDate: new Date().toISOString().split('T')[0],
    consultationDate: new Date().toISOString().split('T')[0],
    consultationTime: '',
    consultationType: 'case_review',
    consultationPurpose: '',
    consultationDuration: 0,
    participants: [],
    presentingConcerns: '',
    backgroundInformation: '',
    currentTreatment: '',
    discussionPoints: [],
    consultantRecommendations: [],
    agreedUponActions: [],
    treatmentModifications: '',
    additionalResources: [],
    followUpRequired: false,
    followUpPlan: '',
    nextConsultationDate: '',
    actionItemOwners: [],
    confidentialityAgreement: false,
    consentObtained: false,
    signature: '',
    isFinalized: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Fetch note data if editing
  const { data: noteData } = useQuery({
    queryKey: ['clinical-note', noteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinical_notes')
        .select(`
          *,
          clients (
            id,
            first_name,
            last_name
          )
        `)
        .eq('id', noteId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!noteId,
  });

  useEffect(() => {
    if (noteData?.content) {
      setFormData(prev => ({
        ...prev,
        ...noteData.content,
        clientId: noteData.client_id
      }));
    }
  }, [noteData]);

  const updateFormData = (updates: Partial<ConsultationNoteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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

  const validateForm = () => {
    const required = [
      'clientId', 'consultationDate', 'consultationType', 'consultationPurpose',
      'consultationDuration', 'presentingConcerns'
    ];
    
    return required.every(field => formData[field as keyof ConsultationNoteFormData]) &&
           formData.confidentialityAgreement && formData.consentObtained;
  };

  const handleSave = async (isDraft: boolean) => {
    if (!isDraft && !validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields and confirm agreements.',
        variant: 'destructive',
      });
      return;
    }

    if (!isDraft && !formData.signature) {
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
        content: formData,
        status: isDraft ? 'draft' : 'signed',
        ...(isDraft ? {} : {
          signed_at: new Date().toISOString(),
          signed_by: formData.signature
        })
      };

      const { error } = await supabase
        .from('clinical_notes')
        .update(updateData)
        .eq('id', noteId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Consultation note ${isDraft ? 'saved as draft' : 'finalized'} successfully.`,
      });

      if (!isDraft) {
        navigate('/documentation');
      }
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

  const clientName = noteData?.clients 
    ? `${noteData.clients.first_name} ${noteData.clients.last_name}`
    : 'Unknown Client';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <span>Consultation Note</span>
            </CardTitle>
            <p className="text-gray-600">Client: {clientName}</p>
          </CardHeader>
        </Card>

        {/* Form Content */}
        <Card>
          <CardContent className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Consultation Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="consultationDate">Consultation Date *</Label>
                  <Input
                    id="consultationDate"
                    type="date"
                    value={formData.consultationDate}
                    onChange={(e) => updateFormData({ consultationDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="consultationTime">Consultation Time</Label>
                  <Input
                    id="consultationTime"
                    type="time"
                    value={formData.consultationTime}
                    onChange={(e) => updateFormData({ consultationTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="consultationDuration">Duration (minutes) *</Label>
                  <Input
                    id="consultationDuration"
                    type="number"
                    min="1"
                    value={formData.consultationDuration}
                    onChange={(e) => updateFormData({ consultationDuration: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="consultationType">Consultation Type *</Label>
                  <Select value={formData.consultationType} onValueChange={(value: any) => updateFormData({ consultationType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="case_review">Case Review</SelectItem>
                      <SelectItem value="treatment_planning">Treatment Planning</SelectItem>
                      <SelectItem value="supervision">Clinical Supervision</SelectItem>
                      <SelectItem value="peer_consultation">Peer Consultation</SelectItem>
                      <SelectItem value="multidisciplinary_team">Multidisciplinary Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="consultationPurpose">Consultation Purpose *</Label>
                <Textarea
                  id="consultationPurpose"
                  value={formData.consultationPurpose}
                  onChange={(e) => updateFormData({ consultationPurpose: e.target.value })}
                  placeholder="Describe the purpose and goals of this consultation..."
                  rows={3}
                />
              </div>
            </div>

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

                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleSave(true)}
                    variant="outline"
                    disabled={isLoading}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    onClick={() => handleSave(false)}
                    disabled={!validateForm() || !formData.signature || isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isLoading ? 'Finalizing...' : 'Finalize & Sign Note'}
                  </Button>
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
