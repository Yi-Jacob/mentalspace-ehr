import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Mail, Calendar, MapPin, Edit, MessageSquare, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ClientFormData, PhoneNumber, EmergencyContact, InsuranceInfo, PrimaryCareProvider } from '@/types/client';
import { clientService } from '@/services/clientService';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { ClientQuickInfo } from './components/ClientQuickInfo';
import ClientDetailTabs from './components/ClientDetailTabs';
import AddClientModal from '../components/AddClientModal';

const ClientDetailView = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { toast } = useToast();
  const [client, setClient] = useState<ClientFormData | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo[]>([]);
  const [primaryCareProvider, setPrimaryCareProvider] = useState<PrimaryCareProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

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

  const handleClientUpdated = () => {
    fetchClientDetails();
    setShowEditModal(false);
    toast({
      title: "Success",
      description: "Client updated successfully",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Client not found</h2>
        </div>
      </div>
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
              onClick={() => setShowEditModal(true)}
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

      <AddClientModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onClientAdded={handleClientUpdated}
        editingClient={client}
      />
    </PageLayout>
  );
};

export default ClientDetailView;