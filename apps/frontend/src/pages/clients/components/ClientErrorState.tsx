
import React from 'react';
import { Button } from '@/components/basic/button';

interface ClientErrorStateProps {
  onRetry: () => void;
}

const ClientErrorState: React.FC<ClientErrorStateProps> = ({ onRetry }) => {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error loading clients</h2>
        <p className="text-gray-600 mb-4">Failed to load client data. Please try again.</p>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    </div>
  );
};

export default ClientErrorState;
