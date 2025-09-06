import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Badge } from '@/components/basic/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Receipt, Search, Plus, FileText, Send, Mail, Download, Eye, Edit, Trash2 } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Table, TableColumn } from '@/components/basic/table';
import { billingService, PatientStatement } from '@/services/billingService';
import StatementModal from '../components/statements/StatementModal';
import { useToast } from '@/hooks/use-toast';

const StatementGenerationPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'sent' | 'overdue'>('all');
  const [selectedStatement, setSelectedStatement] = useState<PatientStatement | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: statements = [], isLoading } = useQuery({
    queryKey: ['patient-statements', searchTerm, statusFilter],
    queryFn: async () => {
      const allStatements = await billingService.getAllStatements();
      
      let filteredStatements = allStatements;
      
      if (statusFilter !== 'all') {
        filteredStatements = filteredStatements.filter(s => s.status === statusFilter);
      }

      if (searchTerm) {
        filteredStatements = filteredStatements.filter(s => 
          s.statementNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.client?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.client?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return filteredStatements;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => billingService.deleteStatement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-statements'] });
      toast({
        title: 'Success',
        description: 'Statement deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete statement',
        variant: 'destructive',
      });
    },
  });

  const sendMutation = useMutation({
    mutationFn: (id: string) => billingService.markStatementAsSent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-statements'] });
      toast({
        title: 'Success',
        description: 'Statement marked as sent',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send statement',
        variant: 'destructive',
      });
    },
  });

  const handleCreateStatement = () => {
    setSelectedStatement(null);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditStatement = (statement: PatientStatement) => {
    setSelectedStatement(statement);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleViewStatement = (statement: PatientStatement) => {
    setSelectedStatement(statement);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDeleteStatement = (statement: PatientStatement) => {
    if (window.confirm(`Are you sure you want to delete statement ${statement.statementNumber}?`)) {
      deleteMutation.mutate(statement.id);
    }
  };

  const handleSendStatement = (statement: PatientStatement) => {
    if (window.confirm(`Are you sure you want to send statement ${statement.statementNumber}?`)) {
      sendMutation.mutate(statement.id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStatement(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Send className="h-4 w-4 text-green-600" />;
      case 'draft':
        return <FileText className="h-4 w-4 text-gray-600" />;
      case 'overdue':
        return <Receipt className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const columns: TableColumn<PatientStatement>[] = [
    { 
      key: 'statementNumber', 
      header: 'Statement Number', 
      accessor: (s) => `#${s.statementNumber}`, 
      sortable: true, 
      searchable: true 
    },
    { 
      key: 'client', 
      header: 'Patient', 
      accessor: (s) => `${s.client?.firstName || ''} ${s.client?.lastName || ''}`, 
      sortable: true, 
      searchable: true 
    },
    { 
      key: 'statementDate', 
      header: 'Statement Date', 
      accessor: (s) => new Date(s.statementDate).toLocaleDateString(), 
      sortable: true 
    },
    { 
      key: 'dueDate', 
      header: 'Due Date', 
      accessor: (s) => s.dueDate ? new Date(s.dueDate).toLocaleDateString() : 'N/A', 
      sortable: true 
    },
    { 
      key: 'status', 
      header: 'Status', 
      accessor: (s) => {
        const status = isOverdue(s.dueDate) && s.status === 'sent' ? 'overdue' : s.status || 'draft';
        return (
          <div className="flex items-center space-x-2">
            {getStatusIcon(status)}
            <Badge className={getStatusColor(status)}>
              {status}
            </Badge>
          </div>
        );
      }, 
      sortable: true 
    },
    { 
      key: 'totalAmount', 
      header: 'Total Amount', 
      accessor: (s) => `$${parseFloat(s.totalAmount.toString()).toFixed(2)}`, 
      sortable: true 
    },
    { 
      key: 'currentBalance', 
      header: 'Current Balance', 
      accessor: (s) => (
        <span className={parseFloat(s.currentBalance.toString()) > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
          ${parseFloat(s.currentBalance.toString()).toFixed(2)}
        </span>
      ), 
      sortable: true 
    },
    { 
      key: 'deliveryMethod', 
      header: 'Delivery Method', 
      accessor: (s) => s.deliveryMethod || 'N/A', 
      sortable: true 
    },
  ];

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={Receipt}
        title="Statement Generation"
        description="Generate and send patient statements"
      />

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search statements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value: 'all' | 'draft' | 'sent' | 'overdue') => setStatusFilter(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Batch Send</span>
            </Button>
            <Button onClick={handleCreateStatement} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Generate Statement</span>
            </Button>
          </div>
        </div>

        {/* Statements Table */}
        <Table
          data={statements}
          columns={columns}
          loading={isLoading}
          searchable={true}
          pagination={true}
          pageSize={10}
          emptyMessage="No statements found. Generate your first statement to get started."
          actions={[
            { label: 'View', icon: <Eye className="h-4 w-4" />, onClick: handleViewStatement, variant: 'ghost' },
            { label: 'Edit', icon: <Edit className="h-4 w-4" />, onClick: handleEditStatement, variant: 'ghost' },
            { label: 'Download', icon: <Download className="h-4 w-4" />, onClick: handleViewStatement, variant: 'ghost' },
            { label: 'Send', icon: <Send className="h-4 w-4" />, onClick: handleSendStatement, variant: 'default', disabled: (s) => s.status === 'sent' },
            { label: 'Delete', icon: <Trash2 className="h-4 w-4" />, onClick: handleDeleteStatement, variant: 'destructive', disabled: (s) => s.status === 'sent' },
          ]}
        />

        <StatementModal 
          isOpen={showModal} 
          onClose={handleCloseModal} 
          statement={selectedStatement} 
          mode={modalMode} 
        />
      </div>
    </PageLayout>
  );
};

export default StatementGenerationPage;
