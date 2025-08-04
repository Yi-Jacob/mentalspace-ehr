
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { Table, TableColumn } from '@/components/basic/table';

import { UserCog, Plus, Eye, CheckCircle, Pause, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { staffService } from '@/services/staffService';
import { SupervisionRelationship, SupervisionStatus } from '@/types/staffType';
import { CreateSupervisionModal } from './CreateSupervisionModal';
import { SupervisionDetailModal } from './SupervisionDetailModal';
import { SupervisionCompletionModal } from './SupervisionCompletionModal';

interface StaffSupervisionViewProps {
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
}

const StaffSupervisionView: React.FC<StaffSupervisionViewProps> = ({ 
  showCreateModal, 
  setShowCreateModal 
}) => {
  const { toast } = useToast();
  const [supervisions, setSupervisions] = useState<SupervisionRelationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupervision, setSelectedSupervision] = useState<SupervisionRelationship | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [supervisionToComplete, setSupervisionToComplete] = useState<SupervisionRelationship | null>(null);

  useEffect(() => {
    loadSupervisions();
  }, []);

  const loadSupervisions = async () => {
    try {
      setLoading(true);
      const data = await staffService.getAllSupervisionRelationships();
      setSupervisions(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load supervision relationships',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: SupervisionStatus) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'completed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getFullName = (user: any) => {
    return `${user.firstName} ${user.lastName}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Define table columns
  const columns: TableColumn<SupervisionRelationship>[] = [
    {
      key: 'supervisor',
      header: 'Supervisor',
      accessor: (supervision) => getFullName(supervision.supervisor),
      sortable: true,
      searchable: true,
      searchValue: (supervision) => getFullName(supervision.supervisor)
    },
    {
      key: 'supervisee',
      header: 'Supervisee',
      accessor: (supervision) => getFullName(supervision.supervisee),
      sortable: true,
      searchable: true,
      searchValue: (supervision) => getFullName(supervision.supervisee)
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (supervision) => (
        <Badge variant={getStatusBadgeVariant(supervision.status)}>
          {supervision.status}
        </Badge>
      ),
      sortable: true,
      searchable: true,
      searchValue: (supervision) => supervision.status
    },
    {
      key: 'startDate',
      header: 'Start Date',
      accessor: (supervision) => formatDate(supervision.startDate),
      sortable: true,
      searchable: false
    },
    {
      key: 'endDate',
      header: 'End Date',
      accessor: (supervision) => supervision.endDate ? formatDate(supervision.endDate) : '-',
      sortable: true,
      searchable: false
    }
  ];

  const handleViewDetails = (supervision: SupervisionRelationship) => {
    setSelectedSupervision(supervision);
    setShowDetailModal(true);
  };

  const handleCreateSuccess = () => {
    loadSupervisions();
  };

  const handleDetailUpdate = () => {
    loadSupervisions();
  };

  const handleActivateDeactivate = async (supervision: SupervisionRelationship) => {
    try {
      const newStatus = supervision.status === 'active' ? 'inactive' : 'active';
      await staffService.updateSupervisionRelationship(supervision.id, { status: newStatus });
      toast({
        title: 'Success',
        description: `Supervision ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      });
      loadSupervisions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update supervision status',
        variant: 'destructive'
      });
    }
  };

  const handleCompleteSupervision = (supervision: SupervisionRelationship) => {
    setSupervisionToComplete(supervision);
    setShowCompletionModal(true);
  };

  return (
    <div className="space-y-6">
      <Table
        data={supervisions}
        columns={columns}
        sortable={true}
        pagination={true}
        searchable={true}
        pageSize={10}
        loading={loading}
        emptyMessage={
          <div className="text-center py-8">
            <UserCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No supervision relationships</h3>
            <p className="text-gray-600 mb-4">
              Get started by creating a new supervision relationship between staff members.
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Supervision
            </Button>
          </div>
        }
        actions={[
          {
            label: 'View Details',
            icon: <Eye className="h-4 w-4" />,
            onClick: handleViewDetails,
            variant: 'outline'
          },
          {
            label: (supervision) => supervision.status === 'active' ? 'Deactivate Supervision' : 'Activate Supervision',
            icon: (supervision) => supervision.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />,
            onClick: handleActivateDeactivate,
            variant: (supervision) => supervision.status === 'active' ? 'secondary' : 'default',
            disabled: (supervision) => supervision.status === 'completed'
          },
          {
            label: 'Complete Supervision',
            icon: <CheckCircle className="h-4 w-4" />,
            onClick: handleCompleteSupervision,
            variant: 'destructive',
            disabled: (supervision) => supervision.status === 'completed'
          }
        ]}
      />

      {/* Create Modal */}
      <CreateSupervisionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

             {/* Detail Modal */}
       <SupervisionDetailModal
         supervision={selectedSupervision}
         isOpen={showDetailModal}
         onClose={() => {
           setShowDetailModal(false);
           setSelectedSupervision(null);
         }}
         onUpdate={handleDetailUpdate}
       />

       {/* Completion Modal */}
       <SupervisionCompletionModal
         supervision={supervisionToComplete}
         isOpen={showCompletionModal}
         onClose={() => {
           setShowCompletionModal(false);
           setSupervisionToComplete(null);
         }}
         onSuccess={() => {
           loadSupervisions();
           setShowCompletionModal(false);
           setSupervisionToComplete(null);
         }}
       />
     </div>
   );
 };

export default StaffSupervisionView;
