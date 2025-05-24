
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
      setFormData(editingClient);
      // TODO: Load related data (phone numbers, emergency contacts, etc.) when those tables are implemented
    } else if (!isOpen) {
      resetForm();
    }
  }, [editingClient, isOpen, setFormData, resetForm]);

  const handleSave = async (createAnother: boolean = false) => {
    try {
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
