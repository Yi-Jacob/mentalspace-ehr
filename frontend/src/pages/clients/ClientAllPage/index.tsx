import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { useClients } from '@/hooks/useClients';
import ClientSearch from '../components/ClientSearch';
import ClientGrid from '../components/ClientGrid';
import ClientEmptyState from '../components/ClientEmptyState';
import ClientLoadingState from '../components/ClientLoadingState';
import ClientErrorState from '../components/ClientErrorState';

const ClientsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Use the new useClients hook
  const { 
    clients, 
    isLoading, 
    error, 
    refetchClients 
  } = useClients();

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

  const handleClientClick = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const handleAddClient = () => {
    navigate('/clients/add');
  };

  if (error) {
    return <ClientErrorState onRetry={() => refetchClients()} />;
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
            onClick={handleAddClient}
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
          onAddClient={handleAddClient}
        />
      )}
    </PageLayout>
  );
};

export default ClientsPage; 