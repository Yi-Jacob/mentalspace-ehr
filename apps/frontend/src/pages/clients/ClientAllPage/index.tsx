import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Plus, Phone, Mail, Calendar, Eye } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { Table, TableColumn } from '@/components/basic/table';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { useClients } from '@/pages/clients/hook/useClients';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import ClientErrorState from '../components/ClientErrorState';
import { ClientFormData } from '@/types/clientType';

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();

  // Use the new useClients hook
  const { 
    clients, 
    isLoading, 
    error, 
    refetchClients 
  } = useClients();

  const handleClientClick = (client: ClientFormData) => {
    navigate(`/clients/${client.id}`);
  };

  const handleAddClient = () => {
    navigate('/clients/add');
  };

  const handleCallClient = (client: ClientFormData) => {
    // TODO: Implement call functionality
    console.log('Call client:', client);
  };

  const handleEmailClient = (client: ClientFormData) => {
    // TODO: Implement email functionality
    console.log('Email client:', client);
  };

  const handleScheduleAppointment = (client: ClientFormData) => {
    // TODO: Implement schedule appointment functionality
    console.log('Schedule appointment for:', client);
  };

  const formatAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return `${age - 1} years`;
    }
    return `${age} years`;
  };

  const formatName = (client: ClientFormData) => {
    const fullName = client.preferredName && client.preferredName !== client.firstName
      ? `${client.preferredName} (${client.firstName}) ${client.lastName}`
      : `${client.firstName} ${client.lastName}`;
    
    return (
      <div>
        <div className="font-medium text-gray-900">{fullName}</div>
        {client.dateOfBirth && (
          <div className="text-sm text-gray-500">{formatAge(client.dateOfBirth)}</div>
        )}
      </div>
    );
  };

  const formatLocation = (client: ClientFormData) => {
    const location = [client.city, client.state].filter(Boolean).join(', ');
    return location || 'Not specified';
  };

  const formatStatus = (client: ClientFormData) => {
    return (
      <Badge variant={client.isActive ? 'default' : 'secondary'} className="text-xs">
        {client.isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  };

  const formatAssignment = (client: ClientFormData) => {
    return client.assignedClinicianId && client.assignedClinicianId !== 'unassigned'
      ? client.assignedClinicianId
      : 'Unassigned';
  };

  const tableColumns: TableColumn<ClientFormData>[] = [
    {
      key: 'name',
      header: 'Name',
      accessor: formatName,
      sortable: true,
      searchable: true,
      searchValue: (client) => `${client.firstName} ${client.lastName} ${client.preferredName || ''}`,
      width: '25%'
    },
    {
      key: 'email',
      header: 'Email',
      accessor: (client) => client.email || 'Not provided',
      sortable: true,
      searchable: true,
      width: '20%'
    },
    {
      key: 'location',
      header: 'Location',
      accessor: formatLocation,
      sortable: true,
      searchable: true,
      searchValue: (client) => `${client.city || ''} ${client.state || ''}`,
      width: '15%'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: formatStatus,
      sortable: true,
      width: '10%'
    },
    {
      key: 'assignment',
      header: 'Assigned To',
      accessor: formatAssignment,
      sortable: true,
      searchable: true,
      width: '15%'
    }
  ];

  if (error) {
    return <ClientErrorState onRetry={() => refetchClients()} />;
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading clients..." />;
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

      {clients.length === 0 && !isLoading ? (
        <EmptyState 
          title="No clients found"
          description="Get started by adding your first client to the system."
          actionLabel="Add New Client"
          onAction={handleAddClient}
          icon={User}
        />
      ) : (
        <Table
          data={clients}
          columns={tableColumns}
          onRowClick={handleClientClick}
          pageSize={15}
          pageSizeOptions={[10, 15, 25, 50]}
          emptyMessage="No clients found"
          loading={isLoading}
          actions={[
            {
              label: 'View Details',
              icon: <Eye className="w-3 h-3" />,
              onClick: handleClientClick,
              variant: 'ghost'
            },
            {
              label: 'Call',
              icon: <Phone className="w-3 h-3" />,
              onClick: handleCallClient,
              variant: 'ghost'
            },
            {
              label: 'Email',
              icon: <Mail className="w-3 h-3" />,
              onClick: handleEmailClient,
              variant: 'ghost'
            },
            {
              label: 'Schedule',
              icon: <Calendar className="w-3 h-3" />,
              onClick: handleScheduleAppointment,
              variant: 'ghost'
            }
          ]}
        />
      )}
    </PageLayout>
  );
};

export default ClientsPage; 