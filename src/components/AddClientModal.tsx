
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database } from '@/integrations/supabase/types';
import { BasicInfoTab } from './client-form/BasicInfoTab';
import { ContactInfoTab } from './client-form/ContactInfoTab';
import { DemographicsTab } from './client-form/DemographicsTab';
import { SettingsTab } from './client-form/SettingsTab';
import { BillingTab } from './client-form/BillingTab';

type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type PhoneInsert = Database['public']['Tables']['client_phone_numbers']['Insert'];
type EmergencyContactInsert = Database['public']['Tables']['client_emergency_contacts']['Insert'];
type InsuranceInsert = Database['public']['Tables']['client_insurance']['Insert'];
type PCPInsert = Database['public']['Tables']['client_primary_care_providers']['Insert'];

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: () => void;
}

export interface PhoneNumber {
  type: 'Mobile' | 'Home' | 'Work' | 'Other';
  number: string;
  message_preference: 'No messages' | 'Voice messages OK' | 'Text messages OK' | 'Voice/Text messages OK';
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone_number: string;
  email: string;
  is_primary: boolean;
}

export interface InsuranceInfo {
  insurance_type: 'Primary' | 'Secondary';
  insurance_company: string;
  policy_number: string;
  group_number: string;
  subscriber_name: string;
  subscriber_relationship: string;
  subscriber_dob: string;
  effective_date: string;
  termination_date: string;
  copay_amount: number;
  deductible_amount: number;
}

export interface PrimaryCareProvider {
  provider_name: string;
  practice_name: string;
  phone_number: string;
  address: string;
}

export interface ClientFormData {
  // Basic Info
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  preferred_name: string;
  pronouns: string;
  date_of_birth: string;
  assigned_clinician_id: string;
  // Contact Info
  email: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  zip_code: string;
  timezone: 'Not Set' | 'HAST' | 'HAT' | 'MART' | 'AKT' | 'GAMT' | 'PT' | 'PST' | 'MT' | 'ART' | 'CT' | 'CST' | 'ET' | 'EST' | 'AT' | 'AST' | 'NT' | 'EGT/EGST' | 'CVT';
  // Demographics
  administrative_sex: string;
  gender_identity: string;
  sexual_orientation: string;
  race: string;
  ethnicity: string;
  languages: string;
  marital_status: string;
  employment_status: string;
  religious_affiliation: string;
  smoking_status: string;
  // Settings
  appointment_reminders: 'Default Practice Setting' | 'No reminders' | 'Email only' | 'Text (SMS) only' | 'Text (SMS) and Email' | 'Text or Call, and Email';
  hipaa_signed: boolean;
  pcp_release: 'Not set' | 'Patient consented to release information' | 'Patient declined to release information' | 'Not applicable';
  patient_comments: string;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onClientAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    // Basic Info
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    preferred_name: '',
    pronouns: '',
    date_of_birth: '',
    assigned_clinician_id: '',
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

  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
    { type: 'Mobile', number: '', message_preference: 'No messages' }
  ]);

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: '', relationship: '', phone_number: '', email: '', is_primary: true }
  ]);

  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo[]>([]);

  const [primaryCareProvider, setPrimaryCareProvider] = useState<PrimaryCareProvider>({
    provider_name: '',
    practice_name: '',
    phone_number: '',
    address: ''
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, saveAndCreateAnother = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare client data with proper typing
      const clientData: ClientInsert = {
        first_name: formData.first_name,
        middle_name: formData.middle_name || null,
        last_name: formData.last_name,
        suffix: formData.suffix || null,
        preferred_name: formData.preferred_name || null,
        pronouns: formData.pronouns || null,
        date_of_birth: formData.date_of_birth || null,
        assigned_clinician_id: formData.assigned_clinician_id || null,
        email: formData.email || null,
        address_1: formData.address_1 || null,
        address_2: formData.address_2 || null,
        city: formData.city || null,
        state: formData.state ? (formData.state as Database['public']['Enums']['us_state']) : null,
        zip_code: formData.zip_code || null,
        timezone: formData.timezone,
        administrative_sex: formData.administrative_sex ? (formData.administrative_sex as Database['public']['Enums']['administrative_sex']) : null,
        gender_identity: formData.gender_identity ? (formData.gender_identity as Database['public']['Enums']['gender_identity']) : null,
        sexual_orientation: formData.sexual_orientation ? (formData.sexual_orientation as Database['public']['Enums']['sexual_orientation']) : null,
        race: formData.race || null,
        ethnicity: formData.ethnicity || null,
        languages: formData.languages || null,
        marital_status: formData.marital_status ? (formData.marital_status as Database['public']['Enums']['marital_status']) : null,
        employment_status: formData.employment_status ? (formData.employment_status as Database['public']['Enums']['employment_status']) : null,
        religious_affiliation: formData.religious_affiliation || null,
        smoking_status: formData.smoking_status ? (formData.smoking_status as Database['public']['Enums']['smoking_status']) : null,
        appointment_reminders: formData.appointment_reminders,
        hipaa_signed: formData.hipaa_signed,
        pcp_release: formData.pcp_release,
        patient_comments: formData.patient_comments || null,
      };

      // Insert client
      const { data: clientResult, error: clientError } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single();

      if (clientError) {
        throw clientError;
      }

      // Insert phone numbers
      if (phoneNumbers.some(phone => phone.number.trim())) {
        const phoneData: PhoneInsert[] = phoneNumbers
          .filter(phone => phone.number.trim())
          .map(phone => ({
            client_id: clientResult.id,
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

      // Insert emergency contacts
      if (emergencyContacts.some(contact => contact.name.trim())) {
        const emergencyData: EmergencyContactInsert[] = emergencyContacts
          .filter(contact => contact.name.trim())
          .map(contact => ({
            client_id: clientResult.id,
            name: contact.name,
            relationship: contact.relationship,
            phone_number: contact.phone_number,
            email: contact.email,
            is_primary: contact.is_primary,
          }));

        const { error: emergencyError } = await supabase
          .from('client_emergency_contacts')
          .insert(emergencyData);

        if (emergencyError) {
          console.error('Error inserting emergency contacts:', emergencyError);
        }
      }

      // Insert insurance information
      if (insuranceInfo.length > 0) {
        const insuranceData: InsuranceInsert[] = insuranceInfo.map(insurance => ({
          client_id: clientResult.id,
          insurance_type: insurance.insurance_type,
          insurance_company: insurance.insurance_company,
          policy_number: insurance.policy_number,
          group_number: insurance.group_number,
          subscriber_name: insurance.subscriber_name,
          subscriber_relationship: insurance.subscriber_relationship,
          subscriber_dob: insurance.subscriber_dob || null,
          effective_date: insurance.effective_date || null,
          termination_date: insurance.termination_date || null,
          copay_amount: insurance.copay_amount || null,
          deductible_amount: insurance.deductible_amount || null,
        }));

        const { error: insuranceError } = await supabase
          .from('client_insurance')
          .insert(insuranceData);

        if (insuranceError) {
          console.error('Error inserting insurance information:', insuranceError);
        }
      }

      // Insert primary care provider
      if (primaryCareProvider.provider_name.trim()) {
        const pcpData: PCPInsert = {
          client_id: clientResult.id,
          provider_name: primaryCareProvider.provider_name,
          practice_name: primaryCareProvider.practice_name,
          phone_number: primaryCareProvider.phone_number,
          address: primaryCareProvider.address,
        };

        const { error: pcpError } = await supabase
          .from('client_primary_care_providers')
          .insert(pcpData);

        if (pcpError) {
          console.error('Error inserting primary care provider:', pcpError);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900">Add New Patient</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="billing">Billing & Insurance</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <BasicInfoTab formData={formData} setFormData={setFormData} />
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <ContactInfoTab 
                formData={formData} 
                setFormData={setFormData}
                phoneNumbers={phoneNumbers}
                setPhoneNumbers={setPhoneNumbers}
                emergencyContacts={emergencyContacts}
                setEmergencyContacts={setEmergencyContacts}
                primaryCareProvider={primaryCareProvider}
                setPrimaryCareProvider={setPrimaryCareProvider}
              />
            </TabsContent>

            <TabsContent value="demographics" className="space-y-4">
              <DemographicsTab formData={formData} setFormData={setFormData} />
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              <BillingTab 
                insuranceInfo={insuranceInfo}
                setInsuranceInfo={setInsuranceInfo}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <SettingsTab formData={formData} setFormData={setFormData} />
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
