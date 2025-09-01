import React from 'react';
import { Button } from '@/components/basic/button';
import { DollarSign, Plus } from 'lucide-react';

interface ProviderCompensationEmptyStateProps {
  isPracticeAdmin: boolean;
  selectedProvider: string;
  onAddConfiguration: () => void;
}

const ProviderCompensationEmptyState: React.FC<ProviderCompensationEmptyStateProps> = ({
  isPracticeAdmin,
  selectedProvider,
  onAddConfiguration,
}) => {
  return (
    <div className="text-center py-12">
      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No compensation configurations found</h3>
      <p className="text-gray-600 mb-4">
        {isPracticeAdmin 
          ? (selectedProvider === 'all' 
              ? 'No compensation configurations have been set up yet.'
              : 'No compensation configuration found for the selected provider.')
          : 'You don\'t have any compensation configurations set up yet.'
        }
      </p>
      <Button onClick={onAddConfiguration}>
        <Plus className="h-4 w-4 mr-2" />
        Add Configuration
      </Button>
    </div>
  );
};

export default ProviderCompensationEmptyState;
