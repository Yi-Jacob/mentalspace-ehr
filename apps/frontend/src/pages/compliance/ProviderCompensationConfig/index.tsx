
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/basic/dialog';
import { Label } from '@/components/basic/label';
import { Table, TableColumn } from '@/components/basic/table';
import { Plus, Edit, Trash2, CheckCircle, XCircle, DollarSign, Users } from 'lucide-react';
import { complianceService, type ProviderCompensationConfig } from '@/services/complianceService';
import { staffService } from '@/services/staffService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { USER_ROLES } from '@/types/enums/staffEnum';

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
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {isPracticeAdmin && (
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filter by provider..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  {staffProfiles?.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.firstName} {profile.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {!isPracticeAdmin && (
              <div className="text-sm text-gray-600">
                Viewing your compensation configuration
              </div>
            )}
          </div>
          
          <Button 
            onClick={() => {
              setEditingConfig(null);
              setShowConfigModal(true);
            }}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Configuration</span>
          </Button>
        </div>

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
              variant: 'outline',
            },
            {
              label: 'Delete',
              icon: <Trash2 className="h-4 w-4" />,
              onClick: (config) => handleDelete(config.id),
              variant: 'destructive',
            },
          ]}
          emptyMessage={
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No compensation configurations found</h3>
              <p className="text-gray-600 mb-4">
                {isPracticeAdmin 
                  ? (selectedProvider === 'all' 
                      ? 'No compensation configurations have been set up yet.'
                      : 'No compensation configuration found for the selected provider.')
                  : 'You don\'t have any compensation configurations set up yet.'
                }
              </p>
              <Button onClick={() => {
                setEditingConfig(null);
                setShowConfigModal(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Configuration
              </Button>
            </div>
          }
        />

        {/* Session Multipliers */}
        {sessionMultipliers && sessionMultipliers.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Session Multipliers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessionMultipliers.map((multiplier) => (
                <Card key={multiplier.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{multiplier.sessionType}</h4>
                        <Badge className="bg-green-100 text-green-800">
                          {multiplier.multiplier}x
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{multiplier.durationMinutes} minutes</p>
                      <div className="text-sm text-gray-600">
                        <strong>Status:</strong> {multiplier.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Configuration Modal */}
      <Dialog open={showConfigModal} onOpenChange={(open) => {
        setShowConfigModal(open);
        if (!open) {
          setEditingConfig(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingConfig ? 'Edit Compensation Configuration' : 'Add Compensation Configuration'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSaveConfig(new FormData(e.currentTarget));
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provider_id">Provider</Label>
                <Select 
                  name="provider_id" 
                  defaultValue={editingConfig?.providerId || (isPracticeAdmin ? '' : currentStaffProfileId)} 
                  required
                  disabled={!isPracticeAdmin && !!currentStaffProfileId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider..." />
                  </SelectTrigger>
                  <SelectContent>
                    {isPracticeAdmin ? (
                      staffProfiles?.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.firstName} {profile.lastName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value={currentStaffProfileId || ''}>
                        {user?.firstName} {user?.lastName}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="compensation_type">Compensation Type</Label>
                <Select name="compensation_type" defaultValue={editingConfig?.compensationType || 'session_based'} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="session_based">Per Session</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="base_session_rate">Base Session Rate ($)</Label>
                <Input
                  name="base_session_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingConfig?.baseSessionRate || ''}
                  placeholder="Enter session rate"
                />
              </div>
              
              <div>
                <Label htmlFor="base_hourly_rate">Base Hourly Rate ($)</Label>
                <Input
                  name="base_hourly_rate"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingConfig?.baseHourlyRate || ''}
                  placeholder="Enter hourly rate"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experience_tier">Experience Tier</Label>
                <Select name="experience_tier" defaultValue={editingConfig?.experienceTier?.toString() || '1'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Tier 1 (0-2 years)</SelectItem>
                    <SelectItem value="2">Tier 2 (3-5 years)</SelectItem>
                    <SelectItem value="3">Tier 3 (6-10 years)</SelectItem>
                    <SelectItem value="4">Tier 4 (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="effective_date">Effective Date</Label>
                <Input
                  name="effective_date"
                  type="date"
                  defaultValue={editingConfig?.effectiveDate ? new Date(editingConfig.effectiveDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="expiration_date">Expiration Date (Optional)</Label>
              <Input
                name="expiration_date"
                type="date"
                defaultValue={editingConfig?.expirationDate ? new Date(editingConfig.expirationDate).toISOString().split('T')[0] : ''}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="evening_differential">Evening Differential ($/hr)</Label>
                <Input
                  name="evening_differential"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingConfig?.eveningDifferential || '0'}
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label htmlFor="weekend_differential">Weekend Differential ($/hr)</Label>
                <Input
                  name="weekend_differential"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingConfig?.weekendDifferential || '0'}
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_overtime_eligible"
                name="is_overtime_eligible"
                defaultChecked={editingConfig?.isOvertimeEligible || false}
                className="rounded border-gray-300"
              />
              <Label htmlFor="is_overtime_eligible">Eligible for overtime pay</Label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowConfigModal(false);
                  setEditingConfig(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createConfigMutation.isPending || updateConfigMutation.isPending}
              >
                {(createConfigMutation.isPending || updateConfigMutation.isPending) 
                  ? 'Saving...' 
                  : (editingConfig ? 'Update Configuration' : 'Save Configuration')
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ProviderCompensationConfig;
