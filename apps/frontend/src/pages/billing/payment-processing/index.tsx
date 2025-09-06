import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Badge } from '@/components/basic/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { CreditCard, Search, Plus, DollarSign, Eye, Edit, Trash2, Receipt } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Table, TableColumn } from '@/components/basic/table';
import { billingService, Payment } from '@/services/billingService';
import PaymentModal from '../components/payments/PaymentModal';
import { useToast } from '@/hooks/use-toast';

const PaymentProcessingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed' | 'refunded'>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments', searchTerm, statusFilter],
    queryFn: async () => {
      const allPayments = await billingService.getAllPayments();
      
      let filteredPayments = allPayments;
      
      if (statusFilter !== 'all') {
        filteredPayments = filteredPayments.filter(p => p.status === statusFilter);
      }

      if (searchTerm) {
        filteredPayments = filteredPayments.filter(p => 
          p.paymentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.client?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.client?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return filteredPayments;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => billingService.deletePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        title: 'Success',
        description: 'Payment deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete payment',
        variant: 'destructive',
      });
    },
  });

  const handleCreatePayment = () => {
    setSelectedPayment(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeletePayment = (payment: Payment) => {
    if (window.confirm(`Are you sure you want to delete payment ${payment.paymentNumber}?`)) {
      deleteMutation.mutate(payment.id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <CreditCard className="h-4 w-4 text-yellow-600" />;
      case 'failed':
        return <CreditCard className="h-4 w-4 text-red-600" />;
      case 'refunded':
        return <CreditCard className="h-4 w-4 text-gray-600" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'ach':
        return 'ACH';
      case 'cash':
        return 'Cash';
      case 'check':
        return 'Check';
      case 'insurance':
        return 'Insurance';
      default:
        return method;
    }
  };

  const columns: TableColumn<Payment>[] = [
    { 
      key: 'paymentNumber', 
      header: 'Payment Number', 
      accessor: (p) => `#${p.paymentNumber}`, 
      sortable: true, 
      searchable: true 
    },
    { 
      key: 'client', 
      header: 'Patient', 
      accessor: (p) => `${p.client?.firstName || ''} ${p.client?.lastName || ''}`, 
      sortable: true, 
      searchable: true 
    },
    { 
      key: 'payer', 
      header: 'Payer', 
      accessor: (p) => p.payer?.name || 'Patient', 
      sortable: true, 
      searchable: true 
    },
    { 
      key: 'claim', 
      header: 'Claim', 
      accessor: (p) => p.claim?.claimNumber || 'Direct Payment', 
      sortable: true, 
      searchable: true 
    },
    { 
      key: 'paymentDate', 
      header: 'Payment Date', 
      accessor: (p) => new Date(p.paymentDate).toLocaleDateString(), 
      sortable: true 
    },
    { 
      key: 'status', 
      header: 'Status', 
      accessor: (p) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(p.status || 'pending')}
          <Badge className={getStatusColor(p.status || 'pending')}>
            {p.status || 'pending'}
          </Badge>
        </div>
      ), 
      sortable: true 
    },
    { 
      key: 'paymentAmount', 
      header: 'Amount', 
      accessor: (p) => `$${parseFloat(p.paymentAmount.toString()).toFixed(2)}`, 
      sortable: true 
    },
    { 
      key: 'netAmount', 
      header: 'Net Amount', 
      accessor: (p) => p.netAmount ? `$${parseFloat(p.netAmount.toString()).toFixed(2)}` : 'N/A', 
      sortable: true 
    },
    { 
      key: 'paymentMethod', 
      header: 'Method', 
      accessor: (p) => formatPaymentMethod(p.paymentMethod), 
      sortable: true 
    },
  ];

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={CreditCard}
        title="Payment Processing"
        description="Process payments and manage patient accounts"
      />

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value: 'all' | 'pending' | 'completed' | 'failed' | 'refunded') => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleCreatePayment} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Process Payment</span>
          </Button>
        </div>

        {/* Payments Table */}
        <Table
          data={payments}
          columns={columns}
          loading={isLoading}
          searchable={true}
          pagination={true}
          pageSize={10}
          emptyMessage="No payments found. Process your first payment to get started."
          actions={[
            { label: 'View', icon: <Eye className="h-4 w-4" />, onClick: handleViewPayment, variant: 'ghost' },
            { label: 'Edit', icon: <Edit className="h-4 w-4" />, onClick: handleEditPayment, variant: 'ghost' },
            { label: 'Receipt', icon: <Receipt className="h-4 w-4" />, onClick: handleViewPayment, variant: 'ghost', disabled: (p) => p.status !== 'completed' },
            { label: 'Delete', icon: <Trash2 className="h-4 w-4" />, onClick: handleDeletePayment, variant: 'destructive', disabled: (p) => p.status === 'completed' },
          ]}
        />

        <PaymentModal 
          isOpen={showModal} 
          onClose={handleCloseModal} 
          payment={selectedPayment} 
          mode={modalMode} 
        />
      </div>
    </PageLayout>
  );
};

export default PaymentProcessingPage;
