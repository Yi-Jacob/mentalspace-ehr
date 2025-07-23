import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { clientService } from '@/services/clientService';
import { ClientFormData } from '@/types/client';
import ClientSearch from './components/ClientSearch';
import ClientGrid from './components/ClientGrid';
import ClientEmptyState from './components/ClientEmptyState';
import ClientLoadingState from './components/ClientLoadingState';
import ClientErrorState from './components/ClientErrorState';
import AddClientModal from './components/AddClientModal';

const ClientsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Optimized query with specific field selection
  const { data: clients = [], isLoading, error, refetch } = useOptimizedQuery(
    ['clients', 'active'],
    async () => {
      return await clientService.getClients();
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const filteredClients = clients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const preferredName = client.preferredName?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || 
           preferredName.includes(search) ||
           client.email?.toLowerCase().includes(search);
  });

  // Pagination for filtered clients
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination(filteredClients, { pageSize: 12 });

  const handleClientAdded = () => {
    refetch();
    setShowAddModal(false);
    toast({
      title: "Success",
      description: "Client added successfully",
    });
  };

  const handleClientClick = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  if (error) {
    return <ClientErrorState onRetry={() => refetch()} />;
  }

  if (isLoading) {
    return <ClientLoadingState />;
  }

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={User}
        title="Client Management"
        description="Manage your client records and information"
        action={
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Client
          </Button>
        }
      />

      <ClientSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        totalPages={totalPages}
      />

      <ClientGrid 
        clients={paginatedData}
        onClientClick={handleClientClick}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}

      {filteredClients.length === 0 && !isLoading && (
        <ClientEmptyState 
          searchTerm={searchTerm}
          onAddClient={() => setShowAddModal(true)}
        />
      )}

      <AddClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onClientAdded={handleClientAdded}
      />
    </PageLayout>
  );
};

export default ClientsPage; 