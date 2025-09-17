import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';
import { NOTE_TYPES } from '@/types/enums/notesEnum';
import { LoadingState } from '@/components/basic/loading-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Alert, AlertDescription } from '@/components/basic/alert';
import { AlertCircle } from 'lucide-react';

// Import all note edit components
import ProgressNoteForm from '../ProgressNoteEditPage';
import IntakeAssessmentForm from '../IntakeAssessmentNoteEditPage';
import TreatmentPlanForm from '../TreatmentPlanEditPage';
import CancellationNoteForm from '../CancellationNoteEditPage';
import ContactNoteForm from '../ContactNoteEditPage';
import ConsultationNoteForm from '../ConsultationNoteEditPage';
import MiscellaneousNoteForm from '../MiscellaneousNoteEditPage';

const NoteEditPage = () => {
  const { noteId } = useParams();

  const { data: noteData, isLoading, error } = useQuery({
    queryKey: ['note', noteId],
    queryFn: async () => {
      if (!noteId) return null;
      return await noteService.getNote(noteId);
    },
    enabled: !!noteId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingState count={6} />
      </div>
    );
  }

  if (error || !noteData) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading note or note not found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const noteTypeConfig = NOTE_TYPES.find(config => config.type === noteData.noteType);
  
  if (!noteTypeConfig) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unknown note type: {noteData.noteType}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Render the appropriate note edit component based on note type
  const NoteEditComponent = (() => {
    switch (noteData.noteType) {
      case 'progress_note':
        return <ProgressNoteForm />;
      case 'intake':
        return <IntakeAssessmentForm />;
      case 'treatment_plan':
        return <TreatmentPlanForm />;
      case 'cancellation_note':
        return <CancellationNoteForm />;
      case 'contact_note':
        return <ContactNoteForm />;
      case 'consultation_note':
        return <ConsultationNoteForm />;
      case 'miscellaneous_note':
        return <MiscellaneousNoteForm />;
      default:
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No edit component available for note type: {noteData.noteType}
            </AlertDescription>
          </Alert>
        );
    }
  })();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <noteTypeConfig.icon className="h-5 w-5" />
            Edit {noteTypeConfig.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {NoteEditComponent}
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteEditPage;
