import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, MapPin, Edit, MessageSquare, Plus } from 'lucide-react';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { useToast } from '@/hooks/use-toast';
import { ClientFormData, PhoneNumber, EmergencyContact, InsuranceInfo, PrimaryCareProvider } from '@/types/client';
import { clientService } from '@/services/clientService';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { ClientQuickInfo } from './components/ClientQuickInfo';
import ClientDetailTabs from './components/ClientDetailTabs';

const ClientDetailView = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<ClientFormData | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo[]>([]);
  const [primaryCareProvider, setPrimaryCareProvider] = useState<PrimaryCareProvider | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClientDetails = async () => {
    if (!clientId) return;
    
    try {
      // Fetch client data
      const clientData = await clientService.getClient(clientId);
      setClient(clientData);

      // Fetch phone numbers
      const phoneData = await clientService.getClientPhoneNumbers(clientId);
      if (phoneData) {
        setPhoneNumbers(phoneData);
      }

      // Fetch emergency contacts
      const contactData = await clientService.getClientEmergencyContacts(clientId);
      if (contactData) {
        setEmergencyContacts(contactData);
      }

      // Fetch insurance information
      const insuranceData = await clientService.getClientInsurance(clientId);
      if (insuranceData) {
        setInsuranceInfo(insuranceData);
      }

      // Fetch primary care provider
      const pcpData = await clientService.getClientPrimaryCareProvider(clientId);
      if (pcpData) {
        setPrimaryCareProvider(pcpData);
      }

    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: "Error",
        description: "Failed to load client details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [clientId]);

  const handleEditClient = () => {
    navigate(`/clients/${clientId}/edit`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading client details..." />;
  }

  if (!client) {
    return (
      <EmptyState 
        title="Client not found"
        description="The client you're looking for doesn't exist or has been removed."
        icon={User}
      />
    );
  }

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={User}
        title={`${client.firstName} ${client.lastName}`}
        description={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            {client.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{client.email}</span>
              </div>
            )}
            
            {client.dateOfBirth && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>DOB: {new Date(client.dateOfBirth).toLocaleDateString()}</span>
              </div>
            )}
            
            {(client.city || client.state) && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{client.city}, {client.state}</span>
              </div>
            )}
          </div>
        }
        badge={
          <Badge variant={client.isActive ? "default" : "secondary"}>
            {client.isActive ? 'Active' : 'Inactive'}
          </Badge>
        }

        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={handleEditClient}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Client</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* TODO: Implement compose modal */}}
              className="flex items-center space-x-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Quick Message</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* TODO: Implement new conversation modal */}}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Conversation</span>
            </Button>
          </div>
        }
      />

      <ClientQuickInfo client={client} />

      <ClientDetailTabs
        client={client}
        phoneNumbers={phoneNumbers}
        emergencyContacts={emergencyContacts}
        insuranceInfo={insuranceInfo}
        primaryCareProvider={primaryCareProvider}
      />


    </PageLayout>
  );
};

export default ClientDetailView;