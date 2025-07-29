
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Checkbox } from '@/components/basic/checkbox';
import { Badge } from '@/components/basic/badge';
import { clientService } from '@/services/clientService';
import { billingService } from '@/services/billingService';
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
    verificationDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    benefitsVerified: false,
    authorizationRequired: false,
    authorizationNumber: '',
    authorizationExpiry: '',
    deductibleAmount: '',
    deductibleMet: '',
    outOfPocketMax: '',
    outOfPocketMet: '',
    copayAmount: '',
    coveredServices: [] as string[],
    excludedServices: [] as string[],
    nextVerificationDate: '',
    notes: '',
  });

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      return clientService.getClients();
    },
  });

  const { data: clientInsurance } = useQuery({
    queryKey: ['client-insurance', selectedClient],
    queryFn: async () => {
      if (!selectedClient) return [];
      // This would need to be implemented in the client service
      return [];
    },
    enabled: !!selectedClient,
  });

  useEffect(() => {
    if (verification) {
      setSelectedClient(verification.clientId);
      setSelectedInsurance(verification.insuranceId);
      setFormData({
        verificationDate: verification.verificationDate || '',
        status: verification.status || 'pending',
        benefitsVerified: verification.benefitsVerified || false,
        authorizationRequired: verification.authorizationRequired || false,
        authorizationNumber: verification.authorizationNumber || '',
        authorizationExpiry: verification.authorizationExpiry || '',
        deductibleAmount: verification.deductibleAmount?.toString() || '',
        deductibleMet: verification.deductibleMet?.toString() || '',
        outOfPocketMax: verification.outOfPocketMax?.toString() || '',
        outOfPocketMet: verification.outOfPocketMet?.toString() || '',
        copayAmount: verification.copayAmount?.toString() || '',
        coveredServices: verification.coveredServices || [],
        excludedServices: verification.excludedServices || [],
        nextVerificationDate: verification.nextVerificationDate || '',
        notes: verification.notes || '',
      });
    }
  }, [verification]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const verificationData = {
        ...data,
        clientId: selectedClient,
        insuranceId: selectedInsurance,
        verifiedBy: user?.id,
        deductibleAmount: data.deductibleAmount ? parseFloat(data.deductibleAmount) : null,
        deductibleMet: data.deductibleMet ? parseFloat(data.deductibleMet) : null,
        outOfPocketMax: data.outOfPocketMax ? parseFloat(data.outOfPocketMax) : null,
        outOfPocketMet: data.outOfPocketMet ? parseFloat(data.outOfPocketMet) : null,
        copayAmount: data.copayAmount ? parseFloat(data.copayAmount) : null,
      };

      if (verification) {
        return billingService.updateVerification(verification.id, verificationData);
      } else {
        return billingService.createVerification(verificationData);
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
    const field = type === 'covered' ? 'coveredServices' : 'excludedServices';
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
                      {client.lastName}, {client.firstName}
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
              <Label htmlFor="verificationDate">Verification Date *</Label>
              <Input
                id="verificationDate"
                type="date"
                value={formData.verificationDate}
                onChange={(e) => setFormData({ ...formData, verificationDate: e.target.value })}
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
                id="benefitsVerified"
                checked={formData.benefitsVerified}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, benefitsVerified: checked as boolean })
                }
              />
              <Label htmlFor="benefitsVerified">Benefits Verified</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="authorizationRequired"
                checked={formData.authorizationRequired}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, authorizationRequired: checked as boolean })
                }
              />
              <Label htmlFor="authorizationRequired">Authorization Required</Label>
            </div>
          </div>

          {/* Authorization Details */}
          {formData.authorizationRequired && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorizationNumber">Authorization Number</Label>
                <Input
                  id="authorizationNumber"
                  value={formData.authorizationNumber}
                  onChange={(e) => setFormData({ ...formData, authorizationNumber: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="authorizationExpiry">Authorization Expiry</Label>
                <Input
                  id="authorizationExpiry"
                  type="date"
                  value={formData.authorizationExpiry}
                  onChange={(e) => setFormData({ ...formData, authorizationExpiry: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Financial Details */}
          {formData.benefitsVerified && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Financial Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deductibleAmount">Deductible Amount</Label>
                  <Input
                    id="deductibleAmount"
                    type="number"
                    step="0.01"
                    value={formData.deductibleAmount}
                    onChange={(e) => setFormData({ ...formData, deductibleAmount: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="deductibleMet">Deductible Met</Label>
                  <Input
                    id="deductibleMet"
                    type="number"
                    step="0.01"
                    value={formData.deductibleMet}
                    onChange={(e) => setFormData({ ...formData, deductibleMet: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="outOfPocketMax">Out-of-Pocket Maximum</Label>
                  <Input
                    id="outOfPocketMax"
                    type="number"
                    step="0.01"
                    value={formData.outOfPocketMax}
                    onChange={(e) => setFormData({ ...formData, outOfPocketMax: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="outOfPocketMet">Out-of-Pocket Met</Label>
                  <Input
                    id="outOfPocketMet"
                    type="number"
                    step="0.01"
                    value={formData.outOfPocketMet}
                    onChange={(e) => setFormData({ ...formData, outOfPocketMet: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="copayAmount">Copay Amount</Label>
                <Input
                  id="copayAmount"
                  type="number"
                  step="0.01"
                  value={formData.copayAmount}
                  onChange={(e) => setFormData({ ...formData, copayAmount: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Services */}
          {formData.benefitsVerified && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Covered Services</h3>
              <div className="flex flex-wrap gap-2">
                {commonServices.map((service) => (
                  <Badge
                    key={service}
                    variant={formData.coveredServices.includes(service) ? "default" : "outline"}
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
                    variant={formData.excludedServices.includes(service) ? "destructive" : "outline"}
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
            <Label htmlFor="nextVerificationDate">Next Verification Date</Label>
            <Input
              id="nextVerificationDate"
              type="date"
              value={formData.nextVerificationDate}
              onChange={(e) => setFormData({ ...formData, nextVerificationDate: e.target.value })}
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
