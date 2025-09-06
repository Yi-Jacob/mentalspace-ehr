import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Badge } from '@/components/basic/badge';
import { Plus, Trash2, Receipt, FileText } from 'lucide-react';
import { billingService, PatientStatement, StatementLineItem, Claim } from '@/services/billingService';
import { clientService } from '@/services/clientService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface StatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  statement?: PatientStatement | null;
  mode?: 'create' | 'edit' | 'view';
}

const StatementModal: React.FC<StatementModalProps> = ({ isOpen, onClose, statement, mode = 'create' }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedClient, setSelectedClient] = useState('none');
  const [formData, setFormData] = useState({
    statementNumber: '',
    statementDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    totalAmount: 0,
    previousBalance: 0,
    paymentsReceived: 0,
    adjustments: 0,
    currentBalance: 0,
    status: 'draft',
    deliveryMethod: 'email',
    paymentLink: '',
    notes: '',
  });
  const [lineItems, setLineItems] = useState<StatementLineItem[]>([]);

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      return clientService.getClients();
    },
  });

  const { data: claims } = useQuery({
    queryKey: ['claims', selectedClient],
    queryFn: () => billingService.getAllClaims(),
    enabled: !!selectedClient && selectedClient !== 'none',
  });

  const { data: claimLineItems } = useQuery({
    queryKey: ['claim-line-items', selectedClient],
    queryFn: () => billingService.getAllClaims(),
    enabled: !!selectedClient && selectedClient !== 'none',
  });

  useEffect(() => {
    if (statement) {
      setSelectedClient(statement.clientId);
      setFormData({
        statementNumber: statement.statementNumber,
        statementDate: statement.statementDate ? new Date(statement.statementDate).toISOString().split('T')[0] : '',
        dueDate: statement.dueDate ? new Date(statement.dueDate).toISOString().split('T')[0] : '',
        totalAmount: statement.totalAmount,
        previousBalance: statement.previousBalance || 0,
        paymentsReceived: statement.paymentsReceived || 0,
        adjustments: statement.adjustments || 0,
        currentBalance: statement.currentBalance,
        status: statement.status || 'draft',
        deliveryMethod: statement.deliveryMethod || 'email',
        paymentLink: statement.paymentLink || '',
        notes: statement.notes || '',
      });
      setLineItems(statement.lineItems || []);
    } else {
      // Reset form for new statement
      setSelectedClient('none');
      setFormData({
        statementNumber: '',
        statementDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalAmount: 0,
        previousBalance: 0,
        paymentsReceived: 0,
        adjustments: 0,
        currentBalance: 0,
        status: 'draft',
        deliveryMethod: 'email',
        paymentLink: '',
        notes: '',
      });
      setLineItems([]);
    }
  }, [statement]);

  useEffect(() => {
    // Calculate current balance
    const currentBalance = formData.previousBalance + formData.totalAmount - formData.paymentsReceived - formData.adjustments;
    setFormData(prev => ({ ...prev, currentBalance }));
  }, [formData.previousBalance, formData.totalAmount, formData.paymentsReceived, formData.adjustments]);

  useEffect(() => {
    // Calculate total amount from line items
    const totalAmount = lineItems.reduce((sum, item) => sum + item.patientResponsibility, 0);
    setFormData(prev => ({ ...prev, totalAmount }));
  }, [lineItems]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const statementData = {
        ...data,
        clientId: selectedClient,
        statementDate: new Date(data.statementDate).toISOString(),
        dueDate: new Date(data.dueDate).toISOString(),
        totalAmount: parseFloat(data.totalAmount.toString()),
        previousBalance: data.previousBalance ? parseFloat(data.previousBalance.toString()) : null,
        paymentsReceived: data.paymentsReceived ? parseFloat(data.paymentsReceived.toString()) : null,
        adjustments: data.adjustments ? parseFloat(data.adjustments.toString()) : null,
        currentBalance: parseFloat(data.currentBalance.toString()),
        lineItems: lineItems.map(item => ({
          claimId: item.claimId,
          claimLineItemId: item.claimLineItemId,
          serviceDate: item.serviceDate,
          description: item.description,
          cptCode: item.cptCode,
          chargeAmount: item.chargeAmount,
          insurancePayment: item.insurancePayment,
          adjustmentAmount: item.adjustmentAmount,
          patientResponsibility: item.patientResponsibility,
        })),
      };
      
      if (statement) {
        return billingService.updateStatement(statement.id, statementData);
      } else {
        return billingService.createStatement(statementData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-statements'] });
      toast({
        title: 'Success',
        description: statement ? 'Statement updated successfully' : 'Statement created successfully',
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save statement',
        variant: 'destructive',
      });
    },
  });

  const generateStatementNumberMutation = useMutation({
    mutationFn: () => billingService.generateStatementNumber(),
    onSuccess: (data) => {
      setFormData(prev => ({ ...prev, statementNumber: data.statementNumber }));
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

    if (formData.totalAmount <= 0) {
      toast({
        title: 'Error',
        description: 'Total amount must be greater than 0',
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
    }
  };

  const handleNumberChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [id]: numValue }));
  };

  const addLineItem = () => {
    if (!selectedClient || selectedClient === 'none') {
      toast({
        title: 'Error',
        description: 'Please select a client first',
        variant: 'destructive',
      });
      return;
    }

    const newLineItem: StatementLineItem = {
      id: `temp-${Date.now()}`,
      statementId: statement?.id || '',
      claimId: '',
      claimLineItemId: '',
      serviceDate: new Date().toISOString(),
      description: '',
      cptCode: '',
      chargeAmount: 0,
      insurancePayment: 0,
      adjustmentAmount: 0,
      patientResponsibility: 0,
      createdAt: new Date().toISOString(),
    };
    setLineItems([...lineItems, newLineItem]);
  };

  const updateLineItem = (index: number, field: keyof StatementLineItem, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-calculate patient responsibility
    if (field === 'chargeAmount' || field === 'insurancePayment' || field === 'adjustmentAmount') {
      const chargeAmount = field === 'chargeAmount' ? parseFloat(value) || 0 : updated[index].chargeAmount;
      const insurancePayment = field === 'insurancePayment' ? parseFloat(value) || 0 : updated[index].insurancePayment;
      const adjustmentAmount = field === 'adjustmentAmount' ? parseFloat(value) || 0 : updated[index].adjustmentAmount;
      
      updated[index].patientResponsibility = chargeAmount - insurancePayment - adjustmentAmount;
    }
    
    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
  ];

  const deliveryMethodOptions = [
    { value: 'email', label: 'Email' },
    { value: 'mail', label: 'Mail' },
    { value: 'portal', label: 'Patient Portal' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isViewMode ? 'View Statement' : isEditMode ? 'Edit Statement' : 'Create New Statement'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Statement Information */}
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
              <Label htmlFor="statementNumber">Statement Number *</Label>
              <div className="flex space-x-2">
                <Input
                  id="statementNumber"
                  name="statementNumber"
                  value={formData.statementNumber}
                  onChange={handleChange}
                  disabled={isViewMode}
                  placeholder="Auto-generated if empty"
                />
                {!isViewMode && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => generateStatementNumberMutation.mutate()}
                    disabled={generateStatementNumberMutation.isPending}
                  >
                    Generate
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Statement Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="statementDate">Statement Date *</Label>
              <Input
                id="statementDate"
                name="statementDate"
                type="date"
                value={formData.statementDate}
                onChange={handleChange}
                disabled={isViewMode}
              />
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                disabled={isViewMode}
              />
            </div>
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="previousBalance">Previous Balance</Label>
              <Input
                id="previousBalance"
                name="previousBalance"
                type="number"
                step="0.01"
                value={formData.previousBalance}
                onChange={(e) => handleNumberChange('previousBalance', e.target.value)}
                disabled={isViewMode}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="paymentsReceived">Payments Received</Label>
              <Input
                id="paymentsReceived"
                name="paymentsReceived"
                type="number"
                step="0.01"
                value={formData.paymentsReceived}
                onChange={(e) => handleNumberChange('paymentsReceived', e.target.value)}
                disabled={isViewMode}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="adjustments">Adjustments</Label>
              <Input
                id="adjustments"
                name="adjustments"
                type="number"
                step="0.01"
                value={formData.adjustments}
                onChange={(e) => handleNumberChange('adjustments', e.target.value)}
                disabled={isViewMode}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="currentBalance">Current Balance</Label>
              <Input
                id="currentBalance"
                name="currentBalance"
                type="number"
                step="0.01"
                value={formData.currentBalance}
                disabled={true}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Statement Settings */}
          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <Label htmlFor="deliveryMethod">Delivery Method</Label>
              <Select 
                value={formData.deliveryMethod} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryMethod: value }))}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {deliveryMethodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Statement Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Statement Line Items</h3>
              {!isViewMode && (
                <Button type="button" onClick={addLineItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line Item
                </Button>
              )}
            </div>

            {lineItems.map((lineItem, index) => (
              <div key={lineItem.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Line Item {index + 1}</h4>
                  {!isViewMode && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLineItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Service Date</Label>
                    <Input
                      type="date"
                      value={lineItem.serviceDate ? new Date(lineItem.serviceDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateLineItem(index, 'serviceDate', e.target.value)}
                      disabled={isViewMode}
                    />
                  </div>

                  <div>
                    <Label>Description *</Label>
                    <Input
                      value={lineItem.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      disabled={isViewMode}
                      placeholder="Service description"
                    />
                  </div>

                  <div>
                    <Label>CPT Code</Label>
                    <Input
                      value={lineItem.cptCode || ''}
                      onChange={(e) => updateLineItem(index, 'cptCode', e.target.value)}
                      disabled={isViewMode}
                      placeholder="CPT code"
                    />
                  </div>

                  <div>
                    <Label>Charge Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={lineItem.chargeAmount}
                      onChange={(e) => updateLineItem(index, 'chargeAmount', parseFloat(e.target.value) || 0)}
                      disabled={isViewMode}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label>Insurance Payment</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={lineItem.insurancePayment || 0}
                      onChange={(e) => updateLineItem(index, 'insurancePayment', parseFloat(e.target.value) || 0)}
                      disabled={isViewMode}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label>Adjustment Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={lineItem.adjustmentAmount || 0}
                      onChange={(e) => updateLineItem(index, 'adjustmentAmount', parseFloat(e.target.value) || 0)}
                      disabled={isViewMode}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label>Patient Responsibility</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={lineItem.patientResponsibility}
                      disabled={true}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Link and Notes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paymentLink">Payment Link</Label>
              <Input
                id="paymentLink"
                name="paymentLink"
                value={formData.paymentLink}
                onChange={handleChange}
                disabled={isViewMode}
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              disabled={isViewMode}
              placeholder="Additional statement notes..."
              rows={3}
            />
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Financial Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Previous Balance:</strong> ${formData.previousBalance.toFixed(2)}
              </div>
              <div>
                <strong>Total Amount:</strong> ${formData.totalAmount.toFixed(2)}
              </div>
              <div>
                <strong>Payments Received:</strong> ${formData.paymentsReceived.toFixed(2)}
              </div>
              <div>
                <strong>Adjustments:</strong> ${formData.adjustments.toFixed(2)}
              </div>
              <div className="col-span-2 border-t pt-2">
                <strong>Current Balance:</strong> 
                <span className={`ml-2 ${formData.currentBalance > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}`}>
                  ${formData.currentBalance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {isViewMode ? 'Close' : 'Cancel'}
            </Button>
            {!isViewMode && (
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : (statement ? 'Update Statement' : 'Create Statement')}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StatementModal;
