import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Stethoscope } from 'lucide-react';
import { ClientFormData } from '@/types/clientType';

interface ClientCliniciansTabProps {
  client: ClientFormData;
}

export const ClientCliniciansTab: React.FC<ClientCliniciansTabProps> = ({ client }) => {
  const clientWithStaff = client as ClientFormData & { 
    clinicians?: { 
      id: string;
      clinician: {
        id: string;
        formalName?: string;
        jobTitle?: string;
        department?: string;
        clinicianType?: string;
        licenseNumber?: string;
        licenseState?: string;
        npiNumber?: string;
        phoneNumber?: string;
        user: {
          firstName: string;
          lastName: string;
          middleName?: string;
          email: string;
        };
      };
    }[];
  };

  const formatClinicianInfo = () => {
    if (!clientWithStaff.clinicians || clientWithStaff.clinicians.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">No Clinicians Assigned</div>
          <div className="text-sm text-gray-400">This client has not been assigned to any clinicians yet.</div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {clientWithStaff.clinicians.map((assignment) => {
          const clinician = assignment.clinician;
          const fullName = clinician.formalName || 
            `${clinician.user.firstName} ${clinician.user.middleName || ''} ${clinician.user.lastName}`.trim();
          return (
            <div key={assignment.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{fullName}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {clinician.jobTitle && (
                      <div>
                        <span className="font-medium text-gray-600">Title:</span>
                        <span className="ml-2 text-gray-900">{clinician.jobTitle}</span>
                      </div>
                    )}
                    
                    {clinician.department && (
                      <div>
                        <span className="font-medium text-gray-600">Department:</span>
                        <span className="ml-2 text-gray-900">{clinician.department}</span>
                      </div>
                    )}
                    
                    {clinician.clinicianType && (
                      <div>
                        <span className="font-medium text-gray-600">Type:</span>
                        <span className="ml-2 text-gray-900">{clinician.clinicianType}</span>
                      </div>
                    )}
                    
                    {clinician.licenseNumber && (
                      <div>
                        <span className="font-medium text-gray-600">License #:</span>
                        <span className="ml-2 text-gray-900">{clinician.licenseNumber}</span>
                      </div>
                    )}
                    
                    {clinician.licenseState && (
                      <div>
                        <span className="font-medium text-gray-600">License State:</span>
                        <span className="ml-2 text-gray-900">{clinician.licenseState}</span>
                      </div>
                    )}
                    
                    {clinician.npiNumber && (
                      <div>
                        <span className="font-medium text-gray-600">NPI #:</span>
                        <span className="ml-2 text-gray-900">{clinician.npiNumber}</span>
                      </div>
                    )}
                    
                    {clinician.phoneNumber && (
                      <div>
                        <span className="font-medium text-gray-600">Phone:</span>
                        <span className="ml-2 text-gray-900">{clinician.phoneNumber}</span>
                      </div>
                    )}
                    
                    {clinician.user.email && (
                      <div>
                        <span className="font-medium text-gray-600">Email:</span>
                        <span className="ml-2 text-gray-900">{clinician.user.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Stethoscope className="h-5 w-5" />
          <span>Assigned Clinicians</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {formatClinicianInfo()}
      </CardContent>
    </Card>
  );
};