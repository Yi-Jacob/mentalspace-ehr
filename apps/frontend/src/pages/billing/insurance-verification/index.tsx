import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Shield, Search, Plus, Calendar, AlertCircle, CheckCircle, Clock, Eye, Edit, Trash2 } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Table, TableColumn } from '@/components/basic/table';
import { Badge } from '@/components/basic/badge';
import { clientService } from '@/services/clientService';
import { billingService, InsuranceVerification } from '@/services/billingService';
import VerificationModal from '../components/verification/VerificationModal';
import { useToast } from '@/hooks/use-toast';

const InsuranceVerificationPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'expired'>('all');
  const [selectedVerification, setSelectedVerification] = useState<InsuranceVerification | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: verifications = [], isLoading } = useQuery({
    queryKey: ['insurance-verifications', searchTerm, statusFilter],
    queryFn: async () => {
      const allVerifications = await billingService.getAllVerifications();
      
      let filteredVerifications = allVerifications;
      
      if (statusFilter !== 'all') {
        filteredVerifications = filteredVerifications.filter(v => v.status === statusFilter);
      }

      if (searchTerm) {
        filteredVerifications = filteredVerifications.filter(v => 
          v.client?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.client?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return filteredVerifications;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => billingService.deleteVerification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-verifications'] });
      toast({
        title: "Success",
        description: "Verification deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete verification",
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const isVerificationDue = (nextVerificationDate: string | null) => {
    if (!nextVerificationDate) return false;
    const dueDate = new Date(nextVerificationDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const handleCreateVerification = () => {
    setSelectedVerification(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditVerification = (verification: InsuranceVerification) => {
    setSelectedVerification(verification);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewVerification = (verification: InsuranceVerification) => {
    setSelectedVerification(verification);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeleteVerification = (verification: InsuranceVerification) => {
    if (window.confirm('Are you sure you want to delete this verification?')) {
      deleteMutation.mutate(verification.id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVerification(null);
  };

  // Define table columns
  const columns: TableColumn<InsuranceVerification>[] = [
    {
      key: 'client',
      header: 'Client',
      accessor: (verification) => `${verification.client?.firstName || ''} ${verification.client?.lastName || ''}`,
      sortable: true,
      searchable: true,
    },
    {
      key: 'insurance',
      header: 'Insurance',
      accessor: (verification) => verification.insurance?.insuranceCompany || 'N/A',
      sortable: true,
      searchable: true,
    },
    {
      key: 'policy',
      header: 'Policy Number',
      accessor: (verification) => verification.insurance?.policyNumber || 'N/A',
      sortable: true,
      searchable: true,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (verification) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(verification.status || 'pending')}
          <Badge className={getStatusColor(verification.status || 'pending')}>
            {verification.status || 'pending'}
          </Badge>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'verificationDate',
      header: 'Verified Date',
      accessor: (verification) => new Date(verification.verificationDate).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'verifiedBy',
      header: 'Verified By',
      accessor: (verification) => verification.verifiedByStaff?.formalName || verification.verifiedBy || 'N/A',
      sortable: true,
      searchable: true,
    },
    {
      key: 'nextVerification',
      header: 'Next Verification',
      accessor: (verification) => {
        if (!verification.nextVerificationDate) return 'N/A';
        const isDue = isVerificationDue(verification.nextVerificationDate);
        return (
          <div className="flex items-center space-x-2">
            <span>{new Date(verification.nextVerificationDate).toLocaleDateString()}</span>
            {isDue && (
              <Badge variant="destructive" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Due Soon
              </Badge>
            )}
          </div>
        );
      },
      sortable: true,
    },
  ];

  if (isLoading) {
    return (
      <PageLayout variant="simple">
        <PageHeader
          icon={Shield}
          title="Insurance Verification"
          description="Verify benefits and manage authorization requirements"
        />
        <div className="text-center py-8">Loading verifications...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={Shield}
        title="Insurance Verification"
        description="Verify benefits and manage authorization requirements"
      />

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value: 'all' | 'pending' | 'verified' | 'expired') => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleCreateVerification} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Verification</span>
          </Button>
        </div>

        {/* Verifications Table */}
        <Table
          data={verifications}
          columns={columns}
          loading={isLoading}
          searchable={true}
          pagination={true}
          pageSize={10}
          emptyMessage="No verifications found. Create your first verification to get started."
          actions={[
            { 
              label: 'View', 
              icon: <Eye className="h-4 w-4" />, 
              onClick: handleViewVerification, 
              variant: 'ghost' 
            },
            { 
              label: 'Edit', 
              icon: <Edit className="h-4 w-4" />, 
              onClick: handleEditVerification, 
              variant: 'ghost' 
            },
            { 
              label: 'Delete', 
              icon: <Trash2 className="h-4 w-4" />, 
              onClick: handleDeleteVerification, 
              variant: 'destructive' 
            },
          ]}
        />

        {/* Verification Modal */}
        <VerificationModal
          isOpen={showModal}
          onClose={handleCloseModal}
          verification={selectedVerification}
          mode={modalMode}
        />
      </div>
    </PageLayout>
  );
};

export default InsuranceVerificationPage;
