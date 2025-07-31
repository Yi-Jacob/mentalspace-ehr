
import React from 'react';
import { Card, CardContent } from '@/components/basic/card';
import { User, Mail, Calendar } from 'lucide-react';
import { ClientFormData } from '@/types/clientType';
import { format } from 'date-fns';

interface ClientQuickInfoProps {
  client: ClientFormData;
}

export const ClientQuickInfo: React.FC<ClientQuickInfoProps> = ({ client }) => {
  const formatDateOfBirth = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return 'Not provided';
    
    // Parse the database date as YYYY-MM-DD and create a local date
    const parts = dateOfBirth.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // months are 0-indexed
      const day = parseInt(parts[2]);
      const date = new Date(year, month, day);
      
      console.log('ClientQuickInfo - Original date string:', dateOfBirth);
      console.log('ClientQuickInfo - Parsed date object:', date);
      console.log('ClientQuickInfo - Formatted date:', format(date, 'M/d/yyyy'));
      
      return format(date, 'M/d/yyyy');
    }
    return dateOfBirth;
  };

  return (
    <Card className="mb-4">
      <CardContent className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Date of Birth</div>
              <div className="font-medium">
                {formatDateOfBirth(client.dateOfBirth)}
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
