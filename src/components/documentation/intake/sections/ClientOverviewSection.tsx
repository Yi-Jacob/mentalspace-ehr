
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { IntakeFormData } from '../types/IntakeFormData';

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

  // Mutation to update the note with selected client
  const updateNoteMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const noteId = window.location.pathname.split('/').pop()?.replace('/edit', '');
      if (!noteId) throw new Error('No note ID found');
      
      const { error } = await supabase
        .from('clinical_notes')
        .update({ client_id: clientId })
        .eq('id', noteId);
      
      if (error) throw error;
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
      toast({
        title: 'Error assigning client',
        description: 'There was an error assigning the client. Please try again.',
        variant: 'destructive',
      });
      console.error('Error updating note with client:', error);
    },
  });

  const handleClientSelect = (clientId: string) => {
    updateFormData({ clientId });
    updateNoteMutation.mutate(clientId);
  };

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
            <div>
              <Label>Intake Date *</Label>
              <Input
                type="date"
                value={formData.intakeDate}
                onChange={(e) => updateFormData({ intakeDate: e.target.value })}
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
