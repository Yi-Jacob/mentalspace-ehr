
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { ClientFormData, PhoneNumber, EmergencyContact, PrimaryCareProvider } from '@/types/client';

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

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 
  'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 
  'WV', 'WI', 'WY'
];

const TIMEZONE_OPTIONS = [
  { value: 'Not Set', label: 'Not Set (Use practice time zone)' },
  { value: 'HAST', label: 'HAST - Hawaii Aleutian Time, UTC-10 with DST' },
  { value: 'HAT', label: 'HAT - Hawaii Time, UTC-10 no DST' },
  { value: 'MART', label: 'MART - Marquesas Islands, UTC-9:30 no DST' },
  { value: 'AKT', label: 'AKT - Alaska Time, UTC-9 with DST' },
  { value: 'GAMT', label: 'GAMT - Gambier Islands Time, UTC-9 no DST' },
  { value: 'PT', label: 'PT - Pacific Time, UTC-8 with DST' },
  { value: 'PST', label: 'PST - Pacific Standard Time, UTC-8 no DST' },
  { value: 'MT', label: 'MT - Mountain Time, UTC-7 with DST' },
  { value: 'ART', label: 'ART - Arizona Mountain Time, UTC-7 no DST' },
  { value: 'CT', label: 'CT - Central Time, UTC-6 with DST' },
  { value: 'CST', label: 'CST - Cape Verde Time 1, UTC-6 no DST' },
  { value: 'ET', label: 'ET - Eastern Time, UTC-5 with DST' },
  { value: 'EST', label: 'EST - Quintana, Roo, Jamaica, Panama, UTC-5 no DST' },
  { value: 'AT', label: 'AT - Atlantic Time, UTC-4 with DST' },
  { value: 'AST', label: 'AST - Atlantic Standard Time, UTC-4 no DST' },
  { value: 'NT', label: 'NT - Newfoundland Time, UTC-3:30 no DST' },
  { value: 'EGT/EGST', label: 'EGT/EGST - East Greenland Time, UTC-1 with DST' },
  { value: 'CVT', label: 'CVT - Cape Verde Time 2, UTC-1 no DST' },
];

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
    setPhoneNumbers([...phoneNumbers, { type: 'Home', number: '', message_preference: 'No messages' }]);
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
      phone_number: '', 
      email: '', 
      is_primary: false 
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
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address_1">Address 1</Label>
              <Input
                id="address_1"
                value={formData.address_1}
                onChange={(e) => setFormData({...formData, address_1: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="address_2">Address 2</Label>
              <Input
                id="address_2"
                value={formData.address_2}
                onChange={(e) => setFormData({...formData, address_2: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="zip_code">Zip Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="timezone">Time Zone</Label>
              <Select value={formData.timezone} onValueChange={(value: ClientFormData['timezone']) => setFormData({...formData, timezone: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONE_OPTIONS.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Phone Numbers</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addPhoneNumber}>
            <Plus className="w-4 h-4 mr-2" />
            Add Phone
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {phoneNumbers.map((phone, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <Label>Type</Label>
                <Select 
                  value={phone.type} 
                  onValueChange={(value: PhoneNumber['type']) => updatePhoneNumber(index, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="Phone number"
                  value={phone.number}
                  onChange={(e) => updatePhoneNumber(index, 'number', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label>Message Preference</Label>
                <Select 
                  value={phone.message_preference} 
                  onValueChange={(value: PhoneNumber['message_preference']) => updatePhoneNumber(index, 'message_preference', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No messages">No messages</SelectItem>
                    <SelectItem value="Voice messages OK">Voice messages OK</SelectItem>
                    <SelectItem value="Text messages OK">Text messages OK</SelectItem>
                    <SelectItem value="Voice/Text messages OK">Voice/Text messages OK</SelectItem>
                  </SelectContent>
                </Select>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Emergency Contacts</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addEmergencyContact}>
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <div>
                  <Label>Name</Label>
                  <Input
                    value={contact.name}
                    onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Relationship</Label>
                  <Input
                    value={contact.relationship}
                    onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={contact.phone_number}
                    onChange={(e) => updateEmergencyContact(index, 'phone_number', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={contact.email}
                    onChange={(e) => updateEmergencyContact(index, 'email', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Primary Care Provider</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Provider Name</Label>
            <Input
              value={primaryCareProvider.provider_name}
              onChange={(e) => setPrimaryCareProvider({...primaryCareProvider, provider_name: e.target.value})}
            />
          </div>
          <div>
            <Label>Practice Name</Label>
            <Input
              value={primaryCareProvider.practice_name}
              onChange={(e) => setPrimaryCareProvider({...primaryCareProvider, practice_name: e.target.value})}
            />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input
              value={primaryCareProvider.phone_number}
              onChange={(e) => setPrimaryCareProvider({...primaryCareProvider, phone_number: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Address</Label>
            <Input
              value={primaryCareProvider.address}
              onChange={(e) => setPrimaryCareProvider({...primaryCareProvider, address: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
