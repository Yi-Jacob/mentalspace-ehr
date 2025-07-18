
import React from 'react';
import { User } from 'lucide-react';

interface ClientInfoDisplayProps {
  clientName: string;
}

const ClientInfoDisplay: React.FC<ClientInfoDisplayProps> = ({ clientName }) => {
  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div className="flex items-center space-x-2 text-blue-700">
        <User className="h-4 w-4" />
        <span className="font-semibold">Client: {clientName}</span>
      </div>
    </div>
  );
};

export default ClientInfoDisplay;
