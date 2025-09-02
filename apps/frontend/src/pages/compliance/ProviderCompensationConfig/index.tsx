import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog } from '@/components/basic/dialog';
import { Table, TableColumn } from '@/components/basic/table';
import { Badge } from '@/components/basic/badge';
import { DollarSign, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { complianceService, type ProviderCompensationConfig } from '@/services/complianceService';
import { staffService } from '@/services/staffService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { USER_ROLES } from '@/types/enums/staffEnum';
import ProviderCompensationModal from '@/pages/compliance/ProviderCompensationConfig/components/ProviderCompensationModal';
import ProviderCompensationHeader from '@/pages/compliance/ProviderCompensationConfig/components/ProviderCompensationHeader';

import ProviderCompensationEmptyState from '@/pages/compliance/ProviderCompensationConfig/components/ProviderCompensationEmptyState';
import SessionMultipliers from '@/pages/compliance/ProviderCompensationConfig/components/SessionMultipliers';
import { StaffMember } from '@/types/staffType';

const ProviderCompensationConfig: React.FC = () => {
  const { user } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<ProviderCompensationConfig | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is practice administrator
  const isPracticeAdmin = user?.roles?.includes(USER_ROLES.PRACTICE_ADMINISTRATOR);
  
  // For non-admin users, use their staff profile ID
  const currentStaffProfileId = user?.staffId;
  const effectiveProviderId = isPracticeAdmin 
    ? (selectedProvider !== 'all' ? selectedProvider : undefined)
    : currentStaffProfileId;

  const { data: staffProfiles, isLoading: providersLoading } = useQuery({
    queryKey: ['staff-profiles'],
    queryFn: async () => {
      return staffService.getAllStaffProfiles();
    },
    enabled: isPracticeAdmin, // Only fetch if user is practice admin
  });

  const { data: compensationConfigs, isLoading } = useQuery({
    queryKey: ['provider-compensations', effectiveProviderId],
    queryFn: async () => {
      return complianceService.getProviderCompensations(undefined, effectiveProviderId);
    },
  });

  const { data: sessionMultipliers } = useQuery({
    queryKey: ['session-multipliers', effectiveProviderId],
    queryFn: async () => {
      return complianceService.getSessionMultipliers(effectiveProviderId);
    },
  });

  const createConfigMutation = useMutation({
    mutationFn: async (configData: any) => {
      return complianceService.createProviderCompensation(configData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-compensations'] });
      setShowConfigModal(false);
      setEditingConfig(null);
      toast({
        title: 'Success',
        description: 'Compensation configuration saved successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save compensation configuration',
        variant: 'destructive',
      });
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return complianceService.updateProviderCompensation(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-compensations'] });
      setShowConfigModal(false);
      setEditingConfig(null);
      toast({
        title: 'Success',
        description: 'Compensation configuration updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update compensation configuration',
        variant: 'destructive',
      });
    },
  });

  const deleteConfigMutation = useMutation({
    mutationFn: async (id: string) => {
      return complianceService.deleteProviderCompensation(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-compensations'] });
      toast({
        title: 'Success',
        description: 'Compensation configuration deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete compensation configuration',
        variant: 'destructive',
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return complianceService.toggleProviderCompensationActive(id, isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider-compensations'] });
      toast({
        title: 'Success',
        description: 'Compensation configuration status updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update compensation configuration status',
        variant: 'destructive',
      });
    },
  });

  const handleSaveConfig = (formData: FormData) => {
    const configData = {
      providerId: formData.get('provider_id') as string,
      compensationType: formData.get('compensation_type') as string,
      baseSessionRate: parseFloat(formData.get('base_session_rate') as string) || undefined,
      baseHourlyRate: parseFloat(formData.get('base_hourly_rate') as string) || undefined,
      experienceTier: parseInt(formData.get('experience_tier') as string) || undefined,
      isOvertimeEligible: formData.get('is_overtime_eligible') === 'on',
      eveningDifferential: parseFloat(formData.get('evening_differential') as string) || 0,
      weekendDifferential: parseFloat(formData.get('weekend_differential') as string) || 0,
      effectiveDate: formData.get('effective_date') as string,
      expirationDate: formData.get('expiration_date') as string || undefined,
      createdBy: user?.id,
    };

    if (editingConfig) {
      updateConfigMutation.mutate({ id: editingConfig.id, data: configData });
    } else {
      createConfigMutation.mutate(configData);
    }
  };

  const handleEdit = (config: ProviderCompensationConfig) => {
    setEditingConfig(config);
    setShowConfigModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this compensation configuration?')) {
      deleteConfigMutation.mutate(id);
    }
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    const action = isActive ? 'activate' : 'deactivate';
    if (window.confirm(`Are you sure you want to ${action} this compensation configuration?`)) {
      toggleActiveMutation.mutate({ id, isActive });
    }
  };

  // Table columns configuration
  const columns: TableColumn<ProviderCompensationConfig>[] = [
    {
      key: 'provider',
      header: 'Provider',
      accessor: (config) => (
        <div className="font-medium">
          {config.provider?.user?.firstName} {config.provider?.user?.lastName}
        </div>
      ),
      searchable: true,
      searchValue: (config) => `${config.provider?.user?.firstName} ${config.provider?.user?.lastName}`,
    },
    {
      key: 'compensationType',
      header: 'Type',
      accessor: (config) => (
        <Badge className="bg-blue-100 text-blue-800">
          {config.compensationType.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
      searchable: true,
    },
    {
      key: 'rates',
      header: 'Rates',
      accessor: (config) => (
        <div className="text-sm">
          {config.baseSessionRate && (
            <div>Session: ${config.baseSessionRate}</div>
          )}
          {config.baseHourlyRate && (
            <div>Hourly: ${config.baseHourlyRate}</div>
          )}
        </div>
      ),
    },
    {
      key: 'experienceTier',
      header: 'Experience Tier',
      accessor: (config) => (
        <Badge variant="outline">
          Tier {config.experienceTier || 'N/A'}
        </Badge>
      ),
    },
    {
      key: 'differentials',
      header: 'Differentials',
      accessor: (config) => (
        <div className="text-sm">
          {config.eveningDifferential > 0 && (
            <div>Evening: +${config.eveningDifferential}/hr</div>
          )}
          {config.weekendDifferential > 0 && (
            <div>Weekend: +${config.weekendDifferential}/hr</div>
          )}
          {config.eveningDifferential === 0 && config.weekendDifferential === 0 && (
            <span className="text-gray-400">None</span>
          )}
        </div>
      ),
    },
    {
      key: 'overtime',
      header: 'Overtime',
      accessor: (config) => (
        <Badge className={config.isOvertimeEligible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {config.isOvertimeEligible ? 'Eligible' : 'Not Eligible'}
        </Badge>
      ),
    },
    {
      key: 'effectiveDate',
      header: 'Effective Date',
      accessor: (config) => new Date(config.effectiveDate).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (config) => (
        <Badge className={config.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {config.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },

  ];

  if (isLoading || providersLoading) {
    return (
      <PageLayout variant="gradient">
        <PageHeader
          icon={DollarSign}
          title="Provider Compensation"
          description="Configure compensation rates, tiers, and multipliers for providers"
        />
        <div className="text-center py-8">Loading compensation configurations...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={DollarSign}
        title="Provider Compensation"
        description="Configure compensation rates, tiers, and multipliers for providers"
      />

      <div className="space-y-6">
        {/* Header Actions */}
        <ProviderCompensationHeader
          isPracticeAdmin={isPracticeAdmin}
          selectedProvider={selectedProvider}
          onProviderChange={setSelectedProvider}
          staffProfiles={staffProfiles}
          onAddConfiguration={() => {
            setEditingConfig(null);
            setShowConfigModal(true);
          }}
        />

        {/* Compensation Configurations Table */}
        <Table
          data={compensationConfigs || []}
          columns={columns}
          searchable={true}
          pagination={true}
          pageSize={10}
          actions={[
            {
              label: 'Edit',
              icon: <Edit className="h-4 w-4" />,
              onClick: handleEdit,
              variant: 'outline' as const,
            },
            {
              label: (config) => config.isActive ? 'Deactivate' : 'Activate',
              icon: (config) => config.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />,
              onClick: (config) => handleToggleActive(config.id, !config.isActive),
              variant: (config) => config.isActive ? 'destructive' as const : 'default' as const,
            },
            {
              label: 'Delete',
              icon: <Trash2 className="h-4 w-4" />,
              onClick: (config) => handleDelete(config.id),
              variant: 'destructive' as const,
            },
          ]}
          emptyMessage={
            <ProviderCompensationEmptyState
              isPracticeAdmin={isPracticeAdmin}
              selectedProvider={selectedProvider}
              onAddConfiguration={() => {
                setEditingConfig(null);
                setShowConfigModal(true);
              }}
            />
          }
        />

        {/* Session Multipliers */}
        <SessionMultipliers sessionMultipliers={sessionMultipliers || []} />
      </div>

      {/* Configuration Modal */}
      <Dialog open={showConfigModal} onOpenChange={(open) => {
        setShowConfigModal(open);
        if (!open) {
          setEditingConfig(null);
        }
      }}>
        <ProviderCompensationModal
          editingConfig={editingConfig}
          isPracticeAdmin={isPracticeAdmin}
          currentStaffProfileId={currentStaffProfileId}
          staffProfiles={staffProfiles}
          user={user}
          onSubmit={handleSaveConfig}
          onCancel={() => {
            setShowConfigModal(false);
            setEditingConfig(null);
          }}
          isPending={createConfigMutation.isPending || updateConfigMutation.isPending}
        />
      </Dialog>
    </PageLayout>
  );
};

export default ProviderCompensationConfig;
