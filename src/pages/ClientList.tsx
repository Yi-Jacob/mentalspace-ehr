
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { useOptimizedQuery } from '@/hooks/useOptimizedQuery';
import AddClientModal from '../components/AddClientModal';
import ClientListHeader from '../components/client-list/ClientListHeader';
import ClientSearch from '../components/client-list/ClientSearch';
import ClientGrid from '../components/client-list/ClientGrid';
import ClientEmptyState from '../components/client-list/ClientEmptyState';
import ClientLoadingState from '../components/client-list/ClientLoadingState';
import ClientErrorState from '../components/client-list/ClientErrorState';

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name?: string;
  date_of_birth?: string;
  email?: string;
  city?: string;
  state?: string;
  assigned_clinician_id?: string;
  is_active: boolean;
  created_at: string;
}

const ClientList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Optimized query with specific field selection
  const { data: clients = [], isLoading, error, refetch } = useOptimizedQuery(
    ['clients', 'active'],
    async () => {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          id,
          first_name,
          last_name,
          preferred_name,
          date_of_birth,
          email,
          city,
          state,
          assigned_clinician_id,
          is_active,
          created_at
        `)
        .eq('is_active', true)
        .order('last_name', { ascending: true });

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
      return data || [];
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const filteredClients = clients.filter(client => {
    const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
    const preferredName = client.preferred_name?.toLowerCase() || '';
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
    navigate(`/client/${clientId}`);
  };

  if (error) {
    return <ClientErrorState onRetry={() => refetch()} />;
  }

  if (isLoading) {
    return <ClientLoadingState />;
  }

  return (
    <div className="p-6 space-y-6">
      <ClientListHeader onAddClient={() => setShowAddModal(true)} />

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
    </div>
  );
};

export default ClientList;
