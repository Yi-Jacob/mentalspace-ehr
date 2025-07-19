
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ClientListHeaderProps {
  onAddClient: () => void;
}

const ClientListHeader: React.FC<ClientListHeaderProps> = ({ onAddClient }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <p className="text-gray-600 mt-1">Manage your client records</p>
      </div>
      <Button onClick={onAddClient} className="bg-blue-600 hover:bg-blue-700">
        <Plus className="w-4 h-4 mr-2" />
        Add New Client
      </Button>
    </div>
  );
};

export default ClientListHeader;
