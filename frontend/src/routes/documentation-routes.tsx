import React from 'react';
import { RouteObject, Outlet } from 'react-router-dom';
import Documentation from '../pages/Documentation';
import ProgressNoteForm from '../components/documentation/progress-note/ProgressNoteForm';
import ProgressNoteView from '../components/documentation/progress-note/ProgressNoteView';
import IntakeAssessmentForm from '../components/documentation/intake/IntakeAssessmentForm';
import IntakeAssessmentView from '../components/documentation/intake/IntakeAssessmentView';
import TreatmentPlanForm from '../components/documentation/treatment-plan/TreatmentPlanForm';
import CancellationNoteForm from '../components/documentation/cancellation-note/CancellationNoteForm';
import ContactNoteForm from '../components/documentation/contact-note/ContactNoteForm';
import ConsultationNoteForm from '../components/documentation/consultation-note/ConsultationNoteForm';
import MiscellaneousNoteForm from '../components/documentation/miscellaneous-note/MiscellaneousNoteForm';
import GenericNoteView from '../components/documentation/GenericNoteView';

const documentationRoutes: RouteObject[] = [
  {
    path: '',
    element: <Documentation />,
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

export default documentationRoutes; 