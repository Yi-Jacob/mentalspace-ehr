
import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FeeScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  payer?: any;
}

const FeeScheduleModal: React.FC<FeeScheduleModalProps> = ({ isOpen, onClose, payer }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingFee, setEditingFee] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    cpt_code: '',
    fee_amount: '',
    effective_date: '',
    expiration_date: '',
  });

  const { data: feeSchedules, isLoading } = useQuery({
    queryKey: ['payer-fee-schedules', payer?.id],
    queryFn: async () => {
      if (!payer?.id) return [];
      const { data, error } = await supabase
        .from('payer_fee_schedules')
        .select('*')
        .eq('payer_id', payer.id)
        .eq('is_active', true)
        .order('cpt_code');
      if (error) throw error;
      return data;
    },
    enabled: !!payer?.id,
  });

  const { data: cptCodes } = useQuery({
    queryKey: ['cpt-codes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cpt_codes')
        .select('code, description')
        .eq('is_active', true)
        .order('code');
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const feeData = {
        ...data,
        payer_id: payer.id,
        fee_amount: parseFloat(data.fee_amount),
      };

      if (editingFee) {
        const { error } = await supabase
          .from('payer_fee_schedules')
          .update(feeData)
          .eq('id', editingFee.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('payer_fee_schedules')
          .insert([feeData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payer-fee-schedules', payer?.id] });
      toast({
        title: editingFee ? 'Fee updated' : 'Fee created',
        description: 'Fee schedule has been saved successfully.',
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to save fee: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (feeId: string) => {
      const { error } = await supabase
        .from('payer_fee_schedules')
        .update({ is_active: false })
        .eq('id', feeId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payer-fee-schedules', payer?.id] });
      toast({
        title: 'Fee deactivated',
        description: 'Fee has been deactivated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to deactivate fee: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      cpt_code: '',
      fee_amount: '',
      effective_date: '',
      expiration_date: '',
    });
    setShowForm(false);
    setEditingFee(null);
  };

  const handleEdit = (fee: any) => {
    setFormData({
      cpt_code: fee.cpt_code || '',
      fee_amount: fee.fee_amount?.toString() || '',
      effective_date: fee.effective_date || '',
      expiration_date: fee.expiration_date || '',
    });
    setEditingFee(fee);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const getCptDescription = (code: string) => {
    const cpt = cptCodes?.find(c => c.code === code);
    return cpt?.description || '';
  };

  if (!payer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fee Schedule for {payer.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!showForm && (
            <div className="flex justify-end">
              <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Fee</span>
              </Button>
            </div>
          )}

          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingFee ? 'Edit Fee' : 'Add New Fee'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cpt_code">CPT Code *</Label>
                      <Input
                        id="cpt_code"
                        value={formData.cpt_code}
                        onChange={(e) => setFormData({ ...formData, cpt_code: e.target.value })}
                        placeholder="e.g., 90834"
                        required
                      />
                      {formData.cpt_code && (
                        <p className="text-xs text-gray-600 mt-1">
                          {getCptDescription(formData.cpt_code)}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="fee_amount">Fee Amount *</Label>
                      <Input
                        id="fee_amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.fee_amount}
                        onChange={(e) => setFormData({ ...formData, fee_amount: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saveMutation.isPending}>
                      {saveMutation.isPending ? 'Saving...' : (editingFee ? 'Update' : 'Create')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Existing Fee Schedules */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-4">Loading fee schedules...</div>
            ) : feeSchedules && feeSchedules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feeSchedules.map((fee) => (
                  <Card key={fee.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{fee.cpt_code}</h4>
                            <Badge variant="outline">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {parseFloat(fee.fee_amount.toString()).toFixed(2)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600">
                            {getCptDescription(fee.cpt_code)}
                          </p>
                          
                          <p className="text-sm text-gray-600">
                            Effective: {new Date(fee.effective_date).toLocaleDateString()}
                            {fee.expiration_date && 
                              ` - ${new Date(fee.expiration_date).toLocaleDateString()}`
                            }
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(fee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteMutation.mutate(fee.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No fee schedules found for this payer.</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Fee
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeeScheduleModal;
