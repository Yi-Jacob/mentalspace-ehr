
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { InputField } from '@/components/basic/input';
import { SelectField, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { DateInput } from '@/components/basic/date-input';
import { Button } from '@/components/basic/button';
import { Trash2 } from 'lucide-react';
import { InsuranceInfo } from '@/types/clientType';
import { SUBSCRIBER_RELATIONSHIP_OPTIONS } from '@/types/enums/clientEnum';
import CategorySection from '@/components/basic/CategorySection';
import { billingService, Payer } from '@/services/billingService';

interface BillingTabProps {
  insuranceInfo: InsuranceInfo[];
  setInsuranceInfo: React.Dispatch<React.SetStateAction<InsuranceInfo[]>>;
  clientDob?: string;
}

export const BillingTab: React.FC<BillingTabProps> = ({ 
  insuranceInfo, 
  setInsuranceInfo,
  clientDob
}) => {
  // Fetch payers for the dropdown
  const { data: payers = [], isLoading: payersLoading, error: payersError } = useQuery({
    queryKey: ['payers'],
    queryFn: () => billingService.getAllPayers(),
  });

  const addInsurance = (type: 'Primary' | 'Secondary') => {
    setInsuranceInfo([...insuranceInfo, {
      payerId: '',
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
    
    // Auto-populate DOB when "Self" is selected
    if (field === 'subscriberRelationship' && value === 'Self' && clientDob) {
      updated[index].subscriberDob = clientDob;
    }
    
    setInsuranceInfo(updated);
  };

  const handleNumericInput = (index: number, field: keyof InsuranceInfo, inputValue: string) => {
    // If the input is empty, set to 0
    if (inputValue === '') {
      updateInsurance(index, field, 0);
      return;
    }
    
    // Parse the numeric value
    const numericValue = parseFloat(inputValue);
    
    // If it's a valid number, update with the numeric value
    if (!isNaN(numericValue)) {
      updateInsurance(index, field, numericValue);
    }
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
                <div className="">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Insurance Company *
                  </label>
                  <Select 
                    value={insurance.payerId || 'none'} 
                    onValueChange={(value) => {
                      if (value === 'none') {
                        updateInsurance(index, 'payerId', '');
                      } else {
                        updateInsurance(index, 'payerId', value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Insurance Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select Insurance Company</SelectItem>
                      {payers.map(payer => (
                        <SelectItem key={payer.id} value={payer.id}>
                          {payer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
                  showAge={true}
                  showYearDropdown={true}
                />

                <DateInput
                  label="Effective Date"
                  value={insurance.effectiveDate}
                  onChange={(value) => updateInsurance(index, 'effectiveDate', value)}
                  showYearDropdown={true}
                />

                <DateInput
                  label="Termination Date"
                  value={insurance.terminationDate}
                  onChange={(value) => updateInsurance(index, 'terminationDate', value)}
                  showYearDropdown={true}
                />

                <InputField
                  label="Copay Amount ($)"
                  type="number"
                  step="0.01"
                  value={insurance.copayAmount === 0 ? '' : insurance.copayAmount}
                  onChange={(e) => handleNumericInput(index, 'copayAmount', e.target.value)}
                />

                <InputField
                  label="Deductible Amount ($)"
                  type="number"
                  step="0.01"
                  value={insurance.deductibleAmount === 0 ? '' : insurance.deductibleAmount}
                  onChange={(e) => handleNumericInput(index, 'deductibleAmount', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </CategorySection>
    </div>
  );
};
