
import React from 'react';
import { useParams } from 'react-router-dom';
import { InputField } from '@/components/basic/input';
import { SelectField } from '@/components/basic/select';
import { TextareaField } from '@/components/basic/textarea';
import { DateInput } from '@/components/basic/date-input';
import { Label } from '@/components/basic/label';
import { Checkbox } from '@/components/basic/checkbox';
import { Button } from '@/components/basic/button';
import { Card } from '@/components/basic/card';
import { Alert, AlertDescription } from '@/components/basic/alert';
import { FileText, AlertTriangle, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { useMiscellaneousNoteData } from '../hooks/useMiscellaneousNoteData';
import { useMiscellaneousNoteForm } from '../hooks/useMiscellaneousNoteForm';
import { useMiscellaneousNoteSave } from '../hooks/useMiscellaneousNoteSave';
import OneSectionNoteEditLayout from '@/pages/notes/components/layout/OneSectionNoteEditLayout';
import { MiscellaneousNoteFormData } from '@/types/noteType';
import { NOTE_CATEGORIES, URGENCY_LEVELS } from '@/types/enums/notesEnum';

const MiscellaneousNoteForm = () => {
  const { noteId } = useParams();
  
  const { data: noteData } = useMiscellaneousNoteData(noteId);
  const { formData, updateFormData, validateForm } = useMiscellaneousNoteForm(noteData);
  const { isLoading, handleSave } = useMiscellaneousNoteSave(noteId);

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

  return (
    <OneSectionNoteEditLayout
      icon={FileText}
      title="Miscellaneous Note"
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
      showFinalizationSection={false}
      showBottomActionButtons={false}
      finalizeButtonColor="gray"
      noteType="miscellaneous_note"
      onAIFill={handleAIFill}
      backButtonText="Back to Notes"
    >
      {/* Basic Info Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Note Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateInput
            id="eventDate"
            label="Event/Activity Date"
            value={formData.eventDate}
            onChange={(value) => updateFormData({ eventDate: value })}
            required
          />
          <DateInput
            id="noteDate"
            label="Note Date"
            value={formData.noteDate}
            onChange={(value) => updateFormData({ noteDate: value })}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SelectField
            label="Note Category"
            value={formData.noteCategory}
            onValueChange={(value) => updateFormData({ noteCategory: value as 'administrative' | 'legal' | 'insurance' | 'coordination_of_care' | 'incident_report' | 'other' })}
            options={NOTE_CATEGORIES}
            required
          />
          <InputField
            id="noteSubtype"
            label="Note Subtype"
            value={formData.noteSubtype}
            onChange={(e) => updateFormData({ noteSubtype: e.target.value })}
            placeholder="Specific type or subtype"
          />
          <SelectField
            label="Urgency Level"
            value={formData.urgencyLevel}
            onValueChange={(value) => updateFormData({ urgencyLevel: value as 'low' | 'medium' | 'high' | 'urgent' })}
            options={URGENCY_LEVELS}
          />
        </div>

        <InputField
          id="noteTitle"
          label="Note Title"
          value={formData.noteTitle}
          onChange={(e) => updateFormData({ noteTitle: e.target.value })}
          placeholder="Brief descriptive title for this note"
          required
        />
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span>Note Content</span>
        </h3>
        
        <TextareaField
          id="noteDescription"
          label="Brief Description"
          value={formData.noteDescription}
          onChange={(e) => updateFormData({ noteDescription: e.target.value })}
          placeholder="Provide a brief description of the event or activity..."
          rows={3}
          required
        />

        <TextareaField
          id="detailedNotes"
          label="Detailed Notes"
          value={formData.detailedNotes}
          onChange={(e) => updateFormData({ detailedNotes: e.target.value })}
          placeholder="Provide detailed information, observations, or notes..."
          rows={5}
        />
      </div>

      {/* Related Persons Section */}
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
              <InputField
                label="Name"
                value={person.name}
                onChange={(e) => updateRelatedPerson(index, 'name', e.target.value)}
                placeholder="Person's name"
              />
              <InputField
                label="Relationship"
                value={person.relationship}
                onChange={(e) => updateRelatedPerson(index, 'relationship', e.target.value)}
                placeholder="Relationship to client"
              />
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <InputField
                    label="Role"
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

      {/* Legal Compliance Section */}
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
          <TextareaField
            id="reportingDetails"
            label="Mandatory Reporting Details"
            value={formData.reportingDetails}
            onChange={(e) => updateFormData({ reportingDetails: e.target.value })}
            placeholder="Describe the reporting requirements and actions taken..."
            rows={3}
          />
        )}

        <TextareaField
          id="legalImplications"
          label="Legal Implications"
          value={formData.legalImplications}
          onChange={(e) => updateFormData({ legalImplications: e.target.value })}
          placeholder="Any legal implications or considerations..."
          rows={2}
        />
      </div>

      {/* Outcomes Section */}
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
          <TextareaField
            id="followUpDetails"
            label="Follow-up Details"
            value={formData.followUpDetails}
            onChange={(e) => updateFormData({ followUpDetails: e.target.value })}
            placeholder="Describe the follow-up actions needed..."
            rows={2}
          />
        )}

        <TextareaField
          id="resolution"
          label="Resolution"
          value={formData.resolution}
          onChange={(e) => updateFormData({ resolution: e.target.value })}
          placeholder="How was this matter resolved or what was the outcome..."
          rows={3}
        />

        <TextareaField
          id="outcomeSummary"
          label="Outcome Summary"
          value={formData.outcomeSummary}
          onChange={(e) => updateFormData({ outcomeSummary: e.target.value })}
          placeholder="Brief summary of the final outcome..."
          rows={2}
        />
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

export default MiscellaneousNoteForm;
