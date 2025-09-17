import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { InfoDisplay, InfoSection } from '@/components/basic/InfoDisplay';
import { Phone, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { CONTACT_TYPES, CONTACT_INITIATORS } from '@/types/enums/notesEnum';

interface ContactNoteViewProps {
  noteData: any;
}

const ContactNoteView: React.FC<ContactNoteViewProps> = ({ noteData }) => {
  const getContactTypeLabel = (value: string) => {
    const type = CONTACT_TYPES.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getContactInitiatorLabel = (value: string) => {
    const initiator = CONTACT_INITIATORS.find(i => i.value === value);
    return initiator ? initiator.label : value;
  };

  return (
    <>
      {/* Contact Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-blue-600" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Contact Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Contact Date" 
                value={noteData.content.contactDate ? format(new Date(noteData.content.contactDate), 'PPP') : null} 
              />
              <InfoDisplay 
                label="Contact Time" 
                value={noteData.content.contactTime} 
              />
              <InfoDisplay 
                label="Duration" 
                value={noteData.content.contactDuration ? `${noteData.content.contactDuration} minutes` : null} 
              />
              <InfoDisplay 
                label="Contact Type" 
                value={getContactTypeLabel(noteData.content.contactType)} 
              />
              <InfoDisplay 
                label="Contact Initiated By" 
                value={getContactInitiatorLabel(noteData.content.contactInitiator)} 
              />
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Contact Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Summary Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Contact Summary" 
                value={noteData.content.contactSummary} 
              />
              <InfoDisplay 
                label="Client Mood/Status" 
                value={noteData.content.clientMoodStatus} 
              />
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Risk Assessment Section */}
      {noteData.content.riskFactorsDiscussed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoSection title="Risk Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoDisplay 
                  label="Risk Factors Discussed" 
                  value="Yes" 
                />
                <InfoDisplay 
                  label="Risk Details" 
                  value={noteData.content.riskDetails} 
                />
              </div>
            </InfoSection>
          </CardContent>
        </Card>
      )}

      {/* Clinical Observations Section */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Observations & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Clinical Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Clinical Observations" 
                value={noteData.content.clinicalObservations} 
              />
              <InfoDisplay 
                label="Provider Recommendations" 
                value={noteData.content.providerRecommendations} 
              />
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Follow-up Planning Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Follow-up Planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Follow-up Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Follow-up Required" 
                value={noteData.content.followUpRequired ? 'Yes' : 'No'} 
              />
              <InfoDisplay 
                label="Next Appointment Scheduled" 
                value={noteData.content.nextAppointmentScheduled ? 'Yes' : 'No'} 
              />
              {noteData.content.followUpRequired && (
                <InfoDisplay 
                  label="Follow-up Plan" 
                  value={noteData.content.followUpPlan} 
                />
              )}
              {noteData.content.nextAppointmentScheduled && noteData.content.nextAppointmentDate && (
                <InfoDisplay 
                  label="Next Appointment Date" 
                  value={format(new Date(noteData.content.nextAppointmentDate), 'PPP')} 
                />
              )}
            </div>
          </InfoSection>
        </CardContent>
      </Card>
    </>
  );
};

export default ContactNoteView;
