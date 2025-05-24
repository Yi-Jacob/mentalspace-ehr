
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useClientForm } from '@/hooks/useClientForm';
import { createClient, updateClient } from '@/services/clientService';
import { supabase } from '@/integrations/supabase/client';
import { BasicInfoTab } from './client-form/BasicInfoTab';
import { ContactInfoTab } from './client-form/ContactInfoTab';
import { DemographicsTab } from './client-form/DemographicsTab';
import { BillingTab } from './client-form/BillingTab';
import { SettingsTab } from './client-form/SettingsTab';
import { ClientFormData } from '@/types/client';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: () => void;
  editingClient?: ClientFormData | null;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ 
  isOpen, 
  onClose, 
  onClientAdded,
  editingClient 
}) => {
  const { toast } = useToast();
  const {
    formData,
    setFormData,
    phoneNumbers,
    setPhoneNumbers,
    emergencyContacts,
    setEmergencyContacts,
    insuranceInfo,
    setInsuranceInfo,
    primaryCareProvider,
    setPrimaryCareProvider,
    resetForm,
  } = useClientForm();

  const isEditing = !!editingClient;

  // Load client data when editing
  useEffect(() => {
    if (editingClient && isOpen) {
      console.log('Loading client data for editing:', editingClient);
      setFormData(editingClient);
      
      // Load related data when editing
      const loadRelatedData = async () => {
        try {
          // Load phone numbers
          const { data: phoneData } = await supabase
            .from('client_phone_numbers')
            .select('*')
            .eq('client_id', editingClient.id);

          if (phoneData && phoneData.length > 0) {
            setPhoneNumbers(phoneData.map(phone => ({
              type: phone.phone_type as any,
              number: phone.phone_number,
              message_preference: phone.message_preference as any
            })));
          }

          // Load emergency contacts
          const { data: contactData } = await supabase
            .from('client_emergency_contacts')
            .select('*')
            .eq('client_id', editingClient.id);

          if (contactData && contactData.length > 0) {
            setEmergencyContacts(contactData.map(contact => ({
              name: contact.name,
              relationship: contact.relationship || '',
              phone_number: contact.phone_number || '',
              email: contact.email || '',
              is_primary: contact.is_primary || false
            })));
          }

          // Load insurance information
          const { data: insuranceData } = await supabase
            .from('client_insurance')
            .select('*')
            .eq('client_id', editingClient.id);

          if (insuranceData && insuranceData.length > 0) {
            setInsuranceInfo(insuranceData.map(insurance => ({
              insurance_type: insurance.insurance_type as any,
              insurance_company: insurance.insurance_company || '',
              policy_number: insurance.policy_number || '',
              group_number: insurance.group_number || '',
              subscriber_name: insurance.subscriber_name || '',
              subscriber_relationship: insurance.subscriber_relationship || '',
              subscriber_dob: insurance.subscriber_dob || '',
              effective_date: insurance.effective_date || '',
              termination_date: insurance.termination_date || '',
              copay_amount: insurance.copay_amount || 0,
              deductible_amount: insurance.deductible_amount || 0
            })));
          }

          // Load primary care provider
          const { data: pcpData } = await supabase
            .from('client_primary_care_providers')
            .select('*')
            .eq('client_id', editingClient.id)
            .single();

          if (pcpData) {
            setPrimaryCareProvider({
              provider_name: pcpData.provider_name || '',
              practice_name: pcpData.practice_name || '',
              phone_number: pcpData.phone_number || '',
              address: pcpData.address || ''
            });
          }
        } catch (error) {
          console.error('Error loading related data:', error);
        }
      };

      loadRelatedData();
    }
  }, [editingClient?.id, isOpen, setFormData, setPhoneNumbers, setEmergencyContacts, setInsuranceInfo, setPrimaryCareProvider]);

  // Reset form when modal closes and not editing
  useEffect(() => {
    if (!isOpen && !isEditing) {
      resetForm();
    }
  }, [isOpen, isEditing, resetForm]);

  const handleSave = async (createAnother: boolean = false) => {
    try {
      console.log('Saving client data:', formData);
      
      if (isEditing && editingClient?.id) {
        await updateClient(editingClient.id, formData, phoneNumbers, emergencyContacts, insuranceInfo, primaryCareProvider);
        toast({
          title: "Success",
          description: "Client updated successfully",
        });
      } else {
        await createClient(formData, phoneNumbers, emergencyContacts, insuranceInfo, primaryCareProvider);
        toast({
          title: "Success",
          description: "Client created successfully",
        });
      }

      onClientAdded();
      
      if (createAnother && !isEditing) {
        resetForm();
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: "Error",
        description: isEditing ? "Failed to update client" : "Failed to create client",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Client' : 'Add New Client'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <BasicInfoTab formData={formData} setFormData={setFormData} />
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
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

          <TabsContent value="demographics" className="space-y-6">
            <DemographicsTab formData={formData} setFormData={setFormData} />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <BillingTab
              insuranceInfo={insuranceInfo}
              setInsuranceInfo={setInsuranceInfo}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsTab formData={formData} setFormData={setFormData} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {!isEditing && (
            <Button
              onClick={() => handleSave(true)}
              variant="outline"
              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
            >
              Save and Create Another
            </Button>
          )}
          <Button onClick={() => handleSave(false)} className="bg-blue-600 hover:bg-blue-700">
            {isEditing ? 'Update Client' : 'Save New Client'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
