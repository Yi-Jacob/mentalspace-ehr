import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { InfoDisplay, InfoSection } from '@/components/basic/InfoDisplay';
import { LoadingState } from '@/components/basic/loading-state';
import { Users, AlertTriangle, Clock, CheckCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';
import NoteViewLayout from '../components/layout/NoteViewLayout';
import { CONSULTATION_TYPES } from '@/types/enums/notesEnum';

const ConsultationNoteViewPage = () => {
  const { noteId } = useParams();
  
  const { data: noteData, isLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: async () => {
      if (!noteId) return null;
      return await noteService.getNote(noteId);
    },
    enabled: !!noteId,
  });

  if (isLoading) {
    return (
      <div className="py-8">
        <LoadingState count={4} />
      </div>
    );
  }

  if (!noteData) {
    return null; // NoteViewLayout will handle the not found state
  }

  const getConsultationTypeLabel = (value: string) => {
    const type = CONSULTATION_TYPES.find(t => t.value === value);
    return type ? type.label : value;
  };

  return (
    <NoteViewLayout
      note={noteData}
      noteType="consultation_note"
      icon={Users}
      title="Consultation Note"
    >
      {/* Consultation Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Consultation Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Consultation Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Consultation Date" 
                value={noteData.content.consultationDate ? format(new Date(noteData.content.consultationDate), 'PPP') : null} 
              />
              <InfoDisplay 
                label="Consultation Time" 
                value={noteData.content.consultationTime} 
              />
              <InfoDisplay 
                label="Duration" 
                value={noteData.content.consultationDuration ? `${noteData.content.consultationDuration} minutes` : null} 
              />
              <InfoDisplay 
                label="Consultation Type" 
                value={getConsultationTypeLabel(noteData.content.consultationType)} 
              />
              <InfoDisplay 
                label="Consultation Purpose" 
                value={noteData.content.consultationPurpose} 
              />
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Participants Section */}
      {noteData.content.participants && noteData.content.participants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoSection title="Participant Information">
              <div className="space-y-4">
                {noteData.content.participants.map((participant, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InfoDisplay 
                        label="Name" 
                        value={participant.name} 
                      />
                      <InfoDisplay 
                        label="Role" 
                        value={participant.role} 
                      />
                      <InfoDisplay 
                        label="Organization" 
                        value={participant.organization} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </InfoSection>
          </CardContent>
        </Card>
      )}

      {/* Clinical Discussion Section */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Discussion Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Presenting Concerns" 
                value={noteData.content.presentingConcerns} 
              />
              <InfoDisplay 
                label="Background Information" 
                value={noteData.content.backgroundInformation} 
              />
              <InfoDisplay 
                label="Current Treatment" 
                value={noteData.content.currentTreatment} 
              />
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Recommendations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Recommendations & Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Recommendations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Treatment Modifications" 
                value={noteData.content.treatmentModifications} 
              />
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Action Items Section */}
      {noteData.content.actionItemOwners && noteData.content.actionItemOwners.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoSection title="Action Items">
              <div className="space-y-4">
                {noteData.content.actionItemOwners.map((action, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InfoDisplay 
                        label="Action" 
                        value={action.action} 
                      />
                      <InfoDisplay 
                        label="Owner" 
                        value={action.owner} 
                      />
                      <InfoDisplay 
                        label="Due Date" 
                        value={action.dueDate ? format(new Date(action.dueDate), 'PPP') : null} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </InfoSection>
          </CardContent>
        </Card>
      )}

      {/* Compliance Section */}
      <Card>
        <CardHeader>
          <CardTitle>Agreements & Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <InfoSection title="Compliance Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoDisplay 
                label="Confidentiality Agreement" 
                value={noteData.content.confidentialityAgreement ? 'Yes' : 'No'} 
              />
              <InfoDisplay 
                label="Consent Obtained" 
                value={noteData.content.consentObtained ? 'Yes' : 'No'} 
              />
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
    </NoteViewLayout>
  );
};

export default ConsultationNoteViewPage;
