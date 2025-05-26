
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
}

interface ClientSelectionSectionProps {
  value: string;
  onChange: (value: string) => void;
  clients?: Client[];
}

const ClientSelectionSection: React.FC<ClientSelectionSectionProps> = ({
  value,
  onChange,
  clients
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="client">Client *</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a client" />
        </SelectTrigger>
        <SelectContent>
          {clients?.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.first_name} {client.last_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSelectionSection;
