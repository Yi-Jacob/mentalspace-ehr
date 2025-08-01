
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { InsuranceInfo } from '@/types/clientType';
import { InfoDisplay, InfoSection } from '../shared/InfoDisplay';
import { SimpleEmptyState } from '@/components/basic/empty-state';

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
          <InfoSection title="Insurance Information">
            {insuranceInfo.length > 0 ? (
              <div className="space-y-4">
                {insuranceInfo.map((insurance, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoDisplay label="Insurance Type" value={insurance.insuranceType} />
                      <InfoDisplay label="Insurance Company" value={insurance.insuranceCompany} />
                      <InfoDisplay label="Policy Number" value={insurance.policyNumber} />
                      <InfoDisplay label="Group Number" value={insurance.groupNumber} />
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
              <SimpleEmptyState message="No insurance information configured." />
            )}
          </InfoSection>

          <InfoSection title="Payment Preferences">
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoDisplay label="Preferred Payment Method" value="Not configured" />
                <InfoDisplay label="Auto-Pay Enabled" value="Not configured" />
                <InfoDisplay label="Billing Address" value="Not provided" />
                <InfoDisplay label="Billing Contact" value="Not provided" />
              </div>
            </div>
          </InfoSection>

          <InfoSection title="Statement Preferences">
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoDisplay label="Statement Delivery" value="Not configured" />
                <InfoDisplay label="Statement Frequency" value="Not configured" />
                <InfoDisplay label="Email Notifications" value="Not configured" />
                <InfoDisplay label="Paper Statements" value="Not configured" />
              </div>
            </div>
          </InfoSection>
        </div>
      </CardContent>
    </Card>
  );
};
