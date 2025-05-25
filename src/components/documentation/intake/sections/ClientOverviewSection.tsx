
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { IntakeFormData } from '../types/IntakeFormData';

// Mental Health CPT Codes
const MENTAL_HEALTH_CPT_CODES = [
  { code: '90791', description: 'Psychiatric diagnostic evaluation' },
  { code: '90792', description: 'Psychiatric diagnostic evaluation with medical services' },
  { code: '90834', description: 'Psychotherapy, 45 minutes' },
  { code: '90837', description: 'Psychotherapy, 60 minutes' },
  { code: '90847', description: 'Family psychotherapy with patient present' },
  { code: '90853', description: 'Group psychotherapy' },
  { code: '90901', description: 'Biofeedback training' },
  { code: '96116', description: 'Neurobehavioral status exam' },
  { code: '96118', description: 'Neuropsychological testing' },
  { code: '96125', description: 'Standardized cognitive performance testing' },
];

interface ClientOverviewSectionProps {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  clientData: any;
}

const ClientOverviewSection: React.FC<ClientOverviewSectionProps> = ({
  formData,
  updateFormData,
  clientData,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { noteId } = useParams();

  // Fetch all active clients for selection
  const { data: clients } = useQuery({
    queryKey: ['clients-for-intake'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, first_name, last_name, date_of_birth')
        .eq('is_active', true)
        .order('last_name');
      if (error) throw error;
      return data;
    },
  });

  // Fetch client contact info and insurance when client is selected
  const { data: clientDetails } = useQuery({
    queryKey: ['client-details', clientData?.id],
    queryFn: async () => {
      if (!clientData?.id) return null;
      
      console.log('Fetching client details for:', clientData.id);
      
      // Get phone numbers
      const { data: phoneNumbers } = await supabase
        .from('client_phone_numbers')
        .select('*')
        .eq('client_id', clientData.id);
      
      // Get insurance info
      const { data: insurance } = await supabase
        .from('client_insurance')
        .select('*')
        .eq('client_id', clientData.id)
        .eq('is_active', true);
      
      return {
        phoneNumbers: phoneNumbers || [],
        insurance: insurance || []
      };
    },
    enabled: !!clientData?.id,
  });

  // Mutation to update the note with selected client
  const updateNoteMutation = useMutation({
    mutationFn: async (clientId: string) => {
      if (!noteId) throw new Error('No note ID found');
      
      console.log('Updating note with ID:', noteId, 'and client ID:', clientId);
      
      const { error } = await supabase
        .from('clinical_notes')
        .update({ client_id: clientId })
        .eq('id', noteId);
      
      if (error) {
        console.error('Error updating note with client:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Client assigned',
        description: 'The client has been assigned to this intake assessment.',
      });
      queryClient.invalidateQueries({ queryKey: ['clinical-note'] });
      // Refresh the page to load the client data
      window.location.reload();
    },
    onError: (error) => {
      console.error('Error assigning client:', error);
      toast({
        title: 'Error assigning client',
        description: 'There was an error assigning the client. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleClientSelect = (clientId: string) => {
    updateFormData({ clientId });
    updateNoteMutation.mutate(clientId);
  };

  // Auto-populate fields when client details are loaded
  React.useEffect(() => {
    if (clientDetails && clientData) {
      const primaryPhone = clientDetails.phoneNumbers.find(p => p.phone_type === 'Primary')?.phone_number || 
                          clientDetails.phoneNumbers[0]?.phone_number || '';
      
      const primaryInsurance = clientDetails.insurance.find(i => i.insurance_type === 'Primary')?.insurance_company ||
                              clientDetails.insurance[0]?.insurance_company || '';
      
      updateFormData({
        primaryPhone,
        primaryEmail: clientData.email || '',
        primaryInsurance,
        cptCode: formData.cptCode || '90791' // Default to intake assessment code
      });
    }
  }, [clientDetails, clientData]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Client Information</h3>
        
        {!clientData ? (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">No Client Assigned</h4>
              <p className="text-yellow-700 text-sm">
                Please select a client to associate with this intake assessment.
              </p>
            </div>
            
            <div>
              <Label htmlFor="client-select">Select Client *</Label>
              <Select onValueChange={handleClientSelect} disabled={updateNoteMutation.isPending}>
                <SelectTrigger>
                  <SelectValue placeholder={updateNoteMutation.isPending ? "Assigning client..." : "Choose a client"} />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.last_name}, {client.first_name}
                      {client.date_of_birth && ` (DOB: ${format(new Date(client.date_of_birth), 'MM/dd/yyyy')})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Client Name</Label>
                <Input
                  value={`${clientData?.first_name || ''} ${clientData?.last_name || ''}`}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input
                  value={clientData?.date_of_birth ? format(new Date(clientData.date_of_birth), 'MMM d, yyyy') : 'Not specified'}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="intakeDate">Intake Date *</Label>
                <Input
                  id="intakeDate"
                  type="date"
                  value={formData.intakeDate}
                  onChange={(e) => updateFormData({ intakeDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cptCode">CPT Code *</Label>
                <Select 
                  value={formData.cptCode || '90791'} 
                  onValueChange={(value) => updateFormData({ cptCode: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select CPT Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {MENTAL_HEALTH_CPT_CODES.map((cpt) => (
                      <SelectItem key={cpt.code} value={cpt.code}>
                        {cpt.code} - {cpt.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryPhone">Primary Phone</Label>
                <Input
                  id="primaryPhone"
                  value={formData.primaryPhone || ''}
                  onChange={(e) => updateFormData({ primaryPhone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="primaryEmail">Email Address</Label>
                <Input
                  id="primaryEmail"
                  type="email"
                  value={formData.primaryEmail || ''}
                  onChange={(e) => updateFormData({ primaryEmail: e.target.value })}
                  placeholder="Email address"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="primaryInsurance">Primary Insurance</Label>
              <Input
                id="primaryInsurance"
                value={formData.primaryInsurance || ''}
                onChange={(e) => updateFormData({ primaryInsurance: e.target.value })}
                placeholder="Insurance company name"
              />
            </div>
          </div>
        )}
      </div>

      {clientData && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Assessment Overview</h4>
          <p className="text-blue-700 text-sm">
            This comprehensive intake assessment will gather essential information about the client's
            presenting concerns, treatment history, medical background, and psychosocial factors
            to inform treatment planning and care coordination.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientOverviewSection;
