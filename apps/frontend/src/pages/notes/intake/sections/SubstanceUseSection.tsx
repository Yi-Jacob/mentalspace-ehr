import React from 'react';
import { Label } from '@/components/basic/label';
import { RadioGroup, RadioGroupItem } from '@/components/basic/radio-group';
import { InputField } from '@/components/basic/input';
import { TextareaField } from '@/components/basic/textarea';
import { Checkbox } from '@/components/basic/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { IntakeFormData } from '@/types/noteType';
import { SUBSTANCES } from '@/types/enums/notesEnum';

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
            <Checkbox
              id="no-substance-use"
              checked={formData.noSubstanceUse}
              onCheckedChange={(checked) => {
                updateFormData({ noSubstanceUse: !!checked });
                if (checked) {
                  updateFormData({ substanceUseHistory: {} });
                }
              }}
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
                const data = getSubstanceData(substance.value);
                const hasUsage = data.current || data.past;

                return (
                  <Card key={substance.value}>
                    <CardHeader>
                      <CardTitle className="text-base">{substance.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Usage Pattern</Label>
                          <div className="flex space-x-6 mt-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`${substance.value}-current`}
                                checked={data.current}
                                onCheckedChange={(checked) => 
                                  updateSubstanceHistory(substance.value, 'current', checked)
                                }
                              />
                              <Label htmlFor={`${substance.value}-current`} className="text-sm">
                                Current Use
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`${substance.value}-past`}
                                checked={data.past}
                                onCheckedChange={(checked) => 
                                  updateSubstanceHistory(substance.value, 'past', checked)
                                }
                              />
                              <Label htmlFor={`${substance.value}-past`} className="text-sm">
                                Past Use
                              </Label>
                            </div>
                          </div>
                        </div>

                        {hasUsage && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                              id={`${substance.value}-frequency`}
                              label="Frequency"
                              placeholder="e.g., Daily, Weekly, Monthly"
                              value={data.frequency}
                              onChange={(e) => 
                                updateSubstanceHistory(substance.value, 'frequency', e.target.value)
                              }
                            />
                            <InputField
                              id={`${substance.value}-amount`}
                              label="Amount"
                              placeholder="e.g., 1-2 drinks, 1 pack/day"
                              value={data.amount}
                              onChange={(e) => 
                                updateSubstanceHistory(substance.value, 'amount', e.target.value)
                              }
                            />
                          </div>
                        )}

                        {hasUsage && (
                          <TextareaField
                            id={`${substance.value}-notes`}
                            label="Additional Notes"
                            placeholder="Any additional details about usage patterns, triggers, attempts to quit, etc."
                            value={data.notes}
                            onChange={(e) => 
                              updateSubstanceHistory(substance.value, 'notes', e.target.value)
                            }
                            rows={2}
                          />
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
