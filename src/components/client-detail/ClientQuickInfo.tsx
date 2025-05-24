
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Mail, Calendar } from 'lucide-react';
import { ClientFormData } from '@/types/client';

interface ClientQuickInfoProps {
  client: ClientFormData;
}

export const ClientQuickInfo: React.FC<ClientQuickInfoProps> = ({ client }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Date of Birth</div>
              <div className="font-medium">
                {client.date_of_birth ? new Date(client.date_of_birth).toLocaleDateString() : 'Not provided'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium">{client.email || 'Not provided'}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Location</div>
              <div className="font-medium">
                {[client.city, client.state].filter(Boolean).join(', ') || 'Not provided'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
