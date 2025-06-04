
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Users, DollarSign, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ProviderCompensationConfig: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: providers, isLoading: providersLoading } = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_roles!inner(role)
        `)
        .eq('user_roles.role', 'Clinician')
        .eq('user_roles.is_active', true);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: compensationConfigs, isLoading } = useQuery({
    queryKey: ['compensation-configs', selectedProvider],
    queryFn: async () => {
      let query = supabase
        .from('provider_compensation_config')
        .select(`
          *,
          provider:users!provider_compensation_config_provider_id_fkey(first_name, last_name),
          created_by_user:users!provider_compensation_config_created_by_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (selectedProvider) {
        query = query.eq('provider_id', selectedProvider);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: sessionMultipliers } = useQuery({
    queryKey: ['session-multipliers', selectedProvider],
    queryFn: async () => {
      let query = supabase
        .from('session_rate_multipliers')
        .select('*')
        .order('session_type');

      if (selectedProvider) {
        query = query.eq('provider_id', selectedProvider);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const createConfigMutation = useMutation({
    mutationFn: async (configData: any) => {
      const { data, error } = await supabase
        .from('provider_compensation_config')
        .insert(configData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
    return <div className="text-center py-8">Loading compensation configurations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter by provider..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Providers</SelectItem>
              {providers?.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.first_name} {provider.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Configuration</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Provider Compensation Configuration</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveConfig(new FormData(e.currentTarget));
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provider_id">Provider</Label>
                  <Select name="provider_id" required>
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
                  <Select name="compensation_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="session_based">Session Based</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="base_session_rate">Base Session Rate ($)</Label>
                  <Input
                    name="base_session_rate"
                    type="number"
                    step="0.01"
                    placeholder="150.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="base_hourly_rate">Base Hourly Rate ($)</Label>
                  <Input
                    name="base_hourly_rate"
                    type="number"
                    step="0.01"
                    placeholder="25.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="experience_tier">Experience Tier</Label>
                  <Select name="experience_tier">
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Tier 1 (Entry)</SelectItem>
                      <SelectItem value="2">Tier 2 (Intermediate)</SelectItem>
                      <SelectItem value="3">Tier 3 (Senior)</SelectItem>
                      <SelectItem value="4">Tier 4 (Expert)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="effective_date">Effective Date</Label>
                  <Input
                    name="effective_date"
                    type="date"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="evening_differential">Evening Differential (%)</Label>
                  <Input
                    name="evening_differential"
                    type="number"
                    step="0.01"
                    placeholder="5.00"
                  />
                </div>
                
                <div>
                  <Label htmlFor="weekend_differential">Weekend Differential (%)</Label>
                  <Input
                    name="weekend_differential"
                    type="number"
                    step="0.01"
                    placeholder="10.00"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_overtime_eligible"
                  id="is_overtime_eligible"
                  className="rounded"
                />
                <Label htmlFor="is_overtime_eligible">Eligible for overtime</Label>
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
      </div>

      {/* Configurations List */}
      <div className="space-y-4">
        {compensationConfigs?.map((config) => (
          <Card key={config.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-lg">
                      {config.provider?.first_name} {config.provider?.last_name}
                    </h4>
                    <Badge className={config.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {config.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {config.compensation_type === 'session_based' ? 'Session Based' : 'Hourly'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {config.base_session_rate && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span><strong>Session Rate:</strong> ${config.base_session_rate}</span>
                      </div>
                    )}
                    {config.base_hourly_rate && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span><strong>Hourly Rate:</strong> ${config.base_hourly_rate}</span>
                      </div>
                    )}
                    <div>
                      <strong>Experience Tier:</strong> {config.experience_tier}
                    </div>
                    <div>
                      <strong>Effective:</strong> {new Date(config.effective_date).toLocaleDateString()}
                    </div>
                  </div>

                  {(config.evening_differential > 0 || config.weekend_differential > 0) && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {config.evening_differential > 0 && (
                        <div>
                          <strong>Evening Differential:</strong> {config.evening_differential}%
                        </div>
                      )}
                      {config.weekend_differential > 0 && (
                        <div>
                          <strong>Weekend Differential:</strong> {config.weekend_differential}%
                        </div>
                      )}
                    </div>
                  )}

                  {config.is_overtime_eligible && (
                    <div className="text-sm">
                      <Badge variant="outline" className="text-blue-600">
                        Overtime Eligible
                      </Badge>
                    </div>
                  )}
                </div>

                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {compensationConfigs?.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No compensation configurations found</h3>
          <p className="text-gray-600 mb-4">
            {selectedProvider ? 'No configurations for selected provider.' : 'Get started by creating compensation configurations for your providers.'}
          </p>
          <Button onClick={() => setShowConfigModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Configuration
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProviderCompensationConfig;
