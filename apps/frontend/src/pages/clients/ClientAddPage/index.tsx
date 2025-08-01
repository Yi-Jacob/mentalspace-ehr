import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/basic/button';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';

import { useClientForm } from '@/pages/clients/hook/useClientForm';
import { useClients } from '@/pages/clients/hook/useClients';
import { useToast } from '@/hooks/use-toast';
import ClientForm from '../components/ClientForm';

const ClientAddPage: React.FC = () => {
  const navigate = useNavigate();
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

  const { createClient, isCreating } = useClients({
    onCreateSuccess: () => {
      toast({
        title: "Success",
        description: "Client created successfully",
      });
      navigate('/clients');
    }
  });

  const handleSave = (createAnother: boolean = false) => {
    createClient({
      formData,
      phoneNumbers,
      emergencyContacts,
      insuranceInfo,
      primaryCareProvider
    });

    // If creating another, reset form after successful creation
    if (createAnother) {
      resetForm();
    }
  };

  const handleCancel = () => {
    navigate('/clients');
  };

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={ArrowLeft}
        title="Add New Client"
        description="Create a new client record"
        action={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={isCreating}>
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(true)}
              variant="outline"
              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
              disabled={isCreating}
            >
              Save and Create Another
            </Button>
            <Button 
              onClick={() => handleSave(false)} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isCreating}
            >
              {isCreating ? 'Saving...' : 'Save New Client'}
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
        />
      </div>
    </PageLayout>
  );
};

export default ClientAddPage; 