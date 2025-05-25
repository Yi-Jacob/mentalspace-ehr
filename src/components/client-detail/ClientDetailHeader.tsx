
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Phone, Mail, Calendar } from 'lucide-react';
import { ClientFormData } from '@/types/client';

interface ClientDetailHeaderProps {
  client: ClientFormData;
  onEditClick: () => void;
}

export const ClientDetailHeader: React.FC<ClientDetailHeaderProps> = ({ client, onEditClick }) => {
  const navigate = useNavigate();

  const formatAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return `${age - 1} years`;
    }
    return `${age} years`;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/clients')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clients
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {client.preferred_name && client.preferred_name !== client.first_name
              ? `${client.preferred_name} (${client.first_name}) ${client.last_name}`
              : `${client.first_name} ${client.last_name}`
            }
          </h1>
          <div className="flex items-center space-x-4 mt-1">
            {client.date_of_birth && (
              <span className="text-gray-500">{formatAge(client.date_of_birth)}</span>
            )}
            <Badge variant="outline">Active</Badge>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button size="sm" variant="outline">
          <Phone className="w-4 h-4 mr-2" />
          Call
        </Button>
        <Button size="sm" variant="outline">
          <Mail className="w-4 h-4 mr-2" />
          Email
        </Button>
        <Button size="sm" variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule
        </Button>
        <Button 
          size="sm" 
          onClick={onEditClick}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>
    </div>
  );
};
