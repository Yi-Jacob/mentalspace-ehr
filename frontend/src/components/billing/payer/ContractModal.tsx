import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shared/ui/dialog';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Textarea } from '@/components/shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { Badge } from '@/components/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
    contract_name: '',
    contract_number: '',
    effective_date: '',
    expiration_date: '',
    status: 'active',
    reimbursement_rate: '',
    contract_terms: '',
  });

  const { data: contracts, isLoading } = useQuery({
    queryKey: ['payer-contracts', payer?.id],
    queryFn: async () => {
      if (!payer?.id) return [];
      const { data, error } = await supabase
        .from('payer_contracts')
        .select('*')
        .eq('payer_id', payer.id)
        .order('effective_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!payer?.id,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const contractData = {
        ...data,
        payer_id: payer.id,
        reimbursement_rate: data.reimbursement_rate ? parseFloat(data.reimbursement_rate) : null,
      };

      if (editingContract) {
        const { error } = await supabase
          .from('payer_contracts')
          .update(contractData)
          .eq('id', editingContract.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('payer_contracts')
          .insert([contractData]);
        if (error) throw error;
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
      const { error } = await supabase
        .from('payer_contracts')
        .delete()
        .eq('id', contractId);
      if (error) throw error;
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
      contract_name: '',
      contract_number: '',
      effective_date: '',
      expiration_date: '',
      status: 'active',
      reimbursement_rate: '',
      contract_terms: '',
    });
    setShowForm(false);
    setEditingContract(null);
  };

  const handleEdit = (contract: any) => {
    setFormData({
      contract_name: contract.contract_name || '',
      contract_number: contract.contract_number || '',
      effective_date: contract.effective_date || '',
      expiration_date: contract.expiration_date || '',
      status: contract.status || 'active',
      reimbursement_rate: contract.reimbursement_rate?.toString() || '',
      contract_terms: contract.contract_terms || '',
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
                      <Label htmlFor="contract_name">Contract Name *</Label>
                      <Input
                        id="contract_name"
                        value={formData.contract_name}
                        onChange={(e) => setFormData({ ...formData, contract_name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="contract_number">Contract Number</Label>
                      <Input
                        id="contract_number"
                        value={formData.contract_number}
                        onChange={(e) => setFormData({ ...formData, contract_number: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="effective_date">Effective Date *</Label>
                      <Input
                        id="effective_date"
                        type="date"
                        value={formData.effective_date}
                        onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="expiration_date">Expiration Date</Label>
                      <Input
                        id="expiration_date"
                        type="date"
                        value={formData.expiration_date}
                        onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
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
                    <Label htmlFor="reimbursement_rate">Reimbursement Rate (%)</Label>
                    <Input
                      id="reimbursement_rate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.reimbursement_rate}
                      onChange={(e) => setFormData({ ...formData, reimbursement_rate: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contract_terms">Contract Terms</Label>
                    <Textarea
                      id="contract_terms"
                      value={formData.contract_terms}
                      onChange={(e) => setFormData({ ...formData, contract_terms: e.target.value })}
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
                          <h4 className="font-semibold">{contract.contract_name}</h4>
                          <Badge className={getStatusColor(contract.status)}>
                            {contract.status}
                          </Badge>
                        </div>
                        
                        {contract.contract_number && (
                          <p className="text-sm text-gray-600">
                            Contract #: {contract.contract_number}
                          </p>
                        )}
                        
                        <p className="text-sm text-gray-600">
                          Effective: {new Date(contract.effective_date).toLocaleDateString()}
                          {contract.expiration_date && 
                            ` - ${new Date(contract.expiration_date).toLocaleDateString()}`
                          }
                        </p>
                        
                        {contract.reimbursement_rate && (
                          <p className="text-sm text-gray-600">
                            Reimbursement Rate: {contract.reimbursement_rate}%
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
