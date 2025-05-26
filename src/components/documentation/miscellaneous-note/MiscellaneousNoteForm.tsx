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
import { Stethoscope, Plus, Trash2, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { MiscellaneousNoteFormData } from './types/MiscellaneousNoteFormData';
import { useToast } from '@/hooks/use-toast';

const MiscellaneousNoteForm = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<MiscellaneousNoteFormData>({
    clientId: '',
    noteDate: new Date().toISOString().split('T')[0],
    eventDate: new Date().toISOString().split('T')[0],
    noteCategory: 'administrative',
    noteSubtype: '',
    urgencyLevel: 'low',
    noteTitle: '',
    noteDescription: '',
    detailedNotes: '',
    relatedPersons: [],
    documentsReferenced: [],
    actionsTaken: [],
    followUpRequired: false,
    followUpDetails: '',
    mandatoryReporting: false,
    reportingDetails: '',
    legalImplications: '',
    resolution: '',
    outcomeSummary: '',
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

  const updateFormData = (updates: Partial<MiscellaneousNoteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const addRelatedPerson = () => {
    const newPerson = {
      name: '',
      relationship: '',
      role: ''
    };
    updateFormData({
      relatedPersons: [...formData.relatedPersons, newPerson]
    });
  };

  const updateRelatedPerson = (index: number, field: string, value: string) => {
    const updatedPersons = formData.relatedPersons.map((person, i) =>
      i === index ? { ...person, [field]: value } : person
    );
    updateFormData({ relatedPersons: updatedPersons });
  };

  const removeRelatedPerson = (index: number) => {
    updateFormData({
      relatedPersons: formData.relatedPersons.filter((_, i) => i !== index)
    });
  };

  const validateForm = () => {
    const required = [
      'clientId', 'eventDate', 'noteCategory', 'noteTitle', 'noteDescription'
    ];
    
    return required.every(field => formData[field as keyof MiscellaneousNoteFormData]);
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
        description: `Miscellaneous note ${isDraft ? 'saved as draft' : 'finalized'} successfully.`,
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
              <Stethoscope className="h-5 w-5 text-gray-600" />
              <span>Miscellaneous Note</span>
            </CardTitle>
            <p className="text-gray-600">Client: {clientName}</p>
          </CardHeader>
        </Card>

        {/* Form Content */}
        <Card>
          <CardContent className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Note Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eventDate">Event/Activity Date *</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => updateFormData({ eventDate: e.target.value })}
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="noteCategory">Note Category *</Label>
                  <Select value={formData.noteCategory} onValueChange={(value: any) => updateFormData({ noteCategory: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrative">Administrative</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="coordination_of_care">Coordination of Care</SelectItem>
                      <SelectItem value="incident_report">Incident Report</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="noteSubtype">Note Subtype</Label>
                  <Input
                    id="noteSubtype"
                    value={formData.noteSubtype}
                    onChange={(e) => updateFormData({ noteSubtype: e.target.value })}
                    placeholder="Specific type or subtype"
                  />
                </div>
                <div>
                  <Label htmlFor="urgencyLevel">Urgency Level</Label>
                  <Select value={formData.urgencyLevel} onValueChange={(value: any) => updateFormData({ urgencyLevel: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="noteTitle">Note Title *</Label>
                <Input
                  id="noteTitle"
                  value={formData.noteTitle}
                  onChange={(e) => updateFormData({ noteTitle: e.target.value })}
                  placeholder="Brief descriptive title for this note"
                />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Note Content</span>
              </h3>
              
              <div>
                <Label htmlFor="noteDescription">Brief Description *</Label>
                <Textarea
                  id="noteDescription"
                  value={formData.noteDescription}
                  onChange={(e) => updateFormData({ noteDescription: e.target.value })}
                  placeholder="Provide a brief description of the event or activity..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="detailedNotes">Detailed Notes</Label>
                <Textarea
                  id="detailedNotes"
                  value={formData.detailedNotes}
                  onChange={(e) => updateFormData({ detailedNotes: e.target.value })}
                  placeholder="Provide detailed information, observations, or documentation..."
                  rows={5}
                />
              </div>
            </div>

            {/* Related Persons */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Related Persons</h3>
                <Button type="button" onClick={addRelatedPerson} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Person
                </Button>
              </div>
              
              {formData.relatedPersons.map((person, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={person.name}
                        onChange={(e) => updateRelatedPerson(index, 'name', e.target.value)}
                        placeholder="Person's name"
                      />
                    </div>
                    <div>
                      <Label>Relationship</Label>
                      <Input
                        value={person.relationship}
                        onChange={(e) => updateRelatedPerson(index, 'relationship', e.target.value)}
                        placeholder="Relationship to client"
                      />
                    </div>
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <Label>Role</Label>
                        <Input
                          value={person.role}
                          onChange={(e) => updateRelatedPerson(index, 'role', e.target.value)}
                          placeholder="Role in this matter"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeRelatedPerson(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Legal & Compliance */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span>Legal & Compliance</span>
              </h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mandatoryReporting"
                  checked={formData.mandatoryReporting}
                  onCheckedChange={(checked) => updateFormData({ mandatoryReporting: !!checked })}
                />
                <Label htmlFor="mandatoryReporting" className="text-sm">
                  This matter involves mandatory reporting requirements
                </Label>
              </div>

              {formData.mandatoryReporting && (
                <div>
                  <Label htmlFor="reportingDetails">Mandatory Reporting Details</Label>
                  <Textarea
                    id="reportingDetails"
                    value={formData.reportingDetails}
                    onChange={(e) => updateFormData({ reportingDetails: e.target.value })}
                    placeholder="Describe the reporting requirements and actions taken..."
                    rows={3}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="legalImplications">Legal Implications</Label>
                <Textarea
                  id="legalImplications"
                  value={formData.legalImplications}
                  onChange={(e) => updateFormData({ legalImplications: e.target.value })}
                  placeholder="Any legal implications or considerations..."
                  rows={2}
                />
              </div>
            </div>

            {/* Outcomes & Resolution */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Outcomes & Resolution</h3>
              
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
                  <Label htmlFor="followUpDetails">Follow-up Details</Label>
                  <Textarea
                    id="followUpDetails"
                    value={formData.followUpDetails}
                    onChange={(e) => updateFormData({ followUpDetails: e.target.value })}
                    placeholder="Describe the follow-up actions needed..."
                    rows={2}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="resolution">Resolution</Label>
                <Textarea
                  id="resolution"
                  value={formData.resolution}
                  onChange={(e) => updateFormData({ resolution: e.target.value })}
                  placeholder="How was this matter resolved or what was the outcome..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="outcomeSummary">Outcome Summary</Label>
                <Textarea
                  id="outcomeSummary"
                  value={formData.outcomeSummary}
                  onChange={(e) => updateFormData({ outcomeSummary: e.target.value })}
                  placeholder="Brief summary of the final outcome..."
                  rows={2}
                />
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
                    className="bg-gray-600 hover:bg-gray-700"
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

export default MiscellaneousNoteForm;
