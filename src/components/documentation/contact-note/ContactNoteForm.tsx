
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
import { Phone, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { ContactNoteFormData } from './types/ContactNoteFormData';
import { useToast } from '@/hooks/use-toast';

const ContactNoteForm = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ContactNoteFormData>({
    clientId: '',
    noteDate: new Date().toISOString().split('T')[0],
    contactDate: new Date().toISOString().split('T')[0],
    contactTime: '',
    contactType: 'phone',
    contactInitiator: 'client',
    contactDuration: 0,
    contactPurpose: [],
    contactSummary: '',
    clientMoodStatus: '',
    riskFactorsDiscussed: false,
    riskDetails: '',
    interventionsProvided: [],
    resourcesProvided: [],
    followUpRequired: false,
    followUpPlan: '',
    nextAppointmentScheduled: false,
    nextAppointmentDate: '',
    clinicalObservations: '',
    providerRecommendations: '',
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
      const contentData = noteData.content as Record<string, any>;
      setFormData(prev => ({
        ...prev,
        ...contentData,
        clientId: noteData.client_id
      }));
    }
  }, [noteData]);

  const updateFormData = (updates: Partial<ContactNoteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateForm = () => {
    const required = [
      'clientId', 'contactDate', 'contactType', 'contactInitiator', 
      'contactDuration', 'contactSummary'
    ];
    
    return required.every(field => formData[field as keyof ContactNoteFormData]);
  };

  const handleSave = async (isDraft: boolean) => {
    if (!isDraft && !validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
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
        content: formData as any,
        status: (isDraft ? 'draft' : 'signed') as 'draft' | 'signed',
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
        description: `Contact note ${isDraft ? 'saved as draft' : 'finalized'} successfully.`,
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
              <Phone className="h-5 w-5 text-teal-600" />
              <span>Contact Note</span>
            </CardTitle>
            <p className="text-gray-600">Client: {clientName}</p>
          </CardHeader>
        </Card>

        {/* Form Content */}
        <Card>
          <CardContent className="p-6 space-y-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="contactDate">Contact Date *</Label>
                  <Input
                    id="contactDate"
                    type="date"
                    value={formData.contactDate}
                    onChange={(e) => updateFormData({ contactDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactTime">Contact Time</Label>
                  <Input
                    id="contactTime"
                    type="time"
                    value={formData.contactTime}
                    onChange={(e) => updateFormData({ contactTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactDuration">Duration (minutes) *</Label>
                  <Input
                    id="contactDuration"
                    type="number"
                    min="1"
                    value={formData.contactDuration}
                    onChange={(e) => updateFormData({ contactDuration: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactType">Contact Type *</Label>
                  <Select value={formData.contactType} onValueChange={(value: any) => updateFormData({ contactType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="text">Text Message</SelectItem>
                      <SelectItem value="video_call">Video Call</SelectItem>
                      <SelectItem value="in_person">In Person</SelectItem>
                      <SelectItem value="collateral">Collateral Contact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contactInitiator">Contact Initiated By *</Label>
                  <Select value={formData.contactInitiator} onValueChange={(value: any) => updateFormData({ contactInitiator: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="provider">Provider</SelectItem>
                      <SelectItem value="family">Family Member</SelectItem>
                      <SelectItem value="other_provider">Other Provider</SelectItem>
                      <SelectItem value="emergency">Emergency Contact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contact Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Summary</h3>
              
              <div>
                <Label htmlFor="contactSummary">Contact Summary *</Label>
                <Textarea
                  id="contactSummary"
                  value={formData.contactSummary}
                  onChange={(e) => updateFormData({ contactSummary: e.target.value })}
                  placeholder="Summarize the purpose and content of this contact..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="clientMoodStatus">Client Mood/Status</Label>
                <Input
                  id="clientMoodStatus"
                  value={formData.clientMoodStatus}
                  onChange={(e) => updateFormData({ clientMoodStatus: e.target.value })}
                  placeholder="Describe client's mood, affect, or status during contact"
                />
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span>Risk Assessment</span>
              </h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="riskFactorsDiscussed"
                  checked={formData.riskFactorsDiscussed}
                  onCheckedChange={(checked) => updateFormData({ riskFactorsDiscussed: !!checked })}
                />
                <Label htmlFor="riskFactorsDiscussed" className="text-sm">
                  Risk factors were discussed or identified
                </Label>
              </div>

              {formData.riskFactorsDiscussed && (
                <div>
                  <Label htmlFor="riskDetails">Risk Details</Label>
                  <Textarea
                    id="riskDetails"
                    value={formData.riskDetails}
                    onChange={(e) => updateFormData({ riskDetails: e.target.value })}
                    placeholder="Describe any risk factors, safety concerns, or interventions provided..."
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Clinical Observations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Clinical Observations & Recommendations</h3>
              
              <div>
                <Label htmlFor="clinicalObservations">Clinical Observations</Label>
                <Textarea
                  id="clinicalObservations"
                  value={formData.clinicalObservations}
                  onChange={(e) => updateFormData({ clinicalObservations: e.target.value })}
                  placeholder="Document any clinical observations, symptoms, or behavioral changes..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="providerRecommendations">Provider Recommendations</Label>
                <Textarea
                  id="providerRecommendations"
                  value={formData.providerRecommendations}
                  onChange={(e) => updateFormData({ providerRecommendations: e.target.value })}
                  placeholder="Any recommendations, suggestions, or guidance provided..."
                  rows={3}
                />
              </div>
            </div>

            {/* Follow-up */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Follow-up Planning</span>
              </h3>
              
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

              {formData.followUpRequired && (
                <div>
                  <Label htmlFor="followUpPlan">Follow-up Plan</Label>
                  <Textarea
                    id="followUpPlan"
                    value={formData.followUpPlan}
                    onChange={(e) => updateFormData({ followUpPlan: e.target.value })}
                    placeholder="Describe the follow-up actions needed..."
                    rows={2}
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="nextAppointmentScheduled"
                  checked={formData.nextAppointmentScheduled}
                  onCheckedChange={(checked) => updateFormData({ nextAppointmentScheduled: !!checked })}
                />
                <Label htmlFor="nextAppointmentScheduled" className="text-sm">
                  Next appointment scheduled
                </Label>
              </div>

              {formData.nextAppointmentScheduled && (
                <div>
                  <Label htmlFor="nextAppointmentDate">Next Appointment Date</Label>
                  <Input
                    id="nextAppointmentDate"
                    type="date"
                    value={formData.nextAppointmentDate}
                    onChange={(e) => updateFormData({ nextAppointmentDate: e.target.value })}
                  />
                </div>
              )}
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
                    className="bg-teal-600 hover:bg-teal-700"
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

export default ContactNoteForm;
