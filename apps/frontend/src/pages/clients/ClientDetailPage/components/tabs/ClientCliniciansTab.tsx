
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { ClientFormData } from '@/types/clientType';

interface ClientCliniciansTabProps {
  client: ClientFormData;
}

export const ClientCliniciansTab: React.FC<ClientCliniciansTabProps> = ({ client }) => {
  const clientWithStaff = client as ClientFormData & { 
    assignedClinician?: { 
      id: string; 
      name: string;
      formalName?: string;
      jobTitle?: string;
      department?: string;
      clinicianType?: string;
      licenseNumber?: string;
      licenseState?: string;
      npiNumber?: string;
      phoneNumber?: string;
      email?: string;
    } | null;
  };

  const formatClinicianInfo = () => {
    if (!clientWithStaff.assignedClinician) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">No Clinician Assigned</div>
          <div className="text-sm text-gray-400">This client has not been assigned to a clinician yet.</div>
        </div>
      );
    }

    const clinician = clientWithStaff.assignedClinician;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600">Full Name</label>
            <div className="text-lg font-semibold text-gray-900">
              {clinician.formalName || clinician.name}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Professional Title</label>
            <div className="text-gray-900">
              {clinician.jobTitle || 'Not specified'}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Department</label>
            <div className="text-gray-900">
              {clinician.department || 'Not specified'}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Clinician Type</label>
            <div className="text-gray-900">
              {clinician.clinicianType || 'Not specified'}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">License Number</label>
            <div className="text-gray-900 font-mono">
              {clinician.licenseNumber || 'Not provided'}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">License State</label>
            <div className="text-gray-900">
              {clinician.licenseState || 'Not specified'}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">NPI Number</label>
            <div className="text-gray-900 font-mono">
              {clinician.npiNumber || 'Not provided'}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Phone Number</label>
            <div className="text-gray-900">
              {clinician.phoneNumber || 'Not provided'}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <div className="text-gray-900">
              {clinician.email || 'Not provided'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assigned Clinician</CardTitle>
        <p className="text-sm text-gray-600">
          Professional information for the clinician assigned to this client
        </p>
      </CardHeader>
      <CardContent>
        {formatClinicianInfo()}
      </CardContent>
    </Card>
  );
};
