import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Mail, Calendar, MapPin, Edit, MessageSquare, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ClientFormData, PhoneNumber, EmergencyContact, InsuranceInfo, PrimaryCareProvider } from '@/types/client';
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
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError) {
        console.error('Error fetching client:', clientError);
        toast({
          title: "Error",
          description: "Failed to load client details",
          variant: "destructive",
        });
        return;
      }

      setClient(clientData);

      // Fetch phone numbers
      const { data: phoneData } = await supabase
        .from('client_phone_numbers')
        .select('*')
        .eq('client_id', clientId);

      if (phoneData) {
        setPhoneNumbers(phoneData.map(phone => ({
          type: phone.phone_type as any,
          number: phone.phone_number,
          message_preference: phone.message_preference as any
        })));
      }

      // Fetch emergency contacts
      const { data: contactData } = await supabase
        .from('client_emergency_contacts')
        .select('*')
        .eq('client_id', clientId);

      if (contactData) {
        setEmergencyContacts(contactData.map(contact => ({
          name: contact.name,
          relationship: contact.relationship || '',
          phone_number: contact.phone_number || '',
          email: contact.email || '',
          is_primary: contact.is_primary || false
        })));
      }

      // Fetch insurance information
      const { data: insuranceData } = await supabase
        .from('client_insurance')
        .select('*')
        .eq('client_id', clientId);

      if (insuranceData) {
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

      // Fetch primary care provider
      const { data: pcpData } = await supabase
        .from('client_primary_care_providers')
        .select('*')
        .eq('client_id', clientId)
        .single();

      if (pcpData) {
        setPrimaryCareProvider({
          provider_name: pcpData.provider_name || '',
          practice_name: pcpData.practice_name || '',
          phone_number: pcpData.phone_number || '',
          address: pcpData.address || ''
        });
      }

    } catch (err) {
      console.error('Unexpected error:', err);
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
        title={`${client.first_name} ${client.last_name}`}
        description={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            {client.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{client.email}</span>
              </div>
            )}
            
            {client.date_of_birth && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>DOB: {new Date(client.date_of_birth).toLocaleDateString()}</span>
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
          <Badge variant={client.is_active ? "default" : "secondary"}>
            {client.is_active ? 'Active' : 'Inactive'}
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