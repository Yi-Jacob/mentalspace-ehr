import React from 'react';
import { RouteObject } from 'react-router-dom';
import Notes from '../pages/notes';
import ProgressNoteForm from '../pages/notes/progress-note/ProgressNoteForm';
import ProgressNoteView from '../pages/notes/progress-note/ProgressNoteView';
import IntakeAssessmentForm from '../pages/notes/intake/IntakeAssessmentForm';
import IntakeAssessmentView from '../pages/notes/intake/IntakeAssessmentView';
import TreatmentPlanForm from '../pages/notes/treatment-plan/TreatmentPlanForm';
import CancellationNoteForm from '../pages/notes/cancellation-note/CancellationNoteForm';
import ContactNoteForm from '../pages/notes/contact-note/ContactNoteForm';
import ConsultationNoteForm from '../pages/notes/consultation-note/ConsultationNoteForm';
import MiscellaneousNoteForm from '../pages/notes/miscellaneous-note/MiscellaneousNoteForm';
import GenericNoteView from '../pages/notes/GenericNoteView';

const notesRoutes: RouteObject[] = [
  {
    path: '',
    element: <Notes />,
    children: [
      // Progress Notes
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
      // Generic Note Routes (fallback)
      {
        path: 'note/:noteId/edit',
        element: <ProgressNoteForm />,
      },
      {
        path: 'note/:noteId',
        element: <GenericNoteView />,
      },
    ],
  },
];

export default notesRoutes; 