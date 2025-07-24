import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { billingService, PayerContract } from '@/services/billingService';
import { useToast } from '@/hooks/use-toast';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  payer?: any;
}

const ContractModal: React.FC<ContractModalProps> = ({ isOpen, onClose, payer }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    contractName: '',
    contractNumber: '',
    effectiveDate: '',
    expirationDate: '',
    status: 'active',
    reimbursementRate: '',
    contractTerms: '',
  });

  const { data: contracts, isLoading } = useQuery({
    queryKey: ['payer-contracts', payer?.id],
    queryFn: async () => {
      if (!payer?.id) return [];
      return billingService.getAllContracts(payer.id);
    },
    enabled: !!payer?.id,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const contractData = {
        ...data,
        payerId: payer.id,
        reimbursementRate: data.reimbursementRate ? parseFloat(data.reimbursementRate) : null,
      };

      if (editingContract) {
        return billingService.updateContract(editingContract.id, contractData);
      } else {
        return billingService.createContract(contractData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payer-contracts', payer?.id] });
      toast({
        title: editingContract ? 'Contract updated' : 'Contract created',
        description: 'Contract has been saved successfully.',
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to save contract: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (contractId: string) => {
      return billingService.deleteContract(contractId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payer-contracts', payer?.id] });
      toast({
        title: 'Contract deleted',
        description: 'Contract has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete contract: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      contractName: '',
      contractNumber: '',
      effectiveDate: '',
      expirationDate: '',
      status: 'active',
      reimbursementRate: '',
      contractTerms: '',
    });
    setShowForm(false);
    setEditingContract(null);
  };

  const handleEdit = (contract: any) => {
    setFormData({
      contractName: contract.contractName || '',
      contractNumber: contract.contractNumber || '',
      effectiveDate: contract.effectiveDate || '',
      expirationDate: contract.expirationDate || '',
      status: contract.status || 'active',
      reimbursementRate: contract.reimbursementRate?.toString() || '',
      contractTerms: contract.contractTerms || '',
    });
    setEditingContract(contract);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminated':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!payer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contracts for {payer.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!showForm && (
            <div className="flex justify-end">
              <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Contract</span>
              </Button>
            </div>
          )}

          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingContract ? 'Edit Contract' : 'Add New Contract'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contractName">Contract Name *</Label>
                      <Input
                        id="contractName"
                        value={formData.contractName}
                        onChange={(e) => setFormData({ ...formData, contractName: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contractNumber">Contract Number</Label>
                      <Input
                        id="contractNumber"
                        value={formData.contractNumber}
                        onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="effectiveDate">Effective Date *</Label>
                      <Input
                        id="effectiveDate"
                        type="date"
                        value={formData.effectiveDate}
                        onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="expirationDate">Expiration Date</Label>
                      <Input
                        id="expirationDate"
                        type="date"
                        value={formData.expirationDate}
                        onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
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
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="terminated">Terminated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reimbursementRate">Reimbursement Rate (%)</Label>
                    <Input
                      id="reimbursementRate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.reimbursementRate}
                      onChange={(e) => setFormData({ ...formData, reimbursementRate: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contractTerms">Contract Terms</Label>
                    <Textarea
                      id="contractTerms"
                      value={formData.contractTerms}
                      onChange={(e) => setFormData({ ...formData, contractTerms: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saveMutation.isPending}>
                      {saveMutation.isPending ? 'Saving...' : (editingContract ? 'Update' : 'Create')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Existing Contracts */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-4">Loading contracts...</div>
            ) : contracts && contracts.length > 0 ? (
              contracts.map((contract) => (
                <Card key={contract.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{contract.contractName}</h4>
                          <Badge className={getStatusColor(contract.status)}>
                            {contract.status}
                          </Badge>
                        </div>
                        
                        {contract.contractNumber && (
                          <p className="text-sm text-gray-600">
                            Contract #: {contract.contractNumber}
                          </p>
                        )}
                        
                        <p className="text-sm text-gray-600">
                          Effective: {new Date(contract.effectiveDate).toLocaleDateString()}
                          {contract.expirationDate && 
                            ` - ${new Date(contract.expirationDate).toLocaleDateString()}`
                          }
                        </p>
                        
                        {contract.reimbursementRate && (
                          <p className="text-sm text-gray-600">
                            Reimbursement Rate: {contract.reimbursementRate}%
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(contract)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMutation.mutate(contract.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No contracts found for this payer.</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Contract
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractModal;
