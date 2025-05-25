import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClientFormData, PhoneNumber, EmergencyContact, PrimaryCareProvider } from '@/types/client';
import { format } from 'date-fns';

interface ClientInfoTabProps {
  client: ClientFormData;
  phoneNumbers: PhoneNumber[];
  emergencyContacts: EmergencyContact[];
  primaryCareProvider: PrimaryCareProvider | null;
}

export const ClientInfoTab: React.FC<ClientInfoTabProps> = ({
  client,
  phoneNumbers,
  emergencyContacts,
  primaryCareProvider
}) => {
  const formatDateOfBirth = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return '';
    
    // Parse the database date as YYYY-MM-DD and create a local date
    const parts = dateOfBirth.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // months are 0-indexed
      const day = parseInt(parts[2]);
      const date = new Date(year, month, day);
      
      console.log('ClientInfoTab - Original date string:', dateOfBirth);
      console.log('ClientInfoTab - Parsed date object:', date);
      console.log('ClientInfoTab - Formatted date:', format(date, 'M/d/yyyy'));
      
      return format(date, 'M/d/yyyy');
    }
    return dateOfBirth;
  };

  const formatAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return '';
    
    // Parse the database date as YYYY-MM-DD and create a local date
    const parts = dateOfBirth.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // months are 0-indexed
      const day = parseInt(parts[2]);
      const birthDate = new Date(year, month, day);
      
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return `${age - 1} years`;
      }
      return `${age} years`;
    }
    return '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                <div>{client.first_name} {client.middle_name} {client.last_name} {client.suffix}</div>
              </div>
              {client.preferred_name && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Preferred Name</label>
                  <div>{client.preferred_name}</div>
                </div>
              )}
              {client.pronouns && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Pronouns</label>
                  <div>{client.pronouns}</div>
                </div>
              )}
              {client.date_of_birth && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                  <div>{formatDateOfBirth(client.date_of_birth)} ({formatAge(client.date_of_birth)})</div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
            <div className="space-y-3">
              {client.email && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div>{client.email}</div>
                </div>
              )}
              
              {phoneNumbers.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Numbers</label>
                  <div className="space-y-1">
                    {phoneNumbers.map((phone, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{phone.type}:</span> {phone.number}
                        {phone.message_preference !== 'No messages' && (
                          <span className="text-gray-500 ml-2">({phone.message_preference})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {(client.address_1 || client.city || client.state) && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <div>
                    {client.address_1}<br />
                    {client.address_2 && <>{client.address_2}<br /></>}
                    {[client.city, client.state, client.zip_code].filter(Boolean).join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {emergencyContacts.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-4">Emergency Contacts</h3>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <div className="font-medium">{contact.name}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Relationship</label>
                      <div>{contact.relationship}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <div>{contact.phone_number}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <div>{contact.email}</div>
                    </div>
                  </div>
                  {contact.is_primary && (
                    <Badge variant="outline" className="mt-2">Primary Contact</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {primaryCareProvider && primaryCareProvider.provider_name && (
          <div>
            <h3 className="font-semibold text-lg mb-4">Primary Care Provider</h3>
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Provider Name</label>
                  <div className="font-medium">{primaryCareProvider.provider_name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Practice Name</label>
                  <div>{primaryCareProvider.practice_name}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <div>{primaryCareProvider.phone_number}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <div>{primaryCareProvider.address}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {client.patient_comments && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Comments</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {client.patient_comments}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
