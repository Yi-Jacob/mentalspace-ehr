import React, { memo, useMemo, useCallback } from 'react';
import { useVirtualScrolling } from '@/hooks/usePerformanceOptimization';
import OptimizedClientCard from './OptimizedClientCard';
import { ClientFormData } from '@/types/client';

type Client = ClientFormData & {
  id: string;
  created_at?: string;
  updated_at?: string;
  phone_numbers?: Array<{ phone_number: string; phone_type: string }>;
};
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, SortAsc } from 'lucide-react';

interface VirtualizedClientListProps {
  clients: Client[];
  onClientSelect: (client: Client) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  containerHeight?: number;
}

const CARD_HEIGHT = 180; // Approximate height of each client card

// Memoized search and filter logic
const useClientFiltering = (clients: Client[], searchTerm: string) => {
  return useMemo(() => {
    if (!searchTerm.trim()) return clients;
    
    const term = searchTerm.toLowerCase();
    return clients.filter(client => {
      const fullName = `${client.first_name || ''} ${client.last_name || ''}`.toLowerCase();
      const email = client.email?.toLowerCase() || '';
      
      return fullName.includes(term) || 
             email.includes(term) ||
             client.phone_numbers?.some(p => p.phone_number.includes(term));
    });
  }, [clients, searchTerm]);
};

// Memoized sort logic
const useClientSorting = (clients: Client[], sortBy: 'name' | 'date' | 'status') => {
  return useMemo(() => {
    const sorted = [...clients];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => {
          const nameA = `${a.first_name || ''} ${a.last_name || ''}`;
          const nameB = `${b.first_name || ''} ${b.last_name || ''}`;
          return nameA.localeCompare(nameB);
        });
      case 'date':
        return sorted.sort((a, b) => 
          new Date(b.updated_at || b.created_at || '').getTime() - 
          new Date(a.updated_at || a.created_at || '').getTime()
        );
      case 'status':
        return sorted.sort((a, b) => {
          if (a.is_active === b.is_active) return 0;
          return a.is_active ? -1 : 1;
        });
      default:
        return sorted;
    }
  }, [clients, sortBy]);
};

const VirtualizedClientList: React.FC<VirtualizedClientListProps> = memo(({
  clients,
  onClientSelect,
  searchTerm = '',
  onSearchChange,
  containerHeight = 600
}) => {
  const [sortBy, setSortBy] = React.useState<'name' | 'date' | 'status'>('name');
  const [localSearchTerm, setLocalSearchTerm] = React.useState(searchTerm);

  // Filter and sort clients
  const filteredClients = useClientFiltering(clients, localSearchTerm);
  const sortedClients = useClientSorting(filteredClients, sortBy);

  // Virtual scrolling for performance with large lists
  const {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  } = useVirtualScrolling(sortedClients, CARD_HEIGHT, containerHeight);

  // Debounced search to prevent excessive filtering
  const debouncedSearchChange = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (term: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onSearchChange?.(term);
      }, 300);
    };
  }, [onSearchChange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    debouncedSearchChange(value);
  }, [debouncedSearchChange]);

  const handleSortChange = useCallback((newSortBy: typeof sortBy) => {
    setSortBy(newSortBy);
  }, []);

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, email, or phone..."
            value={localSearchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={sortBy === 'name' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSortChange('name')}
          >
            <SortAsc className="h-4 w-4 mr-1" />
            Name
          </Button>
          
          <Button
            variant={sortBy === 'date' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSortChange('date')}
          >
            <Filter className="h-4 w-4 mr-1" />
            Recent
          </Button>
          
          <Button
            variant={sortBy === 'status' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSortChange('status')}
          >
            <Filter className="h-4 w-4 mr-1" />
            Status
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredClients.length} of {clients.length} clients
        {localSearchTerm && ` matching "${localSearchTerm}"`}
      </div>

      {/* Virtualized List Container */}
      <div 
        className="relative overflow-auto border rounded-lg"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        {/* Virtual list content */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div 
            style={{ 
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {visibleItems.map((client, index) => (
                <OptimizedClientCard
                  key={client.id}
                  client={client}
                  onClick={onClientSelect}
                  priority={index < 3 ? 'high' : 'normal'} // First 3 are high priority
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg font-medium text-muted-foreground">
            {localSearchTerm ? 'No clients found matching your search' : 'No clients yet'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {localSearchTerm 
              ? 'Try adjusting your search terms' 
              : 'Add your first client to get started'
            }
          </p>
        </div>
      )}
    </div>
  );
});

VirtualizedClientList.displayName = 'VirtualizedClientList';

export default VirtualizedClientList;