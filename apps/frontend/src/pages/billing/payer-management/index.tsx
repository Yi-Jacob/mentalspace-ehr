import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/basic/button';
import { Table, TableColumn } from '@/components/basic/table';
import { Badge } from '@/components/basic/badge';
import { Building2, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { billingService, Payer } from '@/services/billingService';
import PayerModal from '../components/payer/PayerModal';

const PayerManagementPage: React.FC = () => {
  const [selectedPayer, setSelectedPayer] = useState<Payer | null>(null);
  const [showPayerModal, setShowPayerModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const { data: payers, isLoading } = useQuery({
    queryKey: ['payers'],
    queryFn: async () => {
      return await billingService.getAllPayers();
    },
  });

  const getPayerTypeColor = (type: string) => {
    switch (type) {
      case 'in_network':
        return 'bg-green-100 text-green-800';
      case 'out_of_network':
        return 'bg-yellow-100 text-yellow-800';
      case 'self_pay':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPayerType = (type: string) => {
    switch (type) {
      case 'in_network':
        return 'In-Network';
      case 'out_of_network':
        return 'Out-of-Network';
      case 'self_pay':
        return 'Self-Pay';
      default:
        return type;
    }
  };

  const handleCreatePayer = () => {
    setSelectedPayer(null);
    setModalMode('create');
    setShowPayerModal(true);
  };

  const handleEditPayer = (payer: Payer) => {
    setSelectedPayer(payer);
    setModalMode('edit');
    setShowPayerModal(true);
  };

  const handleViewPayer = (payer: Payer) => {
    setSelectedPayer(payer);
    setModalMode('view');
    setShowPayerModal(true);
  };

  const handleDeletePayer = (payer: Payer) => {
    setSelectedPayer(payer);
    setModalMode('view');
    setShowPayerModal(true);
  };

  const columns: TableColumn<Payer>[] = [
    {
      key: 'name',
      header: 'Payer Name',
      accessor: (payer) => payer.name,
      sortable: true,
      searchable: true,
    },
    {
      key: 'payerType',
      header: 'Type',
      accessor: (payer) => (
        <Badge className={getPayerTypeColor(payer.payerType)}>
          {formatPayerType(payer.payerType)}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'electronicPayerId',
      header: 'Payer ID',
      accessor: (payer) => payer.electronicPayerId || '-',
      sortable: true,
      searchable: true,
    },
    {
      key: 'phoneNumber',
      header: 'Phone',
      accessor: (payer) => payer.phoneNumber || '-',
      sortable: true,
      searchable: true,
    },
    {
      key: 'requiresAuthorization',
      header: 'Auth Required',
      accessor: (payer) => (
        payer.requiresAuthorization ? (
          <Badge variant="outline" className="text-xs">
            Yes
          </Badge>
        ) : (
          <span className="text-gray-400">No</span>
        )
      ),
      sortable: true,
    },
    {
      key: 'createdAt',
      header: 'Created',
      accessor: (payer) => new Date(payer.createdAt).toLocaleDateString(),
      sortable: true,
    },
  ];

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={Building2}
        title="Payer Management"
        description="Manage insurance companies, contracts, and fee schedules"
      />

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {payers?.length || 0} Payers
            </h2>
          </div>
          <Button onClick={handleCreatePayer} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Payer</span>
          </Button>
        </div>

        {/* Payers Table */}
        <Table
          data={payers || []}
          columns={columns}
          loading={isLoading}
          searchable={true}
          pagination={true}
          pageSize={10}
          emptyMessage={
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payers found</h3>
              <p className="text-gray-600 mb-4">
                Get started by adding your first payer.
              </p>
              <Button onClick={handleCreatePayer}>
                <Plus className="h-4 w-4 mr-2" />
                Add Payer
              </Button>
            </div>
          }
          actions={[
            {
              label: 'View',
              icon: <Eye className="h-4 w-4" />,
              onClick: handleViewPayer,
              variant: 'ghost',
            },
            {
              label: 'Edit',
              icon: <Edit className="h-4 w-4" />,
              onClick: handleEditPayer,
              variant: 'ghost',
            },
          ]}
        />

        {/* Modal */}
        <PayerModal
          isOpen={showPayerModal}
          onClose={() => {
            setShowPayerModal(false);
            setSelectedPayer(null);
          }}
          payer={selectedPayer}
          mode={modalMode}
        />
      </div>
    </PageLayout>
  );
};

export default PayerManagementPage;
