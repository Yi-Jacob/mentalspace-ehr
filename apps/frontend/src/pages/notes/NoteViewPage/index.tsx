import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { InfoDisplay, InfoSection } from '@/components/basic/InfoDisplay';
import { LoadingState } from '@/components/basic/loading-state';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';
import NoteViewLayout from '../components/layout/NoteViewLayout';
import ProgressNoteView from './components/ProgressNoteView';
import IntakeAssessmentView from './components/IntakeAssessmentView';
import TreatmentPlanView from './components/TreatmentPlanView';
import ContactNoteView from './components/ContactNoteView';
import ConsultationNoteView from './components/ConsultationNoteView';
import CancellationNoteView from './components/CancellationNoteView';
import MiscellaneousNoteView from './components/MiscellaneousNoteView';
import { NOTE_TYPES } from '@/types/enums/notesEnum';

const NoteViewPage = () => {
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
        <LoadingState count={8} />
      </div>
    );
  }

  if (!noteData) {
    return null; // NoteViewLayout will handle the not found state
  }

  // Get note type configuration
  const noteTypeConfig = NOTE_TYPES.find(type => type.type === noteData.noteType);
  
  // Render the appropriate view component based on note type
  const renderNoteContent = () => {
    switch (noteData.noteType) {
      case 'progress_note':
        return <ProgressNoteView noteData={noteData} />;
      case 'intake':
        return <IntakeAssessmentView noteData={noteData} />;
      case 'treatment_plan':
        return <TreatmentPlanView noteData={noteData} />;
      case 'contact_note':
        return <ContactNoteView noteData={noteData} />;
      case 'consultation_note':
        return <ConsultationNoteView noteData={noteData} />;
      case 'cancellation_note':
        return <CancellationNoteView noteData={noteData} />;
      case 'miscellaneous_note':
        return <MiscellaneousNoteView noteData={noteData} />;
      default:
        return (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Unknown note type: {noteData.noteType}</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <NoteViewLayout
      note={noteData}
      noteType={noteData.noteType}
      icon={noteTypeConfig?.icon}
      title={noteTypeConfig?.title || 'Note'}
    >
      {/* Render the specific note type content */}
      {renderNoteContent()}

      {/* Note Status Section - Common to all note types */}
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
              {noteData.coSignedAt && (
                <InfoDisplay 
                  label="Co-signed At" 
                  value={format(new Date(noteData.coSignedAt), 'PPP p')} 
                />
              )}
              {noteData.coSignedBy && (
                <InfoDisplay 
                  label="Co-signed By" 
                  value={noteData.coSignedBy} 
                />
              )}
              {noteData.lockedAt && (
                <InfoDisplay 
                  label="Locked At" 
                  value={format(new Date(noteData.lockedAt), 'PPP p')} 
                />
              )}
              {noteData.lockedBy && (
                <InfoDisplay 
                  label="Locked By" 
                  value={noteData.lockedBy} 
                />
              )}
              {noteData.unlockedAt && (
                <InfoDisplay 
                  label="Unlocked At" 
                  value={format(new Date(noteData.unlockedAt), 'PPP p')} 
                />
              )}
              {noteData.unlockedBy && (
                <InfoDisplay 
                  label="Unlocked By" 
                  value={noteData.unlockedBy} 
                />
              )}
            </div>
          </InfoSection>
        </CardContent>
      </Card>

      {/* Finalization Status - Common to all note types */}
      {noteData.status === 'accepted' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Note Finalized</p>
                <p className="text-sm text-green-800">
                  {noteData.coSignedBy 
                    ? `Co-signed by: ${noteData.coSignedBy} on ${noteData.coSignedAt && format(new Date(noteData.coSignedAt), 'PPP p')}`
                    : `Signed by: ${noteData.signedBy} on ${noteData.signedAt && format(new Date(noteData.signedAt), 'PPP p')}`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Co-sign Status */}
      {noteData.status === 'pending_co_sign' && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">Pending Co-signature</p>
                <p className="text-sm text-amber-800">
                  Signed by: {noteData.signedBy} on {noteData.signedAt && format(new Date(noteData.signedAt), 'PPP p')}
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  This note requires supervisor co-signature to be finalized.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </NoteViewLayout>
  );
};

export default NoteViewPage;
