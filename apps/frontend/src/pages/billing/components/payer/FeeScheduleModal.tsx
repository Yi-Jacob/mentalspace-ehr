
import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Badge } from '@/components/basic/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { billingService, FeeSchedule, CptCode } from '@/services/billingService';
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
    cptCode: '',
    feeAmount: '',
    effectiveDate: '',
    expirationDate: '',
  });

  const { data: feeSchedules, isLoading } = useQuery({
    queryKey: ['payer-fee-schedules', payer?.id],
    queryFn: async () => {
      if (!payer?.id) return [];
      return billingService.getAllFeeSchedules(payer.id);
    },
    enabled: !!payer?.id,
  });

  const { data: cptCodes } = useQuery({
    queryKey: ['cpt-codes'],
    queryFn: async () => {
      return billingService.getCptCodes();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const feeData = {
        ...data,
        payerId: payer.id,
        feeAmount: parseFloat(data.feeAmount),
      };

      if (editingFee) {
        return billingService.updateFeeSchedule(editingFee.id, feeData);
      } else {
        return billingService.createFeeSchedule(feeData);
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
      return billingService.deleteFeeSchedule(feeId);
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
      cptCode: '',
      feeAmount: '',
      effectiveDate: '',
      expirationDate: '',
    });
    setShowForm(false);
    setEditingFee(null);
  };

  const handleEdit = (fee: any) => {
    setFormData({
      cptCode: fee.cptCode || '',
      feeAmount: fee.feeAmount?.toString() || '',
      effectiveDate: fee.effectiveDate || '',
      expirationDate: fee.expirationDate || '',
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
                      <Label htmlFor="cptCode">CPT Code *</Label>
                      <Input
                        id="cptCode"
                        value={formData.cptCode}
                        onChange={(e) => setFormData({ ...formData, cptCode: e.target.value })}
                        placeholder="e.g., 90834"
                        required
                      />
                      {formData.cptCode && (
                        <p className="text-xs text-gray-600 mt-1">
                          {getCptDescription(formData.cptCode)}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="feeAmount">Fee Amount *</Label>
                      <Input
                        id="feeAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.feeAmount}
                        onChange={(e) => setFormData({ ...formData, feeAmount: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
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
                          <h4 className="font-semibold">{fee.cptCode}</h4>
                          <Badge variant="outline">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {parseFloat(fee.feeAmount.toString()).toFixed(2)}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          {getCptDescription(fee.cptCode)}
                        </p>
                        
                        <p className="text-sm text-gray-600">
                          Effective: {new Date(fee.effectiveDate).toLocaleDateString()}
                          {fee.expirationDate && 
                            ` - ${new Date(fee.expirationDate).toLocaleDateString()}`
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
