
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/basic/dialog';
import { Label } from '@/components/basic/label';
import { Plus, Edit, Users, DollarSign, Clock } from 'lucide-react';
import { complianceService } from '@/services/complianceService';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';

const ProviderCompensationConfig: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: providers, isLoading: providersLoading } = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      // TODO: Implement providers API
      return [];
    },
  });

  const { data: compensationConfigs, isLoading } = useQuery({
    queryKey: ['compensation-configs', selectedProvider],
    queryFn: async () => {
      return complianceService.getAll(selectedProvider !== 'all' ? selectedProvider : undefined);
    },
  });

  const { data: sessionMultipliers } = useQuery({
    queryKey: ['session-multipliers', selectedProvider],
    queryFn: async () => {
      return complianceService.getSessionMultipliers(selectedProvider !== 'all' ? selectedProvider : undefined);
    },
  });

  const createConfigMutation = useMutation({
    mutationFn: async (configData: any) => {
      return complianceService.create(configData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compensation-configs'] });
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

  const handleSaveConfig = (formData: FormData) => {
    const configData = {
      provider_id: formData.get('provider_id'),
      compensation_type: formData.get('compensation_type'),
      base_session_rate: parseFloat(formData.get('base_session_rate') as string) || null,
      base_hourly_rate: parseFloat(formData.get('base_hourly_rate') as string) || null,
      experience_tier: parseInt(formData.get('experience_tier') as string) || 1,
      is_overtime_eligible: formData.get('is_overtime_eligible') === 'on',
      evening_differential: parseFloat(formData.get('evening_differential') as string) || 0,
      weekend_differential: parseFloat(formData.get('weekend_differential') as string) || 0,
      effective_date: formData.get('effective_date'),
    };

    createConfigMutation.mutate(configData);
  };

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
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by provider..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {providers?.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.first_name} {provider.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={() => setShowConfigModal(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Configuration</span>
          </Button>
        </div>

        {/* Compensation Configurations */}
        <div className="space-y-4">
          {compensationConfigs?.map((config) => (
            <Card key={config.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-lg">
                        {config.provider?.firstName} {config.provider?.lastName}
                      </h4>
                      <Badge className="bg-blue-100 text-blue-800">
                        {config.compensationType}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <strong>Base Session Rate:</strong> ${config.baseSessionRate || 'N/A'}
                      </div>
                      <div>
                        <strong>Base Hourly Rate:</strong> ${config.baseHourlyRate || 'N/A'}
                      </div>
                      <div>
                        <strong>Experience Tier:</strong> {config.experienceTier}
                      </div>
                      <div>
                        <strong>Overtime Eligible:</strong> {config.isOvertimeEligible ? 'Yes' : 'No'}
                      </div>
                    </div>

                    {(config.eveningDifferential > 0 || config.weekendDifferential > 0) && (
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <strong>Evening Differential:</strong> +${config.eveningDifferential}/hr
                        </div>
                        <div>
                          <strong>Weekend Differential:</strong> +${config.weekendDifferential}/hr
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-gray-600">
                      <strong>Effective Date:</strong> {new Date(config.effectiveDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditingConfig(config);
                        setShowConfigModal(true);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
                      <p className="text-sm text-gray-600">{multiplier.description}</p>
                      <div className="text-sm text-gray-600">
                        <strong>Effective Date:</strong> {new Date(multiplier.effectiveDate).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {compensationConfigs?.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No compensation configurations found</h3>
            <p className="text-gray-600 mb-4">
              {selectedProvider === 'all' 
                ? 'No compensation configurations have been set up yet.'
                : 'No compensation configuration found for the selected provider.'
              }
            </p>
            <Button onClick={() => setShowConfigModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Configuration
            </Button>
          </div>
        )}
      </div>

      {/* Configuration Modal */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
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
                <Select name="provider_id" defaultValue={editingConfig?.providerId || ''} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider..." />
                  </SelectTrigger>
                  <SelectContent>
                    {providers?.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.first_name} {provider.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="compensation_type">Compensation Type</Label>
                <Select name="compensation_type" defaultValue={editingConfig?.compensationType || 'session'} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="session">Per Session</SelectItem>
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
                  defaultValue={editingConfig?.effectiveDate ? new Date(editingConfig.effectiveDate).toISOString().split('T')[0] : ''}
                  required
                />
              </div>
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
              <Button type="button" variant="outline" onClick={() => setShowConfigModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createConfigMutation.isPending}>
                {createConfigMutation.isPending ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ProviderCompensationConfig;
