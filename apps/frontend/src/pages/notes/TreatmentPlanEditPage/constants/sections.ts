
import ClientOverviewSection from '../sections/ClientOverviewSection';
import DiagnosisSection from '../sections/DiagnosisSection';
import PresentingProblemSection from '../sections/PresentingProblemSection';
import TreatmentGoalsSection from '../sections/TreatmentGoalsSection';
import DischargePlanningSection from '../sections/DischargePlanningSection';
import AdditionalInfoSection from '../sections/AdditionalInfoSection';
import FrequencySection from '../sections/FrequencySection';
import FinalizeSection from '../sections/FinalizeSection';

export const SECTIONS = [
  {
    id: 'client-overview',
    title: 'Client Overview',
    component: ClientOverviewSection,
  },
  {
    id: 'diagnosis',
    title: 'Diagnosis',
    component: DiagnosisSection,
  },
  {
    id: 'presenting-problem',
    title: 'Presenting Problem',
    component: PresentingProblemSection,
  },
  {
    id: 'treatment-goals',
    title: 'Treatment Goals & Objectives',
    component: TreatmentGoalsSection,
  },
  {
    id: 'discharge-planning',
    title: 'Discharge Criteria/Planning',
    component: DischargePlanningSection,
  },
  {
    id: 'additional-info',
    title: 'Additional Information',
    component: AdditionalInfoSection,
  },
  {
    id: 'frequency',
    title: 'Frequency of Treatment',
    component: FrequencySection,
  },
  {
    id: 'finalize',
    title: 'Finalize & Sign',
    component: FinalizeSection,
  },
];
