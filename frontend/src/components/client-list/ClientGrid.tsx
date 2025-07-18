
import React from 'react';
import ClientCard from './ClientCard';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name?: string;
  date_of_birth?: string;
  email?: string;
  city?: string;
  state?: string;
  assigned_clinician_id?: string;
  is_active: boolean;
  created_at: string;
}

interface ClientGridProps {
  clients: Client[];
  onClientClick: (clientId: string) => void;
}

const ClientGrid: React.FC<ClientGridProps> = ({ clients, onClientClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client) => (
        <ClientCard 
          key={client.id} 
          client={client}
          onClientClick={onClientClick}
        />
      ))}
    </div>
  );
};

export default ClientGrid;
