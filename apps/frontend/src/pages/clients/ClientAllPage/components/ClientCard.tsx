
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { Phone, Mail, Calendar } from 'lucide-react';
import { ClientFormData } from '@/types/clientType';

interface ClientCardProps {
  client: ClientFormData;
  onClientClick: (clientId: string) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ client, onClientClick }) => {
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
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500"
      onClick={() => onClientClick(client.id!)}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-start justify-between">
          <div>
            <div className="font-semibold text-gray-900">
              {client.preferredName && client.preferredName !== client.firstName
                ? `${client.preferredName} (${client.firstName}) ${client.lastName}`
                : `${client.firstName} ${client.lastName}`
              }
            </div>
            {client.dateOfBirth && (
              <div className="text-sm text-gray-500 font-normal mt-1">
                {formatAge(client.dateOfBirth)}
              </div>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {client.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {client.email && (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            {client.email}
          </div>
        )}
        
        {(client.city || client.state) && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="w-4 h-4 mr-2 text-gray-400">📍</span>
            {[client.city, client.state].filter(Boolean).join(', ')}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="text-xs text-gray-500">
            {client.assignedClinicianId && client.assignedClinicianId !== 'unassigned' 
              ? `Assigned to ${client.assignedClinicianId}`
              : 'Unassigned'
            }
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <Phone className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <Calendar className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <Mail className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
