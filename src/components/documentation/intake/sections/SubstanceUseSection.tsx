
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IntakeFormData } from '../IntakeAssessmentForm';

const SUBSTANCES = [
  'Alcohol',
  'Tobacco/Nicotine',
  'Cannabis',
  'Stimulants (cocaine, methamphetamine, etc.)',
  'Opioids (heroin, prescription pain medications, etc.)',
  'Sedatives/Hypnotics (benzodiazepines, sleep medications, etc.)',
  'Other Substances',
];

interface SubstanceUseSectionProps {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  clientData: any;
}

const SubstanceUseSection: React.FC<SubstanceUseSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const updateSubstanceHistory = (substance: string, field: string, value: any) => {
    const updated = {
      ...formData.substanceUseHistory,
      [substance]: {
        ...formData.substanceUseHistory[substance],
        [field]: value,
      },
    };
    updateFormData({ substanceUseHistory: updated });
  };

  const getSubstanceData = (substance: string) => {
    return formData.substanceUseHistory[substance] || {
      current: false,
      past: false,
      frequency: '',
      amount: '',
      notes: '',
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Substance Use History</Label>
        <div className="mt-4">
          <div className="flex items-center space-x-2 mb-6">
            <input
              type="checkbox"
              id="no-substance-use"
              checked={formData.noSubstanceUse}
              onChange={(e) => {
                updateFormData({ noSubstanceUse: e.target.checked });
                if (e.target.checked) {
                  updateFormData({ substanceUseHistory: {} });
                }
              }}
              className="rounded border-gray-300"
            />
            <Label htmlFor="no-substance-use" className="text-sm font-medium">
              No Substance Use Reported
            </Label>
          </div>

          {formData.noSubstanceUse ? (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-gray-600">
                  Client denies current use of substances. This will be documented in the intake assessment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {SUBSTANCES.map((substance) => {
                const data = getSubstanceData(substance);
                const hasUsage = data.current || data.past;

                return (
                  <Card key={substance}>
                    <CardHeader>
                      <CardTitle className="text-base">{substance}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Usage Pattern</Label>
                          <div className="flex space-x-6 mt-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`${substance}-current`}
                                checked={data.current}
                                onChange={(e) => 
                                  updateSubstanceHistory(substance, 'current', e.target.checked)
                                }
                                className="rounded border-gray-300"
                              />
                              <Label htmlFor={`${substance}-current`} className="text-sm">
                                Current Use
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`${substance}-past`}
                                checked={data.past}
                                onChange={(e) => 
                                  updateSubstanceHistory(substance, 'past', e.target.checked)
                                }
                                className="rounded border-gray-300"
                              />
                              <Label htmlFor={`${substance}-past`} className="text-sm">
                                Past Use
                              </Label>
                            </div>
                          </div>
                        </div>

                        {hasUsage && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`${substance}-frequency`}>Frequency</Label>
                              <Input
                                id={`${substance}-frequency`}
                                placeholder="e.g., Daily, Weekly, Monthly"
                                value={data.frequency}
                                onChange={(e) => 
                                  updateSubstanceHistory(substance, 'frequency', e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${substance}-amount`}>Amount</Label>
                              <Input
                                id={`${substance}-amount`}
                                placeholder="e.g., 1-2 drinks, 1 pack/day"
                                value={data.amount}
                                onChange={(e) => 
                                  updateSubstanceHistory(substance, 'amount', e.target.value)
                                }
                              />
                            </div>
                          </div>
                        )}

                        {hasUsage && (
                          <div>
                            <Label htmlFor={`${substance}-notes`}>Additional Notes</Label>
                            <Textarea
                              id={`${substance}-notes`}
                              placeholder="Any additional details about usage patterns, triggers, attempts to quit, etc."
                              value={data.notes}
                              onChange={(e) => 
                                updateSubstanceHistory(substance, 'notes', e.target.value)
                              }
                              rows={2}
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubstanceUseSection;
