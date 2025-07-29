
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InsuranceInfo } from '@/types/client';

interface ClientBillingSettingsTabProps {
  insuranceInfo: InsuranceInfo[];
}

export const ClientBillingSettingsTab: React.FC<ClientBillingSettingsTabProps> = ({ insuranceInfo }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-4">Insurance Information</h4>
            {insuranceInfo.length > 0 ? (
              <div className="space-y-4">
                {insuranceInfo.map((insurance, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Insurance Type</label>
                        <div className="text-foreground">{insurance.insurance_type || 'Not provided'}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Insurance Company</label>
                        <div className="text-foreground">{insurance.insurance_company || 'Not provided'}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Policy Number</label>
                        <div className="text-foreground">{insurance.policy_number || 'Not provided'}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Group Number</label>
                        <div className="text-foreground">{insurance.group_number || 'Not provided'}</div>
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
              <div className="text-center py-8 text-muted-foreground border rounded-lg">
                No insurance information configured.
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-4">Payment Preferences</h4>
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Preferred Payment Method</label>
                  <div className="text-foreground">Not configured</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Auto-Pay Enabled</label>
                  <div className="text-foreground">Not configured</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Billing Address</label>
                  <div className="text-foreground">Not provided</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Billing Contact</label>
                  <div className="text-foreground">Not provided</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Statement Preferences</h4>
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Statement Delivery</label>
                  <div className="text-foreground">Not configured</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Statement Frequency</label>
                  <div className="text-foreground">Not configured</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Notifications</label>
                  <div className="text-foreground">Not configured</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Paper Statements</label>
                  <div className="text-foreground">Not configured</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
