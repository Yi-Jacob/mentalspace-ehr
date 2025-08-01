
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { InsuranceInfo } from '@/types/clientType';

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
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Policy Number</label>
                    <div className="text-foreground">{insurance.policyNumber || 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Group Number</label>
                    <div className="text-foreground">{insurance.groupNumber || 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Subscriber Name</label>
                    <div className="text-foreground">{insurance.subscriberName || 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Subscriber Relationship</label>
                    <div className="text-foreground">{insurance.subscriberRelationship || 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Subscriber DOB</label>
                    <div className="text-foreground">{insurance.subscriberDob ? new Date(insurance.subscriberDob).toLocaleDateString() : 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Effective Date</label>
                    <div className="text-foreground">{insurance.effectiveDate ? new Date(insurance.effectiveDate).toLocaleDateString() : 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Termination Date</label>
                    <div className="text-foreground">{insurance.terminationDate ? new Date(insurance.terminationDate).toLocaleDateString() : 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Copay Amount</label>
                    <div className="text-foreground">{insurance.copayAmount ? `$${insurance.copayAmount}` : 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Deductible Amount</label>
                    <div className="text-foreground">{insurance.deductibleAmount ? `$${insurance.deductibleAmount}` : 'Not provided'}</div>
                  </div>
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
          <div className="text-center py-8 text-muted-foreground">
            No insurance information found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
