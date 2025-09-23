import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Plus, Eye, Mail } from 'lucide-react';
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
import { toast } from 'sonner';
import { clientService } from '@/services/clientService';

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [sendingEmails, setSendingEmails] = useState<Set<string>>(new Set());

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

  const handleSendWelcomeEmail = async (client: ClientFormData) => {
    setSendingEmails(prev => new Set(prev).add(client.id));
    
    try {
      const result = await clientService.sendClientEmail(client.id);

      if (result.success) {
        toast.success(result.message || 'Email sent successfully!');
      } else {
        toast.error(result.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    } finally {
      setSendingEmails(prev => {
        const newSet = new Set(prev);
        newSet.delete(client.id);
        return newSet;
      });
    }
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

  const formatSex = (client: ClientFormData) => {
    return client.administrativeSex || 'Not specified';
  };

  const formatAssignment = (client: ClientFormData) => {
    // Check if we have clinicians data from the new structure
    const clientWithStaff = client as ClientFormData & { 
      clinicians?: { 
        id: string;
        clinician: {
          id: string;
          jobTitle?: string;
          clinicianType?: string;
          user: {
            firstName: string;
            lastName: string;
            email: string;
          };
        };
      }[];
    };
    
    if (clientWithStaff.clinicians && clientWithStaff.clinicians.length > 0) {
      return (
        <div>
          {clientWithStaff.clinicians.map((assignment, index) => (
            <div key={assignment.id} className={index > 0 ? "mt-1" : ""}>
              <div className="font-medium text-gray-900">
                {assignment.clinician.user.firstName} {assignment.clinician.user.lastName}
              </div>
              {(assignment.clinician.jobTitle || assignment.clinician.clinicianType) && (
                <div className="text-sm text-gray-500">
                  {assignment.clinician.jobTitle || assignment.clinician.clinicianType}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    // No clinicians assigned
    return 'Unassigned';
  };

  const tableColumns: TableColumn<ClientFormData>[] = [
    {
      key: 'name',
      header: 'Name',
      accessor: formatName,
      sortable: true,
      searchable: true,
      searchValue: (client) => `${client.firstName} ${client.lastName} ${client.preferredName || ''}`
    },
    {
      key: 'email',
      header: 'Email',
      accessor: (client) => client.email || 'Not provided',
      sortable: true,
      searchable: true
    },
    {
      key: 'sex',
      header: 'Sex',
      accessor: formatSex,
      sortable: true,
      searchable: true
    },
    {
      key: 'location',
      header: 'Location',
      accessor: formatLocation,
      sortable: true,
      searchable: true,
      searchValue: (client) => `${client.city || ''} ${client.state || ''}`
    },
    {
      key: 'assignment',
      header: 'Assigned To',
      accessor: formatAssignment,
      sortable: true,
      searchable: true
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
              label: (client) => {
                const isSendingEmail = sendingEmails.has(client.id);
                if (isSendingEmail) return 'Sending...';
                
                const hasPassword = client?.hasPassword;
                return hasPassword ? 'Send Reset Password' : 'Send Welcome';
              },
              icon: <Mail className="w-3 h-3" />,
              onClick: (client) => {
                handleSendWelcomeEmail(client);
              },
              variant: 'ghost',
              disabled: (client) => {
                const isSendingEmail = sendingEmails.has(client.id);
                return isSendingEmail;
              }
            }
          ]}
        />
      )}
    </PageLayout>
  );
};

export default ClientsPage; 