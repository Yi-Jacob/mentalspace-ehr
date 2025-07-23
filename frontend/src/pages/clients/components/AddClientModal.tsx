import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PageTabs from '@/components/ui/PageTabs';
import { useToast } from '@/hooks/use-toast';
import { useClientForm } from '@/hooks/useClientForm';
import { clientService } from '@/services/clientService';
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
      // Ensure date_of_birth is in proper format when loading for editing
      const clientData = {
        ...editingClient,
        date_of_birth: editingClient.date_of_birth || ''
      };
      console.log('Date of birth loaded:', clientData.date_of_birth);
      setFormData(clientData);
      
      // Load related data when editing
      const loadRelatedData = async () => {
        try {
          // Load phone numbers
          const phoneData = await clientService.getClientPhoneNumbers(editingClient.id!);
          if (phoneData && phoneData.length > 0) {
            setPhoneNumbers(phoneData.map(phone => ({
              type: phone.phoneType as any,
              number: phone.phoneNumber,
              message_preference: phone.messagePreference as any
            })));
          }

          // Load emergency contacts
          const contactData = await clientService.getClientEmergencyContacts(editingClient.id!);
          if (contactData && contactData.length > 0) {
            setEmergencyContacts(contactData.map(contact => ({
              name: contact.name,
              relationship: contact.relationship || '',
              phone_number: contact.phoneNumber || '',
              email: contact.email || '',
              is_primary: contact.isPrimary || false
            })));
          }

          // Load insurance information
          const insuranceData = await clientService.getClientInsurance(editingClient.id!);
          if (insuranceData && insuranceData.length > 0) {
            setInsuranceInfo(insuranceData.map(insurance => ({
              insurance_type: insurance.insuranceType as any,
              insurance_company: insurance.insuranceCompany || '',
              policy_number: insurance.policyNumber || '',
              group_number: insurance.groupNumber || '',
              subscriber_name: insurance.subscriberName || '',
              subscriber_relationship: insurance.subscriberRelationship || '',
              subscriber_dob: insurance.subscriberDob || '',
              effective_date: insurance.effectiveDate || '',
              termination_date: insurance.terminationDate || '',
              copay_amount: insurance.copayAmount || 0,
              deductible_amount: insurance.deductibleAmount || 0
            })));
          }

          // Load primary care provider
          const pcpData = await clientService.getClientPrimaryCareProvider(editingClient.id!);
          if (pcpData) {
            setPrimaryCareProvider({
              provider_name: pcpData.providerName || '',
              practice_name: pcpData.practiceName || '',
              phone_number: pcpData.phoneNumber || '',
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
      console.log('Date of birth being saved:', formData.date_of_birth);
      
      if (isEditing && editingClient?.id) {
        await clientService.updateClientWithFormData(
          editingClient.id,
          formData,
          phoneNumbers,
          emergencyContacts,
          insuranceInfo,
          primaryCareProvider
        );
        toast({
          title: "Success",
          description: "Client updated successfully",
        });
      } else {
        await clientService.createClientWithFormData(
          formData,
          phoneNumbers,
          emergencyContacts,
          insuranceInfo,
          primaryCareProvider
        );
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

        <PageTabs
          defaultValue="basic"
          items={[
            {
              id: 'basic',
              label: 'Basic Info',
              content: (
                <div className="space-y-4">
                  <BasicInfoTab formData={formData} setFormData={setFormData} />
                </div>
              )
            },
            {
              id: 'contact',
              label: 'Contact',
              content: (
                <div className="space-y-4">
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
                </div>
              )
            },
            {
              id: 'demographics',
              label: 'Demographics',
              content: (
                <div className="space-y-4">
                  <DemographicsTab formData={formData} setFormData={setFormData} />
                </div>
              )
            },
            {
              id: 'billing',
              label: 'Billing',
              content: (
                <div className="space-y-4">
                  <BillingTab
                    insuranceInfo={insuranceInfo}
                    setInsuranceInfo={setInsuranceInfo}
                  />
                </div>
              )
            },
            {
              id: 'settings',
              label: 'Settings',
              content: (
                <div className="space-y-4">
                  <SettingsTab formData={formData} setFormData={setFormData} />
                </div>
              )
            }
          ]}
        />

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
