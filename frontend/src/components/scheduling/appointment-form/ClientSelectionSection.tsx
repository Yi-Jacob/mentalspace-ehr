
import React from 'react';
import { Label } from '@/components/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User, AlertCircle } from 'lucide-react';

interface ClientSelectionSectionProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const ClientSelectionSection: React.FC<ClientSelectionSectionProps> = ({
  value,
  onChange,
  error
}) => {
  const { data: clients, isLoading, error: queryError } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, first_name, last_name')
        .eq('is_active', true)
        .order('last_name');

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
      return data;
    },
  });

  if (queryError) {
    return (
      <div className="space-y-2">
        <Label className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>Error loading clients</span>
        </Label>
        <div className="text-sm text-red-600">
          Failed to load client list. Please refresh the page and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="client" className="flex items-center space-x-2 text-gray-700 font-medium">
        <User className="h-4 w-4 text-blue-500" />
        <span>Client *</span>
      </Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={isLoading}
      >
        <SelectTrigger 
          className={`bg-white/70 border-gray-200 focus:border-blue-400 transition-all duration-200 ${
            error ? 'border-red-400 focus:border-red-400' : ''
          }`}
          aria-describedby={error ? 'client-error' : undefined}
        >
          <SelectValue placeholder={isLoading ? "Loading clients..." : "Select a client"} />
        </SelectTrigger>
        <SelectContent className="bg-white border-0 shadow-2xl max-h-60">
          {isLoading ? (
            <div className="p-2 text-center text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                <span>Loading clients...</span>
              </div>
            </div>
          ) : clients && clients.length > 0 ? (
            clients.map((client) => (
              <SelectItem 
                key={client.id} 
                value={client.id}
                className="hover:bg-blue-50 transition-colors"
              >
                {client.first_name} {client.last_name}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">
              No active clients found
            </div>
          )}
        </SelectContent>
      </Select>
      {error && (
        <div id="client-error" className="text-sm text-red-600 flex items-center space-x-1">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ClientSelectionSection;
