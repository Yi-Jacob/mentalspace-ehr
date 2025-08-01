
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { InsuranceInfo } from '@/types/clientType';
import { InfoDisplay } from '../shared/InfoDisplay';
import { formatDate, formatCurrency } from '@/utils/dateUtils';
import { SimpleEmptyState } from '@/components/basic/empty-state';

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
                  <h4 className="font-semibold text-lg">{insurance.insuranceType || 'Not specified'} Insurance</h4>
                  <Badge variant="outline">{insurance.insuranceCompany || 'Not provided'}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoDisplay label="Policy Number" value={insurance.policyNumber} />
                  <InfoDisplay label="Group Number" value={insurance.groupNumber} />
                  <InfoDisplay label="Subscriber Name" value={insurance.subscriberName} />
                  <InfoDisplay label="Subscriber Relationship" value={insurance.subscriberRelationship} />
                  <InfoDisplay label="Subscriber DOB" value={formatDate(insurance.subscriberDob)} />
                  <InfoDisplay label="Effective Date" value={formatDate(insurance.effectiveDate)} />
                  <InfoDisplay label="Termination Date" value={formatDate(insurance.terminationDate)} />
                  <InfoDisplay label="Copay Amount" value={formatCurrency(insurance.copayAmount)} />
                  <InfoDisplay label="Deductible Amount" value={formatCurrency(insurance.deductibleAmount)} />
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="text-foreground">
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SimpleEmptyState message="No insurance information found." />
        )}
      </CardContent>
    </Card>
  );
};
