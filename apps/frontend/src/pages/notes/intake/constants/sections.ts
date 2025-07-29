
import ClientOverviewSection from '../sections/ClientOverviewSection';
import PresentingProblemSection from '../sections/PresentingProblemSection';
import TreatmentHistorySection from '../sections/TreatmentHistorySection';
import MedicalHistorySection from '../sections/MedicalHistorySection';
import SubstanceUseSection from '../sections/SubstanceUseSection';
import RiskAssessmentSection from '../sections/RiskAssessmentSection';
import PsychosocialSection from '../sections/PsychosocialSection';
import DiagnosisSection from '../sections/DiagnosisSection';
import FinalizeSection from '../sections/FinalizeSection';

export const SECTIONS = [
  { id: 'overview', title: 'Client Overview', component: ClientOverviewSection },
  { id: 'presenting', title: 'Presenting Problem', component: PresentingProblemSection },
  { id: 'treatment', title: 'Treatment History', component: TreatmentHistorySection },
  { id: 'medical', title: 'Medical & Psychiatric History', component: MedicalHistorySection },
  { id: 'substance', title: 'Substance Use', component: SubstanceUseSection },
  { id: 'risk', title: 'Risk Assessment', component: RiskAssessmentSection },
  { id: 'psychosocial', title: 'Psychosocial Information', component: PsychosocialSection },
  { id: 'diagnosis', title: 'Diagnosis', component: DiagnosisSection },
  { id: 'finalize', title: 'Finalize Intake', component: FinalizeSection },
];
