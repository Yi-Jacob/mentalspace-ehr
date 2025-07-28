import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import PageTabs from '@/components/ui/PageTabs';
import { useClientForm } from '@/hooks/useClientForm';
import { useClients } from '@/hooks/useClients';
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

  const { createClient, updateClient, isCreating, isUpdating } = useClients({
    onCreateSuccess: () => {
      onClientAdded();
      onClose();
    },
    onUpdateSuccess: () => {
      onClientAdded();
      onClose();
    }
  });

  const isEditing = !!editingClient;

  // Load client data when editing
  useEffect(() => {
    if (editingClient && isOpen) {
      console.log('Loading client data for editing:', editingClient);
      // Ensure dateOfBirth is in proper format when loading for editing
      const clientData = {
        ...editingClient,
        dateOfBirth: editingClient.dateOfBirth || ''
      };
      console.log('Date of birth loaded:', clientData.dateOfBirth);
      setFormData(clientData);
      
      // Load related data when editing
      const loadRelatedData = async () => {
        try {
          // Load phone numbers
          const phoneData = await clientService.getClientPhoneNumbers(editingClient.id!);
          if (phoneData && phoneData.length > 0) {
            setPhoneNumbers(phoneData);
          }

          // Load emergency contacts
          const contactData = await clientService.getClientEmergencyContacts(editingClient.id!);
          if (contactData && contactData.length > 0) {
            setEmergencyContacts(contactData.map(contact => ({
              name: contact.name,
              relationship: contact.relationship || '',
              phoneNumber: contact.phoneNumber || '',
              email: contact.email || '',
              isPrimary: contact.isPrimary || false
            })));
          }

          // Load insurance information
          const insuranceData = await clientService.getClientInsurance(editingClient.id!);
          if (insuranceData && insuranceData.length > 0) {
            setInsuranceInfo(insuranceData.map(insurance => ({
              insuranceType: insurance.insuranceType as any,
              insuranceCompany: insurance.insuranceCompany || '',
              policyNumber: insurance.policyNumber || '',
              groupNumber: insurance.groupNumber || '',
              subscriberName: insurance.subscriberName || '',
              subscriberRelationship: insurance.subscriberRelationship || '',
              subscriberDob: insurance.subscriberDob || '',
              effectiveDate: insurance.effectiveDate || '',
              terminationDate: insurance.terminationDate || '',
              copayAmount: insurance.copayAmount || 0,
              deductibleAmount: insurance.deductibleAmount || 0
            })));
          }

          // Load primary care provider
          const pcpData = await clientService.getClientPrimaryCareProvider(editingClient.id!);
          if (pcpData) {
            setPrimaryCareProvider({
              providerName: pcpData.providerName || '',
              practiceName: pcpData.practiceName || '',
              phoneNumber: pcpData.phoneNumber || '',
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

  const handleSave = (createAnother: boolean = false) => {
    console.log('Saving client data:', formData);
    console.log('Date of birth being saved:', formData.dateOfBirth);
    
    if (isEditing && editingClient?.id) {
      updateClient({
        clientId: editingClient.id,
        data: {
          formData,
          phoneNumbers,
          emergencyContacts,
          insuranceInfo,
          primaryCareProvider
        }
      });
    } else {
      createClient({
        formData,
        phoneNumbers,
        emergencyContacts,
        insuranceInfo,
        primaryCareProvider
      });
    }

    // If creating another, reset form after successful creation
    if (createAnother && !isEditing) {
      resetForm();
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
          <Button variant="outline" onClick={onClose} disabled={isCreating || isUpdating}>
            Cancel
          </Button>
          {!isEditing && (
            <Button
              onClick={() => handleSave(true)}
              variant="outline"
              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
              disabled={isCreating || isUpdating}
            >
              Save and Create Another
            </Button>
          )}
          <Button 
            onClick={() => handleSave(false)} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating ? 'Saving...' : (isEditing ? 'Update Client' : 'Save New Client')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
