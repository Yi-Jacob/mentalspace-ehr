
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
                  <h4 className="font-semibold text-lg">{insurance.insurance_type || 'Not specified'} Insurance</h4>
                  <Badge variant="outline">{insurance.insurance_company || 'Not provided'}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Policy Number</label>
                    <div className="text-foreground">{insurance.policy_number || 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Group Number</label>
                    <div className="text-foreground">{insurance.group_number || 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Subscriber Name</label>
                    <div className="text-foreground">{insurance.subscriber_name || 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Subscriber Relationship</label>
                    <div className="text-foreground">{insurance.subscriber_relationship || 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Subscriber DOB</label>
                    <div className="text-foreground">{insurance.subscriber_dob ? new Date(insurance.subscriber_dob).toLocaleDateString() : 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Effective Date</label>
                    <div className="text-foreground">{insurance.effective_date ? new Date(insurance.effective_date).toLocaleDateString() : 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Termination Date</label>
                    <div className="text-foreground">{insurance.termination_date ? new Date(insurance.termination_date).toLocaleDateString() : 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Copay Amount</label>
                    <div className="text-foreground">{insurance.copay_amount ? `$${insurance.copay_amount}` : 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Deductible Amount</label>
                    <div className="text-foreground">{insurance.deductible_amount ? `$${insurance.deductible_amount}` : 'Not provided'}</div>
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
