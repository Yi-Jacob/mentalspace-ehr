import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { ClientFormData, PhoneNumber, EmergencyContact, PrimaryCareProvider } from '@/types/clientType';
import { InfoDisplay, InfoSection } from '@/components/basic/InfoDisplay';
import { formatDateOfBirth, formatAge, formatDate } from '@/utils/dateUtils';
import { Phone, MapPin } from 'lucide-react';

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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoSection title="Personal Information">
            <InfoDisplay 
              label="Full Name" 
              value={[client.firstName, client.middleName, client.lastName, client.suffix].filter(Boolean).join(' ')} 
            />
            <InfoDisplay label="Preferred Name" value={client.preferredName} />
            <InfoDisplay label="Pronouns" value={client.pronouns} />
            <InfoDisplay 
              label="Date of Birth" 
              value={client.dateOfBirth ? `${formatDateOfBirth(client.dateOfBirth)} (${formatAge(client.dateOfBirth)})` : null} 
            />
            <InfoDisplay label="Gender Identity" value={client.genderIdentity} />
            <InfoDisplay label="Administrative Sex" value={client.administrativeSex} />
            <InfoDisplay label="Sexual Orientation" value={client.sexualOrientation} />
            <InfoDisplay label="Race" value={client.race} />
            <InfoDisplay label="Ethnicity" value={client.ethnicity} />
            <InfoDisplay label="Languages" value={client.languages} />
            <InfoDisplay label="Marital Status" value={client.maritalStatus} />
            <InfoDisplay label="Employment Status" value={client.employmentStatus} />
            <InfoDisplay label="Religious Affiliation" value={client.religiousAffiliation} />
            <InfoDisplay label="Smoking Status" value={client.smokingStatus} />
          </InfoSection>

          <InfoSection title="Contact Information">
            <InfoDisplay label="Email" value={client.email} />
            
                         <div>
               <label className="text-sm font-medium text-gray-500 block mb-2">Phone Numbers</label>
               {phoneNumbers.length > 0 ? (
                 <div className="space-y-2">
                   {phoneNumbers.map((phone, index) => (
                     <div key={index} className="flex items-center space-x-2 text-sm">
                       <Phone className="h-4 w-4 text-gray-400" />
                       <span className="font-medium text-gray-900">{phone.type}:</span>
                       <span className="text-gray-700">{phone.number}</span>
                       {phone.messagePreference !== 'No messages' && (
                         <span className="text-gray-500 text-xs">({phone.messagePreference})</span>
                       )}
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-gray-400 italic text-sm">Not provided</div>
               )}
             </div>
            
                         <div>
               <label className="text-sm font-medium text-gray-500 block mb-2">Address</label>
               <div className="text-sm">
                 {client.address1 || client.city || client.state ? (
                   <div className="space-y-1">
                     <div className="flex items-start space-x-2">
                       <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                       <div>
                         <div className="text-gray-900">{client.address1 || 'No street address'}</div>
                         {client.address2 && <div className="text-gray-700">{client.address2}</div>}
                         <div className="text-gray-700">
                           {[client.city || 'No city', client.state || 'No state', client.zipCode || 'No zip'].join(', ')}
                         </div>
                       </div>
                     </div>
                   </div>
                 ) : (
                   <div className="text-gray-400 italic">Not provided</div>
                 )}
               </div>
             </div>
            
            <InfoDisplay 
              label="Timezone" 
              value={client.timezone && client.timezone !== 'Not Set' ? client.timezone : 'Not set'} 
            />
            <InfoDisplay label="Appointment Reminders" value={client.appointmentReminders} />
            <InfoDisplay 
              label="HIPAA Signed" 
              value={client.hipaaSigned ? 'Yes' : 'No'} 
            />
            <InfoDisplay label="PCP Release" value={client.pcpRelease} />
          </InfoSection>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Emergency Contacts</h3>
          {emergencyContacts.length > 0 ? (
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoDisplay label="Name" value={contact.name} />
                    <InfoDisplay label="Relationship" value={contact.relationship} />
                    <InfoDisplay label="Phone" value={contact.phoneNumber} />
                    <InfoDisplay label="Email" value={contact.email} />
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
                <InfoDisplay label="Provider Name" value={primaryCareProvider.providerName} />
                <InfoDisplay label="Practice Name" value={primaryCareProvider.practiceName} />
                <InfoDisplay label="Phone" value={primaryCareProvider.phoneNumber} />
                <InfoDisplay label="Address" value={primaryCareProvider.address} />
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
