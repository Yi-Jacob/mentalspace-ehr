
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ClientEmptyStateProps {
  searchTerm: string;
  onAddClient: () => void;
}

const ClientEmptyState: React.FC<ClientEmptyStateProps> = ({ searchTerm, onAddClient }) => {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H5V21H19V9Z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
      <p className="text-gray-500 mb-6">
        {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first client'}
      </p>
      {!searchTerm && (
        <Button onClick={onAddClient} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Client
        </Button>
      )}
    </div>
  );
};

export default ClientEmptyState;
