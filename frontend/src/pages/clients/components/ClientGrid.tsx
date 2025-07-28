
import React from 'react';
import ClientCard from './ClientCard';
import { ClientFormData } from '@/types/client';

interface ClientGridProps {
  clients: ClientFormData[];
  onClientClick: (clientId: string) => void;
}

const ClientGrid: React.FC<ClientGridProps> = ({ clients, onClientClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
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
