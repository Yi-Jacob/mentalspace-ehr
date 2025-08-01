
import React from 'react';
import { InputField } from '@/components/basic/input';
import { SelectField } from '@/components/basic/select';
import { DateInput } from '@/components/basic/date-input';
import { Button } from '@/components/basic/button';
import { Trash2 } from 'lucide-react';
import { InsuranceInfo } from '@/types/clientType';
import { SUBSCRIBER_RELATIONSHIP_OPTIONS } from '@/types/enums/clientEnum';
import CategorySection from '@/components/basic/CategorySection';

interface BillingTabProps {
  insuranceInfo: InsuranceInfo[];
  setInsuranceInfo: React.Dispatch<React.SetStateAction<InsuranceInfo[]>>;
}

export const BillingTab: React.FC<BillingTabProps> = ({ 
  insuranceInfo, 
  setInsuranceInfo 
}) => {
  const addInsurance = (type: 'Primary' | 'Secondary') => {
    setInsuranceInfo([...insuranceInfo, {
      insuranceType: type,
      insuranceCompany: '',
      policyNumber: '',
      groupNumber: '',
      subscriberName: '',
      subscriberRelationship: '',
      subscriberDob: '',
      effectiveDate: '',
      terminationDate: '',
      copayAmount: 0,
      deductibleAmount: 0,
    }]);
  };

  const updateInsurance = (index: number, field: keyof InsuranceInfo, value: string | number) => {
    const updated = [...insuranceInfo];
    updated[index] = { ...updated[index], [field]: value };
    setInsuranceInfo(updated);
  };

  const removeInsurance = (index: number) => {
    setInsuranceInfo(insuranceInfo.filter((_, i) => i !== index));
  };

  const hasPrimary = insuranceInfo.some(ins => ins.insuranceType === 'Primary');
  const hasSecondary = insuranceInfo.some(ins => ins.insuranceType === 'Secondary');

  return (
    <div className="space-y-6">
      <CategorySection
        title="Insurance Information"
        description="Patient insurance details and billing information"
      >
        <div className="space-y-6">
          <div className="flex gap-3">
            {!hasPrimary && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => addInsurance('Primary')}
              >
                Add Primary Insurance
              </Button>
            )}
            {!hasSecondary && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => addInsurance('Secondary')}
              >
                Add Secondary Insurance
              </Button>
            )}
          </div>

          {insuranceInfo.map((insurance, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-800">
                  {insurance.insuranceType} Insurance
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInsurance(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Insurance Company"
                  value={insurance.insuranceCompany}
                  onChange={(e) => updateInsurance(index, 'insuranceCompany', e.target.value)}
                  required
                />

                <InputField
                  label="Policy Number"
                  value={insurance.policyNumber}
                  onChange={(e) => updateInsurance(index, 'policyNumber', e.target.value)}
                />

                <InputField
                  label="Group Number"
                  value={insurance.groupNumber}
                  onChange={(e) => updateInsurance(index, 'groupNumber', e.target.value)}
                />

                <InputField
                  label="Subscriber Name"
                  value={insurance.subscriberName}
                  onChange={(e) => updateInsurance(index, 'subscriberName', e.target.value)}
                />

                <SelectField
                  label="Subscriber Relationship"
                  value={insurance.subscriberRelationship}
                  onValueChange={(value) => updateInsurance(index, 'subscriberRelationship', value)}
                  placeholder="Select Relationship"
                  options={SUBSCRIBER_RELATIONSHIP_OPTIONS}
                />

                <DateInput
                  label="Subscriber Date of Birth"
                  value={insurance.subscriberDob}
                  onChange={(value) => updateInsurance(index, 'subscriberDob', value)}
                />

                <DateInput
                  label="Effective Date"
                  value={insurance.effectiveDate}
                  onChange={(value) => updateInsurance(index, 'effectiveDate', value)}
                />

                <DateInput
                  label="Termination Date"
                  value={insurance.terminationDate}
                  onChange={(value) => updateInsurance(index, 'terminationDate', value)}
                />

                <InputField
                  label="Copay Amount ($)"
                  type="number"
                  step="0.01"
                  value={insurance.copayAmount}
                  onChange={(e) => updateInsurance(index, 'copayAmount', parseFloat(e.target.value) || 0)}
                />

                <InputField
                  label="Deductible Amount ($)"
                  type="number"
                  step="0.01"
                  value={insurance.deductibleAmount}
                  onChange={(e) => updateInsurance(index, 'deductibleAmount', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          ))}
        </div>
      </CategorySection>
    </div>
  );
};
