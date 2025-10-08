
import React from 'react';
import { useParams } from 'react-router-dom';
import { InputField } from '@/components/basic/input';
import { SelectField } from '@/components/basic/select';
import { TextareaField } from '@/components/basic/textarea';
import { DateInput } from '@/components/basic/date-input';
import { Label } from '@/components/basic/label';
import { Checkbox } from '@/components/basic/checkbox';
import { Alert, AlertDescription } from '@/components/basic/alert';
import { Phone, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useContactNoteData } from '../hooks/useContactNoteData';
import { useContactNoteForm } from '../hooks/useContactNoteForm';
import { useContactNoteSave } from '../hooks/useContactNoteSave';
import OneSectionNoteEditLayout from '@/pages/notes/components/layout/OneSectionNoteEditLayout';
import { ContactNoteFormData } from '@/types/noteType';
import { CONTACT_TYPES, CONTACT_INITIATORS } from '@/types/enums/notesEnum';

const ContactNoteForm = () => {
  const { noteId } = useParams();
  
  const { data: noteData } = useContactNoteData(noteId);
  const { formData, updateFormData, validateForm } = useContactNoteForm(noteData);
  const { isLoading, handleSave } = useContactNoteSave(noteId);

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

  return (
    <OneSectionNoteEditLayout
      icon={Phone}
      title="Contact Note"
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
      finalizeButtonColor="teal"
      noteType="contact_note"
      onAIFill={handleAIFill}
    >
      {/* Contact Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DateInput
            id="contactDate"
            label="Contact Date"
            value={formData.contactDate}
            onChange={(value) => updateFormData({ contactDate: value })}
            required
          />
          <InputField
            id="contactTime"
            label="Contact Time"
            type="time"
            value={formData.contactTime}
            onChange={(e) => updateFormData({ contactTime: e.target.value })}
          />
          <InputField
            id="contactDuration"
            label="Duration (minutes)"
            type="number"
            min="1"
            value={formData.contactDuration.toString()}
            onChange={(e) => updateFormData({ contactDuration: parseInt(e.target.value) || 0 })}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Contact Type"
            value={formData.contactType}
            onValueChange={(value) => updateFormData({ contactType: value as 'phone' | 'email' | 'text' | 'video_call' | 'in_person' | 'collateral' })}
            options={CONTACT_TYPES}
            required
          />
          <SelectField
            label="Contact Initiated By"
            value={formData.contactInitiator}
            onValueChange={(value) => updateFormData({ contactInitiator: value as 'client' | 'provider' | 'family' | 'other_provider' | 'emergency' })}
            options={CONTACT_INITIATORS}
            required
          />
        </div>
      </div>

      {/* Contact Summary Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Contact Summary</h3>
        
        <TextareaField
          id="contactSummary"
          label="Contact Summary"
          value={formData.contactSummary}
          onChange={(e) => updateFormData({ contactSummary: e.target.value })}
          placeholder="Summarize the purpose and content of this contact..."
          rows={4}
          required
        />

        <InputField
          id="clientMoodStatus"
          label="Client Mood/Status"
          value={formData.clientMoodStatus}
          onChange={(e) => updateFormData({ clientMoodStatus: e.target.value })}
          placeholder="Describe client's mood, affect, or status during contact"
        />
      </div>

      {/* Risk Assessment Section */}
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
          <TextareaField
            id="riskDetails"
            label="Risk Details"
            value={formData.riskDetails}
            onChange={(e) => updateFormData({ riskDetails: e.target.value })}
            placeholder="Describe any risk factors, safety concerns, or interventions provided..."
            rows={3}
          />
        )}
      </div>

      {/* Clinical Observations Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Clinical Observations & Recommendations</h3>
        
        <TextareaField
          id="clinicalObservations"
          label="Clinical Observations"
          value={formData.clinicalObservations}
          onChange={(e) => updateFormData({ clinicalObservations: e.target.value })}
          placeholder="Document any clinical observations, symptoms, or behavioral changes..."
          rows={3}
        />

        <TextareaField
          id="providerRecommendations"
          label="Provider Recommendations"
          value={formData.providerRecommendations}
          onChange={(e) => updateFormData({ providerRecommendations: e.target.value })}
          placeholder="Any recommendations, suggestions, or guidance provided..."
          rows={3}
        />
      </div>

      {/* Follow-up Section */}
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
          <TextareaField
            id="followUpPlan"
            label="Follow-up Plan"
            value={formData.followUpPlan}
            onChange={(e) => updateFormData({ followUpPlan: e.target.value })}
            placeholder="Describe the follow-up actions needed..."
            rows={2}
          />
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
          <DateInput
            id="nextAppointmentDate"
            label="Next Appointment Date"
            value={formData.nextAppointmentDate}
            onChange={(value) => updateFormData({ nextAppointmentDate: value })}
          />
        )}
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

export default ContactNoteForm;
