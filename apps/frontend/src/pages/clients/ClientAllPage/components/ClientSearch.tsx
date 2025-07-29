
import React from 'react';
import { Input } from '@/components/basic/input';
import { Badge } from '@/components/basic/badge';
import { Search } from 'lucide-react';

interface ClientSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  totalPages: number;
}

const ClientSearch: React.FC<ClientSearchProps> = ({
  searchTerm,
  onSearchChange,
  totalItems,
  startIndex,
  endIndex,
  totalPages,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search clients by name or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Badge variant="secondary" className="text-sm">
          {totalItems} total clients
        </Badge>
        {totalPages > 1 && (
          <Badge variant="outline" className="text-sm">
            Showing {startIndex + 1}-{endIndex} of {totalItems}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ClientSearch;
