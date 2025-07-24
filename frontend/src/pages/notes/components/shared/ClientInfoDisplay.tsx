
import React from 'react';
import { ClientInfo } from '@/types/note';

interface ClientInfoDisplayProps {
  clientData?: ClientInfo;
}

const ClientInfoDisplay: React.FC<ClientInfoDisplayProps> = ({ clientData }) => {
  if (!clientData) {
    return (
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Client Information</h3>
        <p className="text-blue-700">Client information will be loaded automatically.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Client Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Full Name</label>
          <p className="text-gray-900">{`${clientData.firstName} ${clientData.lastName}`}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Date of Birth</label>
          <p className="text-gray-900">{clientData.dateOfBirth || 'Not provided'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Address</label>
          <p className="text-gray-900">
            {clientData.address1 ? 
              `${clientData.address1}${clientData.address2 ? `, ${clientData.address2}` : ''}, ${clientData.city || ''} ${clientData.state || ''} ${clientData.zipCode || ''}`.trim() 
              : 'Not provided'
            }
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-1">Gender Identity</label>
          <p className="text-gray-900">{clientData.genderIdentity || 'Not provided'}</p>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoDisplay;
