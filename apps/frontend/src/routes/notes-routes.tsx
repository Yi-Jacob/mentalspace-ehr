import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProgressNoteForm from '../pages/notes/ProgressNoteEditPage';
import IntakeAssessmentForm from '../pages/notes/IntakeAssessmentNoteEditPage';
import TreatmentPlanForm from '../pages/notes/TreatmentPlanEditPage';
import CancellationNoteForm from '../pages/notes/CancellationNoteEditPage';
import ContactNoteForm from '../pages/notes/ContactNoteEditPage';
import ConsultationNoteForm from '../pages/notes/ConsultationNoteEditPage';
import MiscellaneousNoteForm from '../pages/notes/MiscellaneousNoteEditPage';
import AllNotes from '@/pages/notes/AllNotesPage';
import CreateNotePage from '@/pages/notes/CreateNotePage/index';
import NoteViewPage from '@/pages/notes/NoteViewPage';
import NoteHistory from '@/pages/notes/NoteHistoryPage';
import NoteHistoryView from '@/pages/notes/NoteHistoryViewPage';

const notesRoutes: RouteObject[] = [
  {
    index: true,
    element: <AllNotes />
  },
  {
    path: 'all-notes',
    element: <AllNotes />
  },
  {
    path: 'create-note',
    element: <CreateNotePage />
  },
  // Consolidated view route
  {
    path: 'view/:noteId',
    element: <NoteViewPage />,
  },
  // Edit routes (keeping existing structure for now)
  {
    path: 'progress-note/:noteId/edit',
    element: <ProgressNoteForm />,
  },
  {
    path: 'intake/:noteId/edit',
    element: <IntakeAssessmentForm />,
  },
  {
    path: 'treatment-plan/:noteId/edit',
    element: <TreatmentPlanForm />,
  },
  {
    path: 'cancellation-note/:noteId/edit',
    element: <CancellationNoteForm />,
  },
  {
    path: 'contact-note/:noteId/edit',
    element: <ContactNoteForm />,
  },
  {
    path: 'consultation-note/:noteId/edit',
    element: <ConsultationNoteForm />,
  },
  {
    path: 'miscellaneous-note/:noteId/edit',
    element: <MiscellaneousNoteForm />,
  },
  // Note History
  {
    path: ':noteId/history',
    element: <NoteHistory />,
  },
  {
    path: ':noteId/history/:versionId',
    element: <NoteHistoryView />,
  }
];

export default notesRoutes; 