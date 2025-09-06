import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Badge } from '@/components/basic/badge';
import { Plus, Trash2, CreditCard, DollarSign } from 'lucide-react';
import { billingService, Payment, PaymentAllocation, Adjustment, Payer } from '@/services/billingService';
import { clientService } from '@/services/clientService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: Payment | null;
  mode?: 'create' | 'edit' | 'view';
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, payment, mode = 'create' }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedClient, setSelectedClient] = useState('none');
  const [selectedPayer, setSelectedPayer] = useState('none');
  const [selectedClaim, setSelectedClaim] = useState('none');
  const [formData, setFormData] = useState({
    paymentNumber: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'credit_card',
    paymentAmount: 0,
    status: 'pending',
    referenceNumber: '',
    creditCardLastFour: '',
    paymentProcessor: '',
    processingFee: 0,
    netAmount: 0,
    notes: '',
  });
  const [allocations, setAllocations] = useState<PaymentAllocation[]>([]);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      return clientService.getClients();
    },
  });

  const { data: payers } = useQuery({
    queryKey: ['payers'],
    queryFn: () => billingService.getAllPayers(),
  });

  const { data: claims } = useQuery({
    queryKey: ['claims', selectedClient],
    queryFn: () => billingService.getAllClaims(),
    enabled: !!selectedClient && selectedClient !== 'none',
  });

  const { data: claimLineItems } = useQuery({
    queryKey: ['claim-line-items', selectedClaim],
    queryFn: () => billingService.getClaimById(selectedClaim),
    enabled: !!selectedClaim && selectedClaim !== 'none',
  });

  useEffect(() => {
    if (payment) {
      setSelectedClient(payment.clientId);
      setSelectedPayer(payment.payerId || 'none');
      setSelectedClaim(payment.claimId || 'none');
      setFormData({
        paymentNumber: payment.paymentNumber,
        paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toISOString().split('T')[0] : '',
        paymentMethod: payment.paymentMethod,
        paymentAmount: payment.paymentAmount,
        status: payment.status || 'pending',
        referenceNumber: payment.referenceNumber || '',
        creditCardLastFour: payment.creditCardLastFour || '',
        paymentProcessor: payment.paymentProcessor || '',
        processingFee: payment.processingFee || 0,
        netAmount: payment.netAmount || payment.paymentAmount,
        notes: payment.notes || '',
      });
      setAllocations(payment.allocations || []);
      setAdjustments(payment.adjustments || []);
    } else {
      // Reset form for new payment
      setSelectedClient('none');
      setSelectedPayer('none');
      setSelectedClaim('none');
      setFormData({
        paymentNumber: '',
        paymentDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'credit_card',
        paymentAmount: 0,
        status: 'pending',
        referenceNumber: '',
        creditCardLastFour: '',
        paymentProcessor: '',
        processingFee: 0,
        netAmount: 0,
        notes: '',
      });
      setAllocations([]);
      setAdjustments([]);
    }
  }, [payment]);

  useEffect(() => {
    // Calculate net amount when payment amount or processing fee changes
    const netAmount = formData.paymentAmount - (formData.processingFee || 0);
    setFormData(prev => ({ ...prev, netAmount }));
  }, [formData.paymentAmount, formData.processingFee]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const paymentData = {
        ...data,
        clientId: selectedClient,
        payerId: selectedPayer === 'none' ? null : selectedPayer,
        claimId: selectedClaim === 'none' ? null : selectedClaim,
        paymentDate: new Date(data.paymentDate).toISOString(),
        paymentAmount: parseFloat(data.paymentAmount.toString()),
        processingFee: data.processingFee ? parseFloat(data.processingFee.toString()) : null,
        netAmount: data.netAmount ? parseFloat(data.netAmount.toString()) : null,
      };
      
      if (payment) {
        return billingService.updatePayment(payment.id, paymentData);
      } else {
        return billingService.createPayment(paymentData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast({
        title: 'Success',
        description: payment ? 'Payment updated successfully' : 'Payment created successfully',
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save payment',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient || selectedClient === 'none') {
      toast({
        title: 'Error',
        description: 'Please select a client',
        variant: 'destructive',
      });
      return;
    }

    if (formData.paymentAmount <= 0) {
      toast({
        title: 'Error',
        description: 'Payment amount must be greater than 0',
        variant: 'destructive',
      });
      return;
    }

    saveMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    if (id === 'client') {
      setSelectedClient(value);
      setSelectedClaim('none'); // Reset claim when client changes
    } else if (id === 'payer') {
      setSelectedPayer(value);
    } else if (id === 'claim') {
      setSelectedClaim(value);
    }
  };

  const handleNumberChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [id]: numValue }));
  };

  const addAllocation = () => {
    if (!selectedClaim || selectedClaim === 'none') {
      toast({
        title: 'Error',
        description: 'Please select a claim first',
        variant: 'destructive',
      });
      return;
    }

    const newAllocation: PaymentAllocation = {
      id: `temp-${Date.now()}`,
      paymentId: payment?.id || '',
      claimLineItemId: '',
      allocatedAmount: 0,
      allocationType: 'payment',
      createdAt: new Date().toISOString(),
    };
    setAllocations([...allocations, newAllocation]);
  };

  const updateAllocation = (index: number, field: keyof PaymentAllocation, value: any) => {
    const updated = [...allocations];
    updated[index] = { ...updated[index], [field]: value };
    setAllocations(updated);
  };

  const removeAllocation = (index: number) => {
    setAllocations(allocations.filter((_, i) => i !== index));
  };

  const addAdjustment = () => {
    if (!selectedClaim || selectedClaim === 'none') {
      toast({
        title: 'Error',
        description: 'Please select a claim first',
        variant: 'destructive',
      });
      return;
    }

    const newAdjustment: Adjustment = {
      id: `temp-${Date.now()}`,
      claimLineItemId: '',
      paymentId: payment?.id,
      sourceType: 'insurance',
      groupCode: 'CO',
      reasonCode: '',
      amount: 0,
      reasonText: '',
      createdById: user?.id,
      createdAt: new Date().toISOString(),
    };
    setAdjustments([...adjustments, newAdjustment]);
  };

  const updateAdjustment = (index: number, field: keyof Adjustment, value: any) => {
    const updated = [...adjustments];
    updated[index] = { ...updated[index], [field]: value };
    setAdjustments(updated);
  };

  const removeAdjustment = (index: number) => {
    setAdjustments(adjustments.filter((_, i) => i !== index));
  };

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';

  const paymentMethodOptions = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'ach', label: 'ACH' },
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'insurance', label: 'Insurance' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ];

  const sourceTypeOptions = [
    { value: 'insurance', label: 'Insurance' },
    { value: 'practice', label: 'Practice' },
  ];

  const groupCodeOptions = [
    { value: 'CO', label: 'CO - Contractual Obligation' },
    { value: 'PR', label: 'PR - Patient Responsibility' },
    { value: 'OA', label: 'OA - Other Adjustment' },
    { value: 'PI', label: 'PI - Payer Initiated Reduction' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isViewMode ? 'View Payment' : isEditMode ? 'Edit Payment' : 'Create New Payment'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Payment Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">Client *</Label>
              <Select 
                value={selectedClient} 
                onValueChange={(value) => handleSelectChange('client', value)}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select Client</SelectItem>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.lastName}, {client.firstName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="payer">Payer</Label>
              <Select 
                value={selectedPayer} 
                onValueChange={(value) => handleSelectChange('payer', value)}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Payer</SelectItem>
                  {payers?.map((payer) => (
                    <SelectItem key={payer.id} value={payer.id}>
                      {payer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="claim">Claim</Label>
              <Select 
                value={selectedClaim} 
                onValueChange={(value) => handleSelectChange('claim', value)}
                disabled={!selectedClient || selectedClient === 'none' || isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select claim" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Claim</SelectItem>
                  {claims?.map((claim) => (
                    <SelectItem key={claim.id} value={claim.id}>
                      #{claim.claimNumber} - {claim.client?.firstName} {claim.client?.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="paymentNumber">Payment Number *</Label>
              <Input
                id="paymentNumber"
                name="paymentNumber"
                value={formData.paymentNumber}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder="Auto-generated if empty"
              />
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentDate">Payment Date *</Label>
              <Input
                id="paymentDate"
                name="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={handleChange}
                disabled={isViewMode}
              />
            </div>

            <div>
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="paymentAmount">Payment Amount *</Label>
              <Input
                id="paymentAmount"
                name="paymentAmount"
                type="number"
                step="0.01"
                value={formData.paymentAmount}
                onChange={(e) => handleNumberChange('paymentAmount', e.target.value)}
                disabled={isViewMode}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Processing Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="referenceNumber">Reference Number</Label>
              <Input
                id="referenceNumber"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder="Transaction reference"
              />
            </div>

            <div>
              <Label htmlFor="creditCardLastFour">Card Last Four</Label>
              <Input
                id="creditCardLastFour"
                name="creditCardLastFour"
                value={formData.creditCardLastFour}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder="1234"
                maxLength={4}
              />
            </div>

            <div>
              <Label htmlFor="paymentProcessor">Payment Processor</Label>
              <Input
                id="paymentProcessor"
                name="paymentProcessor"
                value={formData.paymentProcessor}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder="Stripe, Square, etc."
              />
            </div>

            <div>
              <Label htmlFor="processingFee">Processing Fee</Label>
              <Input
                id="processingFee"
                name="processingFee"
                type="number"
                step="0.01"
                value={formData.processingFee}
                onChange={(e) => handleNumberChange('processingFee', e.target.value)}
                disabled={isViewMode}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="netAmount">Net Amount</Label>
              <Input
                id="netAmount"
                name="netAmount"
                type="number"
                step="0.01"
                value={formData.netAmount}
                disabled={true}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Payment Allocations */}
          {selectedClaim && selectedClaim !== 'none' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Payment Allocations</h3>
                {!isViewMode && (
                  <Button type="button" onClick={addAllocation} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Allocation
                  </Button>
                )}
              </div>

              {allocations.map((allocation, index) => (
                <div key={allocation.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Allocation {index + 1}</h4>
                    {!isViewMode && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAllocation(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Claim Line Item</Label>
                      <Select 
                        value={allocation.claimLineItemId} 
                        onValueChange={(value) => updateAllocation(index, 'claimLineItemId', value)}
                        disabled={isViewMode}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select line item" />
                        </SelectTrigger>
                        <SelectContent>
                          {claimLineItems?.lineItems?.map((lineItem) => (
                            <SelectItem key={lineItem.id} value={lineItem.id || ''}>
                              {lineItem.cptCode} - ${lineItem.chargeAmount} ({new Date(lineItem.serviceDate).toLocaleDateString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Allocated Amount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={allocation.allocatedAmount}
                        onChange={(e) => updateAllocation(index, 'allocatedAmount', parseFloat(e.target.value) || 0)}
                        disabled={isViewMode}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label>Allocation Type</Label>
                      <Select 
                        value={allocation.allocationType || 'payment'} 
                        onValueChange={(value) => updateAllocation(index, 'allocationType', value)}
                        disabled={isViewMode}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="payment">Payment</SelectItem>
                          <SelectItem value="adjustment">Adjustment</SelectItem>
                          <SelectItem value="refund">Refund</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Adjustments */}
          {selectedClaim && selectedClaim !== 'none' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Adjustments</h3>
                {!isViewMode && (
                  <Button type="button" onClick={addAdjustment} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Adjustment
                  </Button>
                )}
              </div>

              {adjustments.map((adjustment, index) => (
                <div key={adjustment.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Adjustment {index + 1}</h4>
                    {!isViewMode && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAdjustment(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Claim Line Item</Label>
                      <Select 
                        value={adjustment.claimLineItemId} 
                        onValueChange={(value) => updateAdjustment(index, 'claimLineItemId', value)}
                        disabled={isViewMode}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select line item" />
                        </SelectTrigger>
                        <SelectContent>
                          {claimLineItems?.lineItems?.map((lineItem) => (
                            <SelectItem key={lineItem.id} value={lineItem.id || ''}>
                              {lineItem.cptCode} - ${lineItem.chargeAmount} ({new Date(lineItem.serviceDate).toLocaleDateString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={adjustment.amount}
                        onChange={(e) => updateAdjustment(index, 'amount', parseFloat(e.target.value) || 0)}
                        disabled={isViewMode}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label>Source Type</Label>
                      <Select 
                        value={adjustment.sourceType} 
                        onValueChange={(value) => updateAdjustment(index, 'sourceType', value)}
                        disabled={isViewMode}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sourceTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Group Code</Label>
                      <Select 
                        value={adjustment.groupCode} 
                        onValueChange={(value) => updateAdjustment(index, 'groupCode', value)}
                        disabled={isViewMode}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {groupCodeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Reason Code</Label>
                      <Input
                        value={adjustment.reasonCode}
                        onChange={(e) => updateAdjustment(index, 'reasonCode', e.target.value)}
                        disabled={isViewMode}
                        placeholder="CARC code"
                      />
                    </div>

                    <div>
                      <Label>Reason Text</Label>
                      <Input
                        value={adjustment.reasonText || ''}
                        onChange={(e) => updateAdjustment(index, 'reasonText', e.target.value)}
                        disabled={isViewMode}
                        placeholder="Adjustment reason"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              disabled={isViewMode}
              placeholder="Additional payment notes..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {isViewMode ? 'Close' : 'Cancel'}
            </Button>
            {!isViewMode && (
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : (payment ? 'Update Payment' : 'Create Payment')}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
