
import React from 'react';
import { IntakeFormData } from '@/types/noteType';
import DiagnosisGuidelines from './diagnosis/DiagnosisGuidelines';
import PriorDiagnosesDisplay from './diagnosis/PriorDiagnosesDisplay';
import PrimaryDiagnosisSelector from './diagnosis/PrimaryDiagnosisSelector';
import SecondaryDiagnosesManager from './diagnosis/SecondaryDiagnosesManager';
import { useDiagnosesData } from '../../hooks/useIntakeAssessmentNoteDiagnosesData';

interface DiagnosisSectionProps {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  clientData: any;
}

const DiagnosisSection: React.FC<DiagnosisSectionProps> = ({
  formData,
  updateFormData,
  clientData,
}) => {
  // Using static data instead of backend API
  const availableDiagnoses = [
    // Mood Disorders
    { id: '1', code: 'F32.1', description: 'Major Depressive Disorder, Moderate', category: 'Mood Disorders', isActive: true },
    { id: '2', code: 'F32.2', description: 'Major Depressive Disorder, Severe', category: 'Mood Disorders', isActive: true },
    { id: '3', code: 'F31.1', description: 'Bipolar I Disorder, Current Episode Manic', category: 'Mood Disorders', isActive: true },
    { id: '4', code: 'F31.2', description: 'Bipolar I Disorder, Current Episode Depressed', category: 'Mood Disorders', isActive: true },
    { id: '5', code: 'F34.1', description: 'Persistent Depressive Disorder (Dysthymia)', category: 'Mood Disorders', isActive: true },
    
    // Anxiety Disorders
    { id: '6', code: 'F41.1', description: 'Generalized Anxiety Disorder', category: 'Anxiety Disorders', isActive: true },
    { id: '7', code: 'F40.10', description: 'Social Anxiety Disorder (Social Phobia)', category: 'Anxiety Disorders', isActive: true },
    { id: '8', code: 'F40.00', description: 'Agoraphobia', category: 'Anxiety Disorders', isActive: true },
    { id: '9', code: 'F41.0', description: 'Panic Disorder', category: 'Anxiety Disorders', isActive: true },
    { id: '10', code: 'F42.8', description: 'Obsessive-Compulsive Disorder', category: 'Anxiety Disorders', isActive: true },
    { id: '11', code: 'F43.1', description: 'Posttraumatic Stress Disorder', category: 'Anxiety Disorders', isActive: true },
    
    // Trauma and Stressor-Related Disorders
    { id: '12', code: 'F43.2', description: 'Adjustment Disorder with Depressed Mood', category: 'Trauma and Stressor-Related Disorders', isActive: true },
    { id: '13', code: 'F43.21', description: 'Adjustment Disorder with Anxiety', category: 'Trauma and Stressor-Related Disorders', isActive: true },
    
    // Personality Disorders
    { id: '14', code: 'F60.3', description: 'Emotionally Unstable Personality Disorder (Borderline)', category: 'Personality Disorders', isActive: true },
    { id: '15', code: 'F60.0', description: 'Paranoid Personality Disorder', category: 'Personality Disorders', isActive: true },
    
    // Substance Use Disorders
    { id: '16', code: 'F10.20', description: 'Alcohol Use Disorder, Moderate', category: 'Substance Use Disorders', isActive: true },
    { id: '17', code: 'F10.21', description: 'Alcohol Use Disorder, Severe', category: 'Substance Use Disorders', isActive: true },
    
    // Psychotic Disorders
    { id: '18', code: 'F20.9', description: 'Schizophrenia, Unspecified', category: 'Psychotic Disorders', isActive: true },
    { id: '19', code: 'F22', description: 'Delusional Disorder', category: 'Psychotic Disorders', isActive: true },
    
    // Eating Disorders
    { id: '20', code: 'F50.00', description: 'Anorexia Nervosa, Restricting Type', category: 'Eating Disorders', isActive: true },
    { id: '21', code: 'F50.2', description: 'Bulimia Nervosa', category: 'Eating Disorders', isActive: true },
    
    // Neurodevelopmental Disorders
    { id: '22', code: 'F90.1', description: 'ADHD, Predominantly Inattentive Type', category: 'Neurodevelopmental Disorders', isActive: true },
    { id: '23', code: 'F90.2', description: 'ADHD, Combined Type', category: 'Neurodevelopmental Disorders', isActive: true },
    { id: '24', code: 'F84.0', description: 'Autism Spectrum Disorder', category: 'Neurodevelopmental Disorders', isActive: true },
    
    // Sleep-Wake Disorders
    { id: '25', code: 'F51.01', description: 'Insomnia Disorder', category: 'Sleep-Wake Disorders', isActive: true },
    
    // V Codes (Other Conditions)
    { id: '26', code: 'Z63.0', description: 'Relationship Distress with Spouse or Intimate Partner', category: 'V Codes', isActive: true },
    { id: '27', code: 'Z63.4', description: 'Uncomplicated Bereavement', category: 'V Codes', isActive: true },
  ];

  const handlePrimaryDiagnosisSelect = (diagnosis: string) => {
    updateFormData({ primaryDiagnosis: diagnosis });
  };

  const handleSecondaryDiagnosisAdd = (diagnosis: string) => {
    updateFormData({
      secondaryDiagnoses: [...formData.secondaryDiagnoses, diagnosis]
    });
  };

  const handleSecondaryDiagnosisRemove = (diagnosis: string) => {
    updateFormData({
      secondaryDiagnoses: formData.secondaryDiagnoses.filter(d => d !== diagnosis)
    });
  };

  const handleUsePriorDiagnosis = (diagnosis: string) => {
    if (!formData.primaryDiagnosis) {
      handlePrimaryDiagnosisSelect(diagnosis);
    } else {
      handleSecondaryDiagnosisAdd(diagnosis);
    }
  };

  return (
    <div className="space-y-6">
      <DiagnosisGuidelines />

      <PriorDiagnosesDisplay
        priorDiagnoses={clientData?.prior_diagnoses}
        onUseDiagnosis={handleUsePriorDiagnosis}
      />

      <PrimaryDiagnosisSelector
        primaryDiagnosis={formData.primaryDiagnosis}
        onSelect={handlePrimaryDiagnosisSelect}
        availableDiagnoses={availableDiagnoses}
      />

      <SecondaryDiagnosesManager
        secondaryDiagnoses={formData.secondaryDiagnoses}
        onAdd={handleSecondaryDiagnosisAdd}
        onRemove={handleSecondaryDiagnosisRemove}
        availableDiagnoses={availableDiagnoses}
      />
    </div>
  );
};

export default DiagnosisSection;
