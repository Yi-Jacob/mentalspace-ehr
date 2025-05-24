
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InsuranceInfo } from '@/types/client';

interface ClientBillingTabProps {
  insuranceInfo: InsuranceInfo[];
}

export const ClientBillingTab: React.FC<ClientBillingTabProps> = ({ insuranceInfo }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {insuranceInfo.length > 0 ? (
          <div className="space-y-6">
            {insuranceInfo.map((insurance, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-lg">{insurance.insurance_type} Insurance</h4>
                  <Badge variant="outline">{insurance.insurance_company}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insurance.policy_number && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Policy Number</label>
                      <div>{insurance.policy_number}</div>
                    </div>
                  )}
                  {insurance.group_number && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Group Number</label>
                      <div>{insurance.group_number}</div>
                    </div>
                  )}
                  {insurance.subscriber_name && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Subscriber</label>
                      <div>{insurance.subscriber_name} ({insurance.subscriber_relationship})</div>
                    </div>
                  )}
                  {insurance.effective_date && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Effective Date</label>
                      <div>{new Date(insurance.effective_date).toLocaleDateString()}</div>
                    </div>
                  )}
                  {insurance.copay_amount > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Copay</label>
                      <div>${insurance.copay_amount}</div>
                    </div>
                  )}
                  {insurance.deductible_amount > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Deductible</label>
                      <div>${insurance.deductible_amount}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No insurance information found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
