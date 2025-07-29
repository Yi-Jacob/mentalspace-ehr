import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';

import { useClientForm } from '@/hooks/useClientForm';
import { useClients } from '@/hooks/useClients';
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
    console.log('Saving client data:', formData);
    console.log('Date of birth being saved:', formData.dateOfBirth);
    
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