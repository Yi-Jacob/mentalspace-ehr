
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicInfoTab } from './client-form/BasicInfoTab';
import { ContactInfoTab } from './client-form/ContactInfoTab';
import { DemographicsTab } from './client-form/DemographicsTab';
import { SettingsTab } from './client-form/SettingsTab';
import { BillingTab } from './client-form/BillingTab';
import { useClientForm } from '@/hooks/useClientForm';
import { createClient } from '@/services/clientService';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onClientAdded }) => {
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent, saveAndCreateAnother = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createClient(
        formData,
        phoneNumbers,
        emergencyContacts,
        insuranceInfo,
        primaryCareProvider
      );

      toast({
        title: "Success",
        description: "Client added successfully",
      });

      if (saveAndCreateAnother) {
        resetForm();
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
