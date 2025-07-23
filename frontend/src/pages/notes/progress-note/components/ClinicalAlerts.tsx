
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, Lightbulb, Heart } from 'lucide-react';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';

interface ClinicalAlertsProps {
  formData: ProgressNoteFormData;
}

const ClinicalAlerts: React.FC<ClinicalAlertsProps> = ({ formData }) => {
  const generateAlerts = () => {
    const alerts = [];

    // Risk assessment alerts
    const highRiskAreas = formData.riskAreas?.filter(area => 
      area.levelOfRisk === 'High' || area.levelOfRisk === 'Imminent'
    );

    if (highRiskAreas && highRiskAreas.length > 0) {
      alerts.push({
        type: 'error' as const,
        icon: AlertTriangle,
        title: 'High Risk Identified',
        message: `${highRiskAreas.length} high-risk area(s) identified. Consider safety planning and frequent monitoring.`,
        actions: ['Review crisis plan', 'Consider increased session frequency', 'Document safety measures']
      });
    }

    // Session duration alerts
    if (formData.duration > 0) {
      if (formData.duration < 30 && formData.serviceCode === '90834') {
        alerts.push({
          type: 'warning' as const,
          icon: AlertTriangle,
          title: 'Session Duration Mismatch',
          message: `Session duration (${formData.duration} min) may not meet requirements for CPT code ${formData.serviceCode} (45 min target).`
        });
      } else if (formData.duration < 45 && formData.serviceCode === '90837') {
        alerts.push({
          type: 'warning' as const,
          icon: AlertTriangle,
          title: 'Session Duration Mismatch',
          message: `Session duration (${formData.duration} min) may not meet requirements for CPT code ${formData.serviceCode} (60 min target).`
        });
      }
    }

    // Intervention suggestions based on diagnosis
    if (formData.primaryDiagnosis) {
      if (formData.primaryDiagnosis.toLowerCase().includes('anxiety')) {
        alerts.push({
          type: 'info' as const,
          icon: Lightbulb,
          title: 'Evidence-Based Interventions',
          message: 'Consider CBT techniques, exposure therapy, or mindfulness-based interventions for anxiety disorders.',
          actions: ['Cognitive restructuring', 'Progressive muscle relaxation', 'Breathing exercises']
        });
      } else if (formData.primaryDiagnosis.toLowerCase().includes('depression')) {
        alerts.push({
          type: 'info' as const,
          icon: Lightbulb,
          title: 'Evidence-Based Interventions',
          message: 'Consider CBT, behavioral activation, or interpersonal therapy for depression.',
          actions: ['Activity scheduling', 'Cognitive challenging', 'Social skills training']
        });
      }
    }

    // Medication considerations
    if (formData.medicationsContent && formData.medicationsContent.toLowerCase().includes('side effect')) {
      alerts.push({
        type: 'warning' as const,
        icon: Heart,
        title: 'Medication Side Effects Noted',
        message: 'Side effects documented. Consider discussing with prescribing physician.',
        actions: ['Review medication compliance', 'Document specific side effects', 'Consider referral to psychiatrist']
      });
    }

    return alerts;
  };

  const alerts = generateAlerts();

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {alerts.map((alert, index) => {
        const Icon = alert.icon;
        return (
          <Alert key={index} className={
            alert.type === 'error' ? 'border-red-200 bg-red-50' :
            alert.type === 'warning' ? 'border-amber-200 bg-amber-50' :
            'border-blue-200 bg-blue-50'
          }>
            <Icon className={`h-4 w-4 ${
              alert.type === 'error' ? 'text-red-600' :
              alert.type === 'warning' ? 'text-amber-600' :
              'text-blue-600'
            }`} />
            <AlertDescription>
              <div className="font-medium mb-1">{alert.title}</div>
              <div className="text-sm mb-2">{alert.message}</div>
              {alert.actions && (
                <div className="flex flex-wrap gap-2">
                  {alert.actions.map((action, actionIndex) => (
                    <span
                      key={actionIndex}
                      className={`text-xs px-2 py-1 rounded ${
                        alert.type === 'error' ? 'bg-red-100 text-red-700' :
                        alert.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {action}
                    </span>
                  ))}
                </div>
              )}
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
};

export default ClinicalAlerts;
