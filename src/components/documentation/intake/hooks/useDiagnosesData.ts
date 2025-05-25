
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DiagnosisOption {
  code: string;
  description: string;
}

// For now, we'll use a combination of database data and common ICD-10/DSM-5 codes
// In a real application, you'd want to have a comprehensive diagnoses table
const COMMON_DIAGNOSES: DiagnosisOption[] = [
  { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
  { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
  { code: 'F43.10', description: 'Post-traumatic stress disorder, unspecified' },
  { code: 'F43.20', description: 'Adjustment disorders, unspecified' },
  { code: 'F90.9', description: 'Attention-deficit hyperactivity disorder, unspecified type' },
  { code: 'F31.9', description: 'Bipolar disorder, unspecified' },
  { code: 'F40.10', description: 'Social phobia, unspecified' },
  { code: 'F42.9', description: 'Obsessive-compulsive disorder, unspecified' },
  { code: 'F33.9', description: 'Major depressive disorder, recurrent, unspecified' },
  { code: 'F84.0', description: 'Autistic disorder' },
  { code: 'F50.9', description: 'Eating disorder, unspecified' },
  { code: 'F60.9', description: 'Personality disorder, unspecified' },
  { code: 'F25.9', description: 'Schizoaffective disorder, unspecified' },
  { code: 'F20.9', description: 'Schizophrenia, unspecified' },
  { code: 'F34.1', description: 'Dysthymic disorder' },
  { code: 'F06.30', description: 'Mood disorder due to known physiological condition, unspecified' },
];

export const useDiagnosesData = () => {
  return useQuery({
    queryKey: ['diagnoses-data'],
    queryFn: async () => {
      // For now, return the common diagnoses
      // In the future, this could be enhanced to fetch from a diagnoses table
      return COMMON_DIAGNOSES;
    },
  });
};
