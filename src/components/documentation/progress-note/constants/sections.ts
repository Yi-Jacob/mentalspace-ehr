
import ClientOverviewSection from '../sections/ClientOverviewSection';
import DiagnosisSection from '../sections/DiagnosisSection';
import MentalStatusSection from '../sections/MentalStatusSection';
import RiskAssessmentSection from '../sections/RiskAssessmentSection';
import MedicationsSection from '../sections/MedicationsSection';
import ContentSection from '../sections/ContentSection';
import InterventionsSection from '../sections/InterventionsSection';
import TreatmentProgressSection from '../sections/TreatmentProgressSection';
import PlanningSection from '../sections/PlanningSection';
import FinalizeSection from '../sections/FinalizeSection';

export const SECTIONS = [
  {
    id: 'client-overview',
    title: 'Session Overview',
    component: ClientOverviewSection,
  },
  {
    id: 'diagnosis',
    title: 'Diagnosis',
    component: DiagnosisSection,
  },
  {
    id: 'mental-status',
    title: 'Current Mental Status',
    component: MentalStatusSection,
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment',
    component: RiskAssessmentSection,
  },
  {
    id: 'medications',
    title: 'Medications',
    component: MedicationsSection,
  },
  {
    id: 'content',
    title: 'Session Content',
    component: ContentSection,
  },
  {
    id: 'interventions',
    title: 'Interventions Used',
    component: InterventionsSection,
  },
  {
    id: 'treatment-progress',
    title: 'Treatment Plan Progress',
    component: TreatmentProgressSection,
  },
  {
    id: 'planning',
    title: 'Planning',
    component: PlanningSection,
  },
  {
    id: 'finalize',
    title: 'Finalize & Sign',
    component: FinalizeSection,
  },
];
