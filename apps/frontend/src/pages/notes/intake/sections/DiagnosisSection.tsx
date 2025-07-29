
import React from 'react';
import { IntakeFormData } from '../types/IntakeFormData';
import DiagnosisGuidelines from './diagnosis/DiagnosisGuidelines';
import PriorDiagnosesDisplay from './diagnosis/PriorDiagnosesDisplay';
import PrimaryDiagnosisSelector from './diagnosis/PrimaryDiagnosisSelector';
import SecondaryDiagnosesManager from './diagnosis/SecondaryDiagnosesManager';
import { useDiagnosesData } from '../hooks/useDiagnosesData';

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
  const { data: availableDiagnoses = [] } = useDiagnosesData();

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
