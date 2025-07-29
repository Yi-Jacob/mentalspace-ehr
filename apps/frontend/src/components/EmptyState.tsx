import React from 'react';
import { Button } from '@/components/basic/button';
import { Plus, Search } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  searchTerm?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data found",
  description = "There are no items to display at the moment.",
  searchTerm,
  actionLabel,
  onAction,
  icon: Icon = Search
}) => {
  const hasSearchTerm = searchTerm && searchTerm.trim().length > 0;
  
  const getTitle = () => {
    if (hasSearchTerm) {
      return `No results found for "${searchTerm}"`;
    }
    return title;
  };

  const getDescription = () => {
    if (hasSearchTerm) {
      return "Try adjusting your search terms or browse all items.";
    }
    return description;
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <Icon className="h-12 w-12" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {getTitle()}
        </h3>
        
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          {getDescription()}
        </p>
        
        {onAction && actionLabel && (
          <Button
            onClick={onAction}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState; 