
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientFormData } from '@/types/client';

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
            <div>{client.assigned_clinician_id === 'unassigned' ? 'Unassigned' : client.assigned_clinician_id}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
