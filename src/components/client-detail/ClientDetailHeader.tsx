
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  MessageSquare,
  Plus,
  Edit
} from 'lucide-react';
import ComposeMessageModal from '@/components/messaging/ComposeMessageModal';
import NewConversationModal from '@/components/messaging/NewConversationModal';

interface ClientDetailHeaderProps {
  client: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
    date_of_birth?: string;
    city?: string;
    state?: string;
    is_active: boolean;
  };
  onEditClick: () => void;
}

const ClientDetailHeader: React.FC<ClientDetailHeaderProps> = ({ client, onEditClick }) => {
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);

  return (
    <>
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-0 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {client.first_name} {client.last_name}
                </h1>
                <Badge variant={client.is_active ? "default" : "secondary"}>
                  {client.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                {client.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{client.email}</span>
                  </div>
                )}
                
                {client.date_of_birth && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>DOB: {new Date(client.date_of_birth).toLocaleDateString()}</span>
                  </div>
                )}
                
                {(client.city || client.state) && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{client.city}, {client.state}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEditClick}
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Client</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComposeModal(true)}
              className="flex items-center space-x-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Quick Message</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewConversationModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Conversation</span>
            </Button>
          </div>
        </div>
      </Card>

      <ComposeMessageModal 
        open={showComposeModal} 
        onOpenChange={setShowComposeModal}
        preselectedClientId={client.id}
      />
      
      <NewConversationModal 
        open={showNewConversationModal} 
        onOpenChange={setShowNewConversationModal}
        preselectedClientId={client.id}
      />
    </>
  );
};

export default ClientDetailHeader;
