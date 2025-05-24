
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onClientAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    preferred_name: '',
    pronouns: '',
    date_of_birth: '',
    // Contact Info
    email: '',
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    zip_code: '',
    timezone: 'Not Set',
    // Demographics
    administrative_sex: '',
    gender_identity: '',
    sexual_orientation: '',
    race: '',
    ethnicity: '',
    languages: '',
    marital_status: '',
    employment_status: '',
    religious_affiliation: '',
    smoking_status: '',
    // Settings
    appointment_reminders: 'Default Practice Setting',
    hipaa_signed: false,
    pcp_release: 'Not set',
    patient_comments: '',
  });

  const [phoneNumbers, setPhoneNumbers] = useState([
    { type: 'Mobile', number: '', message_preference: 'No messages' }
  ]);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, saveAndCreateAnother = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insert client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert([formData])
        .select()
        .single();

      if (clientError) {
        throw clientError;
      }

      // Insert phone numbers
      if (phoneNumbers.some(phone => phone.number.trim())) {
        const phoneData = phoneNumbers
          .filter(phone => phone.number.trim())
          .map(phone => ({
            client_id: clientData.id,
            phone_type: phone.type,
            phone_number: phone.number,
            message_preference: phone.message_preference,
          }));

        const { error: phoneError } = await supabase
          .from('client_phone_numbers')
          .insert(phoneData);

        if (phoneError) {
          console.error('Error inserting phone numbers:', phoneError);
        }
      }

      toast({
        title: "Success",
        description: "Client added successfully",
      });

      if (saveAndCreateAnother) {
        // Reset form for new client
        setFormData({
          first_name: '',
          middle_name: '',
          last_name: '',
          suffix: '',
          preferred_name: '',
          pronouns: '',
          date_of_birth: '',
          email: '',
          address_1: '',
          address_2: '',
          city: '',
          state: '',
          zip_code: '',
          timezone: 'Not Set',
          administrative_sex: '',
          gender_identity: '',
          sexual_orientation: '',
          race: '',
          ethnicity: '',
          languages: '',
          marital_status: '',
          employment_status: '',
          religious_affiliation: '',
          smoking_status: '',
          appointment_reminders: 'Default Practice Setting',
          hipaa_signed: false,
          pcp_release: 'Not set',
          patient_comments: '',
        });
        setPhoneNumbers([{ type: 'Mobile', number: '', message_preference: 'No messages' }]);
      } else {
        onClientAdded();
      }
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Error",
        description: "Failed to add client",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, { type: 'Home', number: '', message_preference: 'No messages' }]);
  };

  const updatePhoneNumber = (index: number, field: string, value: string) => {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900">Add New Patient</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="middle_name">Middle Name</Label>
                    <Input
                      id="middle_name"
                      value={formData.middle_name}
                      onChange={(e) => setFormData({...formData, middle_name: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="suffix">Suffix</Label>
                    <Input
                      id="suffix"
                      value={formData.suffix}
                      onChange={(e) => setFormData({...formData, suffix: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferred_name">Preferred Name</Label>
                    <Input
                      id="preferred_name"
                      value={formData.preferred_name}
                      onChange={(e) => setFormData({...formData, preferred_name: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="pronouns">Pronouns</Label>
                    <Input
                      id="pronouns"
                      value={formData.pronouns}
                      onChange={(e) => setFormData({...formData, pronouns: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              <div>
                <Label htmlFor="patient_comments">Patient Comments</Label>
                <Textarea
                  id="patient_comments"
                  value={formData.patient_comments}
                  onChange={(e) => setFormData({...formData, patient_comments: e.target.value})}
                  placeholder="Non-clinical information such as scheduling or billing comments..."
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
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
                          {/* Add all states here */}
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
                      <Select value={formData.timezone} onValueChange={(value) => setFormData({...formData, timezone: value})}>
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
                            onValueChange={(value) => updatePhoneNumber(index, 'type', value)}
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
                            onValueChange={(value) => updatePhoneNumber(index, 'message_preference', value)}
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
            </TabsContent>

            <TabsContent value="demographics" className="space-y-4">
              {/* Demographics form content would go here */}
              <Card>
                <CardHeader>
                  <CardTitle>Demographics</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Administrative Sex</Label>
                    <Select value={formData.administrative_sex} onValueChange={(value) => setFormData({...formData, administrative_sex: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Administrative Sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Gender Identity</Label>
                    <Select value={formData.gender_identity} onValueChange={(value) => setFormData({...formData, gender_identity: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender Identity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Trans Woman">Trans Woman</SelectItem>
                        <SelectItem value="Trans Man">Trans Man</SelectItem>
                        <SelectItem value="Non-binary">Non-binary</SelectItem>
                        <SelectItem value="Something else">Something else</SelectItem>
                        <SelectItem value="Unknown">Unknown</SelectItem>
                        <SelectItem value="Choose not to disclose">Choose not to disclose</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="race">Race</Label>
                    <Input
                      id="race"
                      value={formData.race}
                      onChange={(e) => setFormData({...formData, race: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ethnicity">Ethnicity</Label>
                    <Input
                      id="ethnicity"
                      value={formData.ethnicity}
                      onChange={(e) => setFormData({...formData, ethnicity: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="languages">Languages</Label>
                    <Input
                      id="languages"
                      value={formData.languages}
                      onChange={(e) => setFormData({...formData, languages: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label>Marital Status</Label>
                    <Select value={formData.marital_status} onValueChange={(value) => setFormData({...formData, marital_status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Marital Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Unmarried">Unmarried</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Domestic Partner">Domestic Partner</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Settings & Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Appointment Reminders</Label>
                    <Select value={formData.appointment_reminders} onValueChange={(value) => setFormData({...formData, appointment_reminders: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Default Practice Setting">Default Practice Setting</SelectItem>
                        <SelectItem value="No reminders">No reminders</SelectItem>
                        <SelectItem value="Email only">Email only</SelectItem>
                        <SelectItem value="Text (SMS) only">Text (SMS) only</SelectItem>
                        <SelectItem value="Text (SMS) and Email">Text (SMS) and Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hipaa_signed"
                      checked={formData.hipaa_signed}
                      onCheckedChange={(checked) => setFormData({...formData, hipaa_signed: !!checked})}
                    />
                    <Label htmlFor="hipaa_signed">HIPAA Notice of Privacy Practices signed</Label>
                  </div>

                  <div>
                    <Label>PCP Release</Label>
                    <Select value={formData.pcp_release} onValueChange={(value) => setFormData({...formData, pcp_release: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not set">Not set</SelectItem>
                        <SelectItem value="Patient consented to release information">Patient consented to release information</SelectItem>
                        <SelectItem value="Patient declined to release information">Patient declined to release information</SelectItem>
                        <SelectItem value="Not applicable">Not applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={(e) => handleSubmit(e, true)} 
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Saving...' : 'Save and Create Another'}
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Saving...' : 'Save New Patient'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
