import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProgressNoteForm from '../pages/notes/progress-note/ProgressNoteEditPage';
import ProgressNoteView from '../pages/notes/progress-note/ProgressNoteViewPage';
import IntakeAssessmentForm from '../pages/notes/intake/IntakeAssessmentEditPage';
import IntakeAssessmentView from '../pages/notes/intake/IntakeAssessmentViewPage';
import TreatmentPlanForm from '../pages/notes/treatment-plan/TreatmentPlanEditPage';
import CancellationNoteForm from '../pages/notes/CancellationNoteEditPage';
import ContactNoteForm from '../pages/notes/contact-note/ContactNoteEditPage';
import ConsultationNoteForm from '../pages/notes/consultation-note/ConsultationNoteEditPage';
import MiscellaneousNoteForm from '../pages/notes/miscellaneous-note/MiscellaneousNoteEditPage';
import GenericNoteView from '../pages/notes/GenericNoteViewPage';
import PendingApprovals from '@/pages/notes/PendingApprovalPage';
import AllNotes from '@/pages/notes/AllNotesPage';
import CreateNotePage from '@/pages/notes/CreateNotePage/index';
import NoteCompliance from '@/pages/notes/NoteCompliancePage/index';
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
    path: 'note-compliance',
    element: <NoteCompliance />
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
    element: <GenericNoteView />,
  },
  // Cancellation Notes
  {
    path: 'cancellation-note/:noteId/edit',
    element: <CancellationNoteForm />,
  },
  {
    path: 'cancellation-note/:noteId',
    element: <GenericNoteView />,
  },
  // Contact Notes
  {
    path: 'contact-note/:noteId/edit',
    element: <ContactNoteForm />,
  },
  {
    path: 'contact-note/:noteId',
    element: <GenericNoteView />,
  },
  // Consultation Notes
  {
    path: 'consultation-note/:noteId/edit',
    element: <ConsultationNoteForm />,
  },
  {
    path: 'consultation-note/:noteId',
    element: <GenericNoteView />,
  },
  // Miscellaneous Notes
  {
    path: 'miscellaneous-note/:noteId/edit',
    element: <MiscellaneousNoteForm />,
  },
  {
    path: 'miscellaneous-note/:noteId',
    element: <GenericNoteView />,
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