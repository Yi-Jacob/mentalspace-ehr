import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ClientFormData, PhoneNumber, EmergencyContact, InsuranceInfo, PrimaryCareProvider } from '@/types/client';
import AddClientModal from './AddClientModal';
import ClientDetailHeader from './client-detail/ClientDetailHeader';
import { ClientQuickInfo } from './client-detail/ClientQuickInfo';
import ClientDetailTabs from './client-detail/ClientDetailTabs';

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
    <div className="p-6 space-y-6">
      <ClientDetailHeader 
        client={client} 
        onEditClick={() => setShowEditModal(true)} 
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
    </div>
  );
};

export default ClientDetailView;
