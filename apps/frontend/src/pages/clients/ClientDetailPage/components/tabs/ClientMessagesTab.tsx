import React from 'react';
import MessageComponent from '@/components/MessageComponent';

interface ClientMessagesTabProps {
  clientId: string;
}

const ClientMessagesTab: React.FC<ClientMessagesTabProps> = ({ clientId }) => {
  return (
    <div className="h-[700px]">
      <MessageComponent 
        clientId={clientId}
        showHeader={false}
        className="h-full"
      />
    </div>
  );
};

export default ClientMessagesTab;
