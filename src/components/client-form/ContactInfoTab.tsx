
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ClientFormData, PhoneNumber } from '../AddClientModal';

interface ContactInfoTabProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
  phoneNumbers: PhoneNumber[];
  setPhoneNumbers: React.Dispatch<React.SetStateAction<PhoneNumber[]>>;
}

export const ContactInfoTab: React.FC<ContactInfoTabProps> = ({ 
  formData, 
  setFormData, 
  phoneNumbers, 
  setPhoneNumbers 
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

  return (
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
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="FL">Florida</SelectItem>
                <SelectItem value="IL">Illinois</SelectItem>
                {/* Add more states as needed */}
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
                <SelectItem value="Not Set">Not Set (Use practice time zone)</SelectItem>
                <SelectItem value="PT">Pacific Time</SelectItem>
                <SelectItem value="MT">Mountain Time</SelectItem>
                <SelectItem value="CT">Central Time</SelectItem>
                <SelectItem value="ET">Eastern Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Phone Numbers</Label>
          {phoneNumbers.map((phone, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
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
                <Input
                  placeholder="Phone number"
                  value={phone.number}
                  onChange={(e) => updatePhoneNumber(index, 'number', e.target.value)}
                />
              </div>
              <div className="flex-1">
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
                  variant="outline" 
                  size="sm"
                  onClick={() => removePhoneNumber(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addPhoneNumber}>
            Add Phone Number
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
