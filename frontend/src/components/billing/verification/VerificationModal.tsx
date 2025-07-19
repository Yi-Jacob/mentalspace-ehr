
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shared/ui/dialog';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Textarea } from '@/components/shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { Checkbox } from '@/components/shared/ui/checkbox';
import { Badge } from '@/components/shared/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verification?: any;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, verification }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedInsurance, setSelectedInsurance] = useState('');
  const [formData, setFormData] = useState({
    verification_date: new Date().toISOString().split('T')[0],
    status: 'pending',
    benefits_verified: false,
    authorization_required: false,
    authorization_number: '',
    authorization_expiry: '',
    deductible_amount: '',
    deductible_met: '',
    out_of_pocket_max: '',
    out_of_pocket_met: '',
    copay_amount: '',
    covered_services: [] as string[],
    excluded_services: [] as string[],
    next_verification_date: '',
    notes: '',
  });

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, first_name, last_name, date_of_birth')
        .eq('is_active', true)
        .order('last_name');
      if (error) throw error;
      return data;
    },
  });

  const { data: clientInsurance } = useQuery({
    queryKey: ['client-insurance', selectedClient],
    queryFn: async () => {
      if (!selectedClient) return [];
      const { data, error } = await supabase
        .from('client_insurance')
        .select('*')
        .eq('client_id', selectedClient)
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedClient,
  });

  useEffect(() => {
    if (verification) {
      setSelectedClient(verification.client_id);
      setSelectedInsurance(verification.insurance_id);
      setFormData({
        verification_date: verification.verification_date || '',
        status: verification.status || 'pending',
        benefits_verified: verification.benefits_verified || false,
        authorization_required: verification.authorization_required || false,
        authorization_number: verification.authorization_number || '',
        authorization_expiry: verification.authorization_expiry || '',
        deductible_amount: verification.deductible_amount?.toString() || '',
        deductible_met: verification.deductible_met?.toString() || '',
        out_of_pocket_max: verification.out_of_pocket_max?.toString() || '',
        out_of_pocket_met: verification.out_of_pocket_met?.toString() || '',
        copay_amount: verification.copay_amount?.toString() || '',
        covered_services: verification.covered_services || [],
        excluded_services: verification.excluded_services || [],
        next_verification_date: verification.next_verification_date || '',
        notes: verification.notes || '',
      });
    }
  }, [verification]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const verificationData = {
        ...data,
        client_id: selectedClient,
        insurance_id: selectedInsurance,
        verified_by: user?.id,
        deductible_amount: data.deductible_amount ? parseFloat(data.deductible_amount) : null,
        deductible_met: data.deductible_met ? parseFloat(data.deductible_met) : null,
        out_of_pocket_max: data.out_of_pocket_max ? parseFloat(data.out_of_pocket_max) : null,
        out_of_pocket_met: data.out_of_pocket_met ? parseFloat(data.out_of_pocket_met) : null,
        copay_amount: data.copay_amount ? parseFloat(data.copay_amount) : null,
      };

      if (verification) {
        const { error } = await supabase
          .from('insurance_verifications')
          .update(verificationData)
          .eq('id', verification.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('insurance_verifications')
          .insert([verificationData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-verifications'] });
      toast({
        title: verification ? 'Verification updated' : 'Verification created',
        description: 'Insurance verification has been saved successfully.',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to save verification: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !selectedInsurance) {
      toast({
        title: 'Error',
        description: 'Please select a client and insurance policy.',
        variant: 'destructive',
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  const commonServices = [
    'Individual Therapy',
    'Group Therapy',
    'Family Therapy',
    'Psychological Testing',
    'Medication Management',
    'Crisis Intervention',
  ];

  const toggleService = (service: string, type: 'covered' | 'excluded') => {
    const field = type === 'covered' ? 'covered_services' : 'excluded_services';
    const services = formData[field];
    const index = services.indexOf(service);
    
    if (index > -1) {
      setFormData({
        ...formData,
        [field]: services.filter(s => s !== service)
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...services, service]
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {verification ? 'Edit Insurance Verification' : 'New Insurance Verification'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client and Insurance Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">Client *</Label>
              <Select 
                value={selectedClient} 
                onValueChange={setSelectedClient}
                disabled={!!verification}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.last_name}, {client.first_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="insurance">Insurance Policy *</Label>
              <Select 
                value={selectedInsurance} 
                onValueChange={setSelectedInsurance}
                disabled={!selectedClient || !!verification}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select insurance" />
                </SelectTrigger>
                <SelectContent>
                  {clientInsurance?.map((insurance) => (
                    <SelectItem key={insurance.id} value={insurance.id}>
                      {insurance.insurance_company} - {insurance.policy_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Basic Verification Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="verification_date">Verification Date *</Label>
              <Input
                id="verification_date"
                type="date"
                value={formData.verification_date}
                onChange={(e) => setFormData({ ...formData, verification_date: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="benefits_verified"
                checked={formData.benefits_verified}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, benefits_verified: checked as boolean })
                }
              />
              <Label htmlFor="benefits_verified">Benefits Verified</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="authorization_required"
                checked={formData.authorization_required}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, authorization_required: checked as boolean })
                }
              />
              <Label htmlFor="authorization_required">Authorization Required</Label>
            </div>
          </div>

          {/* Authorization Details */}
          {formData.authorization_required && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorization_number">Authorization Number</Label>
                <Input
                  id="authorization_number"
                  value={formData.authorization_number}
                  onChange={(e) => setFormData({ ...formData, authorization_number: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="authorization_expiry">Authorization Expiry</Label>
                <Input
                  id="authorization_expiry"
                  type="date"
                  value={formData.authorization_expiry}
                  onChange={(e) => setFormData({ ...formData, authorization_expiry: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Financial Details */}
          {formData.benefits_verified && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Financial Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deductible_amount">Deductible Amount</Label>
                  <Input
                    id="deductible_amount"
                    type="number"
                    step="0.01"
                    value={formData.deductible_amount}
                    onChange={(e) => setFormData({ ...formData, deductible_amount: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="deductible_met">Deductible Met</Label>
                  <Input
                    id="deductible_met"
                    type="number"
                    step="0.01"
                    value={formData.deductible_met}
                    onChange={(e) => setFormData({ ...formData, deductible_met: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="out_of_pocket_max">Out-of-Pocket Maximum</Label>
                  <Input
                    id="out_of_pocket_max"
                    type="number"
                    step="0.01"
                    value={formData.out_of_pocket_max}
                    onChange={(e) => setFormData({ ...formData, out_of_pocket_max: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="out_of_pocket_met">Out-of-Pocket Met</Label>
                  <Input
                    id="out_of_pocket_met"
                    type="number"
                    step="0.01"
                    value={formData.out_of_pocket_met}
                    onChange={(e) => setFormData({ ...formData, out_of_pocket_met: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="copay_amount">Copay Amount</Label>
                <Input
                  id="copay_amount"
                  type="number"
                  step="0.01"
                  value={formData.copay_amount}
                  onChange={(e) => setFormData({ ...formData, copay_amount: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Services */}
          {formData.benefits_verified && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Covered Services</h3>
              <div className="flex flex-wrap gap-2">
                {commonServices.map((service) => (
                  <Badge
                    key={service}
                    variant={formData.covered_services.includes(service) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleService(service, 'covered')}
                  >
                    {service}
                  </Badge>
                ))}
              </div>

              <h3 className="text-lg font-semibold">Excluded Services</h3>
              <div className="flex flex-wrap gap-2">
                {commonServices.map((service) => (
                  <Badge
                    key={service}
                    variant={formData.excluded_services.includes(service) ? "destructive" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleService(service, 'excluded')}
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div>
            <Label htmlFor="next_verification_date">Next Verification Date</Label>
            <Input
              id="next_verification_date"
              type="date"
              value={formData.next_verification_date}
              onChange={(e) => setFormData({ ...formData, next_verification_date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : (verification ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationModal;
