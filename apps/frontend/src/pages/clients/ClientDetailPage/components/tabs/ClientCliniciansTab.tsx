
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { ClientFormData } from '@/types/clientType';

interface ClientCliniciansTabProps {
  client: ClientFormData;
}

export const ClientCliniciansTab: React.FC<ClientCliniciansTabProps> = ({ client }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Clinicians</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Assigned Clinician</label>
            <div>{client.assignedClinicianId === 'unassigned' ? 'Unassigned' : client.assignedClinicianId}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
