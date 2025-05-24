
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
        {insuranceInfo.length > 0 ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Insurance Information</h4>
              <div className="space-y-2">
                {insuranceInfo.map((insurance, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-medium">{insurance.insurance_type}: </span>
                      <span>{insurance.insurance_company}</span>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No billing settings configured.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
