import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { ClientFormData, PhoneNumber, EmergencyContact, PrimaryCareProvider } from '@/types/clientType';
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
                <div>{[client.firstName, client.middleName, client.lastName, client.suffix].filter(Boolean).join(' ') || 'Not provided'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Preferred Name</label>
                <div>{client.preferredName || 'Not provided'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Pronouns</label>
                <div>{client.pronouns || 'Not provided'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <div>{client.dateOfBirth ? `${formatDateOfBirth(client.dateOfBirth)} (${formatAge(client.dateOfBirth)})` : 'Not provided'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Gender Identity</label>
                <div>{client.genderIdentity || 'Not provided'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Administrative Sex</label>
                <div>{client.administrativeSex || 'Not provided'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Sexual Orientation</label>
                <div>{client.sexualOrientation || 'Not provided'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Race</label>
                <div>{client.race || 'Not provided'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Ethnicity</label>
                <div>{client.ethnicity || 'Not provided'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Languages</label>
                <div>{client.languages || 'Not provided'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Marital Status</label>
                <div>{client.maritalStatus || 'Not provided'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Employment Status</label>
                <div>{client.employmentStatus || 'Not provided'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Religious Affiliation</label>
                <div>{client.religiousAffiliation || 'Not provided'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Smoking Status</label>
                <div>{client.smokingStatus || 'Not provided'}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div>{client.email || 'Not provided'}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Phone Numbers</label>
                {phoneNumbers.length > 0 ? (
                  <div className="space-y-1">
                    {phoneNumbers.map((phone, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{phone.type}:</span> {phone.number}
                        {phone.messagePreference !== 'No messages' && (
                          <span className="text-gray-500 ml-2">({phone.messagePreference})</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>Not provided</div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Address</label>
                <div>
                  {client.address1 || client.city || client.state ? (
                    <>
                      {client.address1 || 'No street address'}<br />
                      {client.address2 && <>{client.address2}<br /></>}
                      {[client.city || 'No city', client.state || 'No state', client.zipCode || 'No zip'].join(', ')}
                    </>
                  ) : (
                    'Not provided'
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Timezone</label>
                <div>{client.timezone && client.timezone !== 'Not Set' ? client.timezone : 'Not set'}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Appointment Reminders</label>
                <div>{client.appointmentReminders || 'Default Practice Setting'}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">HIPAA Signed</label>
                <div>{client.hipaaSigned ? 'Yes' : 'No'}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">PCP Release</label>
                <div>{client.pcpRelease || 'Not set'}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Emergency Contacts</h3>
          {emergencyContacts.length > 0 ? (
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <div className="font-medium">{contact.name || 'Not provided'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Relationship</label>
                      <div>{contact.relationship || 'Not provided'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <div>{contact.phoneNumber || 'Not provided'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <div>{contact.email || 'Not provided'}</div>
                    </div>
                  </div>
                  {contact.isPrimary && (
                    <Badge variant="outline" className="mt-2">Primary Contact</Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 italic">No emergency contacts on file</div>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Primary Care Provider</h3>
          {primaryCareProvider && primaryCareProvider.providerName ? (
            <div className="border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Provider Name</label>
                  <div className="font-medium">{primaryCareProvider.providerName || 'Not provided'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Practice Name</label>
                  <div>{primaryCareProvider.practiceName || 'Not provided'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <div>{primaryCareProvider.phoneNumber || 'Not provided'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <div>{primaryCareProvider.address || 'Not provided'}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 italic">No primary care provider on file</div>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Comments</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {client.patientComments || 'No comments on file'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
