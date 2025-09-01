import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProgressNoteForm from '../pages/notes/ProgressNoteEditPage';
import ProgressNoteView from '../pages/notes/ProgressNoteViewPage';
import IntakeAssessmentForm from '../pages/notes/IntakeAssessmentNoteEditPage';
import IntakeAssessmentView from '../pages/notes/IntakeAssessmentNoteViewPage';
import TreatmentPlanForm from '../pages/notes/TreatmentPlanEditPage';
import TreatmentPlanView from '../pages/notes/TreatmentPlanViewPage';
import CancellationNoteForm from '../pages/notes/CancellationNoteEditPage';
import CancellationNoteView from '../pages/notes/CancellationNoteViewPage';
import ContactNoteForm from '../pages/notes/ContactNoteEditPage';
import ContactNoteView from '../pages/notes/ContactNoteViewPage';
import ConsultationNoteForm from '../pages/notes/ConsultationNoteEditPage';
import ConsultationNoteView from '../pages/notes/ConsultationNoteViewPage';
import MiscellaneousNoteForm from '../pages/notes/MiscellaneousNoteEditPage';
import MiscellaneousNoteView from '../pages/notes/MiscellaneousNoteViewPage';
import PendingApprovals from '@/pages/notes/PendingApprovalPage';
import AllNotes from '@/pages/notes/AllNotesPage';
import CreateNotePage from '@/pages/notes/CreateNotePage/index';
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
  {
    path: 'pending-approvals',
    element: <PendingApprovals />
  },
  {
    path: 'progress-note/:noteId/edit',
    element: <ProgressNoteForm />,
  },
  {
    path: 'progress-note/:noteId',
    element: <ProgressNoteView />,
  },
  // Intake Assessments
  {
    path: 'intake/:noteId/edit',
    element: <IntakeAssessmentForm />,
  },
  {
    path: 'intake/:noteId',
    element: <IntakeAssessmentView />,
  },
  // Treatment Plans
  {
    path: 'treatment-plan/:noteId/edit',
    element: <TreatmentPlanForm />,
  },
  {
    path: 'treatment-plan/:noteId',
    element: <TreatmentPlanView />,
  },
  // Cancellation Notes
  {
    path: 'cancellation-note/:noteId/edit',
    element: <CancellationNoteForm />,
  },
  {
    path: 'cancellation-note/:noteId',
    element: <CancellationNoteView />,
  },
  // Contact Notes
  {
    path: 'contact-note/:noteId/edit',
    element: <ContactNoteForm />,
  },
  {
    path: 'contact-note/:noteId',
    element: <ContactNoteView />,
  },
  // Consultation Notes
  {
    path: 'consultation-note/:noteId/edit',
    element: <ConsultationNoteForm />,
  },
  {
    path: 'consultation-note/:noteId',
    element: <ConsultationNoteView />,
  },
  // Miscellaneous Notes
  {
    path: 'miscellaneous-note/:noteId/edit',
    element: <MiscellaneousNoteForm />,
  },
  {
    path: 'miscellaneous-note/:noteId',
    element: <MiscellaneousNoteView />,
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