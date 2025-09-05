import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Badge } from '@/components/basic/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { FileText, Search, Plus, Send, AlertTriangle, CheckCircle, Eye, Edit, Trash2, Upload } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Table, TableColumn } from '@/components/basic/table';
import { billingService, Claim } from '@/services/billingService';
import ClaimModal from '../components/claims/ClaimModal';
import { useToast } from '@/hooks/use-toast';

const ClaimsSubmissionPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'submitted' | 'paid' | 'denied' | 'rejected'>('all');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: claims = [], isLoading } = useQuery({
    queryKey: ['claims', searchTerm, statusFilter],
    queryFn: async () => {
      const allClaims = await billingService.getAllClaims();
      
      let filteredClaims = allClaims;
      
      if (statusFilter !== 'all') {
        filteredClaims = filteredClaims.filter(c => c.status === statusFilter);
      }

      if (searchTerm) {
        filteredClaims = filteredClaims.filter(c => 
          c.claimNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.client?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.client?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return filteredClaims;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => billingService.deleteClaim(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast({
        title: "Success",
        description: "Claim deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete claim",
        variant: "destructive",
      });
    },
  });

  const submitMutation = useMutation({
    mutationFn: (id: string) => billingService.updateClaim(id, { status: 'submitted', submissionDate: new Date().toISOString() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast({
        title: "Success",
        description: "Claim submitted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit claim",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      case 'rejected':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'denied':
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  const handleCreateClaim = () => {
    setSelectedClaim(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditClaim = (claim: Claim) => {
    setSelectedClaim(claim);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewClaim = (claim: Claim) => {
    setSelectedClaim(claim);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeleteClaim = (claim: Claim) => {
    if (window.confirm('Are you sure you want to delete this claim?')) {
      deleteMutation.mutate(claim.id);
    }
  };

  const handleSubmitClaim = (claim: Claim) => {
    if (window.confirm('Are you sure you want to submit this claim?')) {
      submitMutation.mutate(claim.id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedClaim(null);
  };

  // Define table columns
  const columns: TableColumn<Claim>[] = [
    {
      key: 'claimNumber',
      header: 'Claim Number',
      accessor: (claim) => `#${claim.claimNumber}`,
      sortable: true,
      searchable: true,
    },
    {
      key: 'client',
      header: 'Patient',
      accessor: (claim) => `${claim.client?.firstName || ''} ${claim.client?.lastName || ''}`,
      sortable: true,
      searchable: true,
    },
    {
      key: 'payer',
      header: 'Payer',
      accessor: (claim) => claim.payer?.name || 'N/A',
      sortable: true,
      searchable: true,
    },
    {
      key: 'serviceDate',
      header: 'Service Date',
      accessor: (claim) => new Date(claim.serviceDate).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (claim) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(claim.status || 'draft')}
          <Badge className={getStatusColor(claim.status || 'draft')}>
            {claim.status || 'draft'}
          </Badge>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      accessor: (claim) => `$${parseFloat(claim.totalAmount.toString()).toFixed(2)}`,
      sortable: true,
    },
    {
      key: 'paidAmount',
      header: 'Paid Amount',
      accessor: (claim) => claim.paidAmount ? `$${parseFloat(claim.paidAmount.toString()).toFixed(2)}` : 'N/A',
      sortable: true,
    },
    {
      key: 'submissionDate',
      header: 'Submitted',
      accessor: (claim) => claim.submissionDate ? new Date(claim.submissionDate).toLocaleDateString() : 'Not submitted',
      sortable: true,
    },
  ];

  if (isLoading) {
    return (
      <PageLayout variant="simple">
        <PageHeader
          icon={FileText}
          title="Claims Submission"
          description="Submit and track insurance claims"
        />
        <div className="text-center py-8">Loading claims...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={FileText}
        title="Claims Submission"
        description="Submit and track insurance claims"
      />

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search claims..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value: 'all' | 'draft' | 'submitted' | 'paid' | 'denied' | 'rejected') => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Batch Submit</span>
            </Button>
            <Button onClick={handleCreateClaim} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Claim</span>
            </Button>
          </div>
        </div>

        {/* Claims Table */}
        <Table
          data={claims}
          columns={columns}
          loading={isLoading}
          searchable={true}
          pagination={true}
          pageSize={10}
          emptyMessage="No claims found. Create your first claim to get started."
          actions={[
            { 
              label: 'View', 
              icon: <Eye className="h-4 w-4" />, 
              onClick: handleViewClaim, 
              variant: 'ghost' 
            },
            { 
              label: 'Edit', 
              icon: <Edit className="h-4 w-4" />, 
              onClick: handleEditClaim, 
              variant: 'ghost' 
            },
            { 
              label: 'Submit', 
              icon: <Send className="h-4 w-4" />, 
              onClick: handleSubmitClaim, 
              variant: 'default',
              disabled: (claim) => claim.status === 'submitted' || claim.status === 'paid'
            },
            { 
              label: 'Delete', 
              icon: <Trash2 className="h-4 w-4" />, 
              onClick: handleDeleteClaim, 
              variant: 'destructive',
              disabled: (claim) => claim.status === 'submitted' || claim.status === 'paid'
            },
          ]}
        />

        {/* Claim Modal */}
        <ClaimModal
          isOpen={showModal}
          onClose={handleCloseModal}
          claim={selectedClaim}
          mode={modalMode}
        />
      </div>
    </PageLayout>
  );
};

export default ClaimsSubmissionPage;
