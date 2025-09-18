import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/basic/button';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';

import { useClientForm } from '@/pages/clients/hook/useClientForm';
import { useClients } from '@/pages/clients/hook/useClients';
import { useToast } from '@/hooks/use-toast';
import { clientService } from '@/services/clientService';
import { ClientFormData } from '@/types/clientType';
import ClientForm from '../components/ClientForm';

const ClientEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { clientId } = useParams<{ clientId: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<ClientFormData | null>(null);

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

  const { updateClient, isUpdating } = useClients({
    onUpdateSuccess: () => {
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
      navigate(`/clients/${clientId}`);
    }
  });

  // Function to refresh client data
  const refreshClientData = async () => {
    if (!clientId) return;
    
    try {
      const clientData = await clientService.getClient(clientId);
      setClient(clientData);
      setFormData({
        ...clientData,
        dateOfBirth: clientData.dateOfBirth || ''
      });
    } catch (error) {
      console.error('Error refreshing client data:', error);
    }
  };

  // Load client data when component mounts
  useEffect(() => {
    const loadClientData = async () => {
      if (!clientId) return;
      
      try {
        setLoading(true);
        
        // Load client data
        const clientData = await clientService.getClient(clientId);
        setClient(clientData);
        
        // Ensure dateOfBirth is in proper format when loading for editing
        const formattedClientData = {
          ...clientData,
          dateOfBirth: clientData.dateOfBirth || ''
        };
        setFormData(formattedClientData);
        
        // Load related data
        const [phoneData, contactData, insuranceData, pcpData] = await Promise.all([
          clientService.getClientPhoneNumbers(clientId),
          clientService.getClientEmergencyContacts(clientId),
          clientService.getClientInsurance(clientId),
          clientService.getClientPrimaryCareProvider(clientId)
        ]);

        // Set phone numbers
        if (phoneData && phoneData.length > 0) {
          setPhoneNumbers(phoneData.map(phone => ({
            type: phone.phoneType,
            number: phone.phoneNumber,
            messagePreference: phone.messagePreference
          })));
        }

        // Set emergency contacts
        if (contactData && contactData.length > 0) {
          setEmergencyContacts(contactData.map(contact => ({
            name: contact.name,
            relationship: contact.relationship || '',
            phoneNumber: contact.phoneNumber || '',
            email: contact.email || '',
            isPrimary: contact.isPrimary || false
          })));
        }

        // Set insurance information
        if (insuranceData && insuranceData.length > 0) {
          setInsuranceInfo(insuranceData.map(insurance => ({
            id: insurance.id, // Include the ID for tracking
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

        // Set primary care provider
        if (pcpData) {
          setPrimaryCareProvider({
            providerName: pcpData.providerName || '',
            practiceName: pcpData.practiceName || '',
            phoneNumber: pcpData.phoneNumber || '',
            address: pcpData.address || ''
          });
        }
      } catch (error) {
        console.error('Error loading client data:', error);
        toast({
          title: "Error",
          description: "Failed to load client data",
          variant: "destructive",
        });
        navigate('/clients');
      } finally {
        setLoading(false);
      }
    };

    loadClientData();
  }, [clientId, setFormData, setPhoneNumbers, setEmergencyContacts, setInsuranceInfo, setPrimaryCareProvider, navigate, toast]);

  const handleSave = () => {
    if (!clientId) return;
    
    console.log('Saving client data:', formData);
    updateClient({
      clientId,
      data: {
        formData,
        phoneNumbers,
        emergencyContacts,
        insuranceInfo,
        primaryCareProvider
      }
    });
  };

  const handleCancel = () => {
    navigate(`/clients/${clientId}`);
  };

  if (loading) {
    return (
      <PageLayout variant="simple">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </PageLayout>
    );
  }

  if (!client) {
    return (
      <PageLayout variant="simple">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Client not found</h2>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={ArrowLeft}
        title={`Edit ${client.firstName} ${client.lastName}`}
        description="Update client information"
        action={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={isUpdating}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Update Client'}
            </Button>
          </div>
        }
      />

      <div className="mt-6">
        <ClientForm
          formData={formData}
          setFormData={setFormData}
          phoneNumbers={phoneNumbers}
          setPhoneNumbers={setPhoneNumbers}
          emergencyContacts={emergencyContacts}
          setEmergencyContacts={setEmergencyContacts}
          insuranceInfo={insuranceInfo}
          setInsuranceInfo={setInsuranceInfo}
          primaryCareProvider={primaryCareProvider}
          setPrimaryCareProvider={setPrimaryCareProvider}
          onDataChange={refreshClientData}
        />
      </div>
    </PageLayout>
  );
};

export default ClientEditPage; 