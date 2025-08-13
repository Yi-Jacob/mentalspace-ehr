import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { InfoDisplay, InfoSection } from '@/components/basic/InfoDisplay';
import { LoadingState } from '@/components/basic/loading-state';
import { ArrowLeft, Edit, History, Phone, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useContactNoteData } from '../hooks/useContactNoteData';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { CONTACT_TYPES, CONTACT_INITIATORS } from '@/types/enums/notesEnum';

const ContactNoteViewPage = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  
  const { data: noteData, isLoading } = useContactNoteData(noteId);

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState count={4} className="py-8" />
      </PageLayout>
    );
  }

  if (!noteData) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Phone className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Contact Note not found</h3>
            <p className="mt-1 text-sm text-gray-500">The requested contact note could not be found.</p>
            <div className="mt-6">
              <Button onClick={() => navigate('/notes')}>
                Return to Notes
              </Button>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'locked': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContactTypeLabel = (value: string) => {
    const type = CONTACT_TYPES.find(t => t.value === value);
    return type ? type.label : value;
  };

  const getContactInitiatorLabel = (value: string) => {
    const initiator = CONTACT_INITIATORS.find(i => i.value === value);
    return initiator ? initiator.label : value;
  };

  const clientName = noteData.client 
    ? `${noteData.client.firstName} ${noteData.client.lastName}`
    : `Client ID: ${noteData.clientId}`;

  const providerName = noteData.provider 
    ? `${noteData.provider.firstName} ${noteData.provider.lastName}`
    : `Provider ID: ${noteData.providerId}`;

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Phone}
        title="Contact Note"
        description={
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="font-medium">Client:</span>
              <span>{clientName}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Provider:</span>
              <span>{providerName}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Created:</span>
              <span>{format(new Date(noteData.createdAt), 'PPP')}</span>
            </div>
          </div>
        }
        badge={
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(noteData.status)}>
              {noteData.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge variant="outline">Contact Note</Badge>
          </div>
        }
        action={
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate('/notes')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(`/notes/contact-note/${noteId}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(`/notes/${noteId}/history`)}
            >
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
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

        {/* Note Status Section */}
        <Card>
          <CardHeader>
            <CardTitle>Note Status</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoSection title="Status Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoDisplay 
                  label="Status" 
                  value={noteData.status.replace('_', ' ').toUpperCase()} 
                />
                <InfoDisplay 
                  label="Created" 
                  value={format(new Date(noteData.createdAt), 'PPP p')} 
                />
                <InfoDisplay 
                  label="Last Updated" 
                  value={format(new Date(noteData.updatedAt), 'PPP p')} 
                />
                {noteData.signedAt && (
                  <InfoDisplay 
                    label="Signed At" 
                    value={format(new Date(noteData.signedAt), 'PPP p')} 
                  />
                )}
                {noteData.signedBy && (
                  <InfoDisplay 
                    label="Signed By" 
                    value={noteData.signedBy} 
                  />
                )}
              </div>
            </InfoSection>
          </CardContent>
        </Card>

        {/* Finalization Status */}
        {noteData.status === 'signed' && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Note Finalized</p>
                  <p className="text-sm text-green-800">
                    Signed by: {noteData.signedBy} on {noteData.signedAt && format(new Date(noteData.signedAt), 'PPP p')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default ContactNoteViewPage;
