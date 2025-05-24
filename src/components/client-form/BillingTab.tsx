
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { InsuranceInfo } from '../AddClientModal';

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
      insurance_type: type,
      insurance_company: '',
      policy_number: '',
      group_number: '',
      subscriber_name: '',
      subscriber_relationship: '',
      subscriber_dob: '',
      effective_date: '',
      termination_date: '',
      copay_amount: 0,
      deductible_amount: 0,
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

  const hasPrimary = insuranceInfo.some(ins => ins.insurance_type === 'Primary');
  const hasSecondary = insuranceInfo.some(ins => ins.insurance_type === 'Secondary');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Insurance Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  {insurance.insurance_type} Insurance
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInsurance(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Insurance Company *</Label>
                  <Input
                    value={insurance.insurance_company}
                    onChange={(e) => updateInsurance(index, 'insurance_company', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>Policy Number</Label>
                  <Input
                    value={insurance.policy_number}
                    onChange={(e) => updateInsurance(index, 'policy_number', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Group Number</Label>
                  <Input
                    value={insurance.group_number}
                    onChange={(e) => updateInsurance(index, 'group_number', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Subscriber Name</Label>
                  <Input
                    value={insurance.subscriber_name}
                    onChange={(e) => updateInsurance(index, 'subscriber_name', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Subscriber Relationship</Label>
                  <Select 
                    value={insurance.subscriber_relationship} 
                    onValueChange={(value) => updateInsurance(index, 'subscriber_relationship', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Self">Self</SelectItem>
                      <SelectItem value="Spouse">Spouse</SelectItem>
                      <SelectItem value="Child">Child</SelectItem>
                      <SelectItem value="Parent">Parent</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Subscriber Date of Birth</Label>
                  <Input
                    type="date"
                    value={insurance.subscriber_dob}
                    onChange={(e) => updateInsurance(index, 'subscriber_dob', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Effective Date</Label>
                  <Input
                    type="date"
                    value={insurance.effective_date}
                    onChange={(e) => updateInsurance(index, 'effective_date', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Termination Date</Label>
                  <Input
                    type="date"
                    value={insurance.termination_date}
                    onChange={(e) => updateInsurance(index, 'termination_date', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Copay Amount ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={insurance.copay_amount}
                    onChange={(e) => updateInsurance(index, 'copay_amount', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label>Deductible Amount ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={insurance.deductible_amount}
                    onChange={(e) => updateInsurance(index, 'deductible_amount', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
