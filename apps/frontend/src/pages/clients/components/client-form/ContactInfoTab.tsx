
import React from 'react';
import { InputField } from '@/components/basic/input';
import { SelectField } from '@/components/basic/select';
import { Button } from '@/components/basic/button';
import { Trash2, Plus } from 'lucide-react';
import { ClientFormData, PhoneNumber, EmergencyContact, PrimaryCareProvider } from '@/types/clientType';
import { 
  PHONE_TYPE_OPTIONS, 
  MESSAGE_PREFERENCE_OPTIONS, 
  US_STATES_OPTIONS, 
  TIMEZONE_OPTIONS 
} from '@/types/enums/clientEnum';
import CategorySection from '@/components/basic/CategorySection';

interface ContactInfoTabProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
  phoneNumbers: PhoneNumber[];
  setPhoneNumbers: React.Dispatch<React.SetStateAction<PhoneNumber[]>>;
  emergencyContacts: EmergencyContact[];
  setEmergencyContacts: React.Dispatch<React.SetStateAction<EmergencyContact[]>>;
  primaryCareProvider: PrimaryCareProvider;
  setPrimaryCareProvider: React.Dispatch<React.SetStateAction<PrimaryCareProvider>>;
}

export const ContactInfoTab: React.FC<ContactInfoTabProps> = ({ 
  formData, 
  setFormData, 
  phoneNumbers, 
  setPhoneNumbers,
  emergencyContacts,
  setEmergencyContacts,
  primaryCareProvider,
  setPrimaryCareProvider
}) => {
  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, { type: 'Home', number: '', messagePreference: 'No messages' }]);
  };

  const updatePhoneNumber = (index: number, field: keyof PhoneNumber, value: string) => {
    const updated = [...phoneNumbers];
    updated[index] = { ...updated[index], [field]: value };
    setPhoneNumbers(updated);
  };

  const removePhoneNumber = (index: number) => {
    if (phoneNumbers.length > 1) {
      setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
    }
  };

  const addEmergencyContact = () => {
    setEmergencyContacts([...emergencyContacts, { 
      name: '', 
      relationship: '', 
      phoneNumber: '', 
      email: '', 
      isPrimary: false 
    }]);
  };

  const updateEmergencyContact = (index: number, field: keyof EmergencyContact, value: string | boolean) => {
    const updated = [...emergencyContacts];
    updated[index] = { ...updated[index], [field]: value };
    setEmergencyContacts(updated);
  };

  const removeEmergencyContact = (index: number) => {
    if (emergencyContacts.length > 1) {
      setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <CategorySection
        title="Contact Information"
        description="Primary contact details and address information"
      >
        <div className="space-y-4">
          <InputField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="address_1"
              label="Address 1"
              value={formData.address1}
              onChange={(e) => setFormData({...formData, address1: e.target.value})}
            />

            <InputField
              id="address_2"
              label="Address 2"
              value={formData.address2}
              onChange={(e) => setFormData({...formData, address2: e.target.value})}
            />

            <InputField
              id="city"
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            />

            <SelectField
              label="State"
              value={formData.state}
              onValueChange={(value) => setFormData({...formData, state: value})}
              placeholder="Select State"
              options={US_STATES_OPTIONS}
            />

            <InputField
              id="zip_code"
              label="Zip Code"
              value={formData.zipCode}
              onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
            />

            <SelectField
              label="Time Zone"
              value={formData.timezone}
              onValueChange={(value: ClientFormData['timezone']) => setFormData({...formData, timezone: value})}
              placeholder="Select Time Zone"
              options={TIMEZONE_OPTIONS}
            />
          </div>
        </div>
      </CategorySection>

      <CategorySection
        title="Phone Numbers"
        description="Contact phone numbers and communication preferences"
        headerAction={
          <Button type="button" variant="outline" size="sm" onClick={addPhoneNumber}>
            <Plus className="w-4 h-4 mr-2" />
            Add Phone
          </Button>
        }
      >
        <div className="space-y-4">
          {phoneNumbers.map((phone, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <SelectField
                  label="Type"
                  value={phone.type}
                  onValueChange={(value: PhoneNumber['type']) => updatePhoneNumber(index, 'type', value)}
                  placeholder="Select Type"
                  options={PHONE_TYPE_OPTIONS}
                />
              </div>
              <div className="flex-2">
                <InputField
                  label="Phone Number"
                  placeholder="Phone number"
                  value={phone.number}
                  onChange={(e) => updatePhoneNumber(index, 'number', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <SelectField
                  label="Message Preference"
                  value={phone.messagePreference}
                  onValueChange={(value: PhoneNumber['messagePreference']) => updatePhoneNumber(index, 'messagePreference', value)}
                  placeholder="Select Preference"
                  options={MESSAGE_PREFERENCE_OPTIONS}
                />
              </div>
              {phoneNumbers.length > 1 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removePhoneNumber(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CategorySection>

      <CategorySection
        title="Emergency Contacts"
        description="Emergency contact information for the patient"
        headerAction={
          <Button type="button" variant="outline" size="sm" onClick={addEmergencyContact}>
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        }
      >
        <div className="space-y-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Contact {index + 1}</h4>
                {emergencyContacts.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeEmergencyContact(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField
                  label="Name"
                  value={contact.name}
                  onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                />
                <InputField
                  label="Relationship"
                  value={contact.relationship}
                  onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                />
                <InputField
                  label="Phone Number"
                  value={contact.phoneNumber}
                  onChange={(e) => updateEmergencyContact(index, 'phoneNumber', e.target.value)}
                />
                <InputField
                  label="Email"
                  type="email"
                  value={contact.email}
                  onChange={(e) => updateEmergencyContact(index, 'email', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </CategorySection>

      <CategorySection
        title="Primary Care Provider"
        description="Primary care provider information"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Provider Name"
            value={primaryCareProvider.providerName}
            onChange={(e) => setPrimaryCareProvider({...primaryCareProvider, providerName: e.target.value})}
          />
          <InputField
            label="Practice Name"
            value={primaryCareProvider.practiceName}
            onChange={(e) => setPrimaryCareProvider({...primaryCareProvider, practiceName: e.target.value})}
          />
          <InputField
            label="Phone Number"
            value={primaryCareProvider.phoneNumber}
            onChange={(e) => setPrimaryCareProvider({...primaryCareProvider, phoneNumber: e.target.value})}
          />
          <div className="md:col-span-2">
            <InputField
              label="Address"
              value={primaryCareProvider.address}
              onChange={(e) => setPrimaryCareProvider({...primaryCareProvider, address: e.target.value})}
            />
          </div>
        </div>
      </CategorySection>
    </div>
  );
};
