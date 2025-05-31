
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface ClientSelectionFieldProps {
  clients: Client[];
  selectedClientId: string;
  onClientChange: (value: string) => void;
}

const ClientSelectionField: React.FC<ClientSelectionFieldProps> = ({
  clients,
  selectedClientId,
  onClientChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="client" className="text-sm font-medium">
        Select Client *
      </Label>
      <Select value={selectedClientId} onValueChange={onClientChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose a client to message" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{client.first_name} {client.last_name}</span>
                {client.email && <span className="text-sm text-gray-500">({client.email})</span>}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSelectionField;
