import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Badge } from '@/components/basic/badge';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { clientService } from '@/services/clientService';
import { billingService, Claim, Payer } from '@/services/billingService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ClaimLineItem {
  id?: string;
  serviceDate: string;
  cptCode: string;
  modifier1?: string;
  modifier2?: string;
  modifier3?: string;
  modifier4?: string;
  diagnosisPointer?: number;
  units: number;
  chargeAmount: number;
  allowedAmount?: number;
  paidAmount?: number;
  adjustmentAmount?: number;
  patientResponsibility?: number;
  lineNote?: string;
}

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim?: Claim | null;
  mode?: 'create' | 'edit' | 'view';
}

const ClaimModal: React.FC<ClaimModalProps> = ({ isOpen, onClose, claim, mode = 'create' }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPayer, setSelectedPayer] = useState('none');
  const [formData, setFormData] = useState({
    claimNumber: '',
    serviceDate: new Date().toISOString().split('T')[0],
    status: 'draft',
    totalAmount: 0,
    paidAmount: 0,
    patientResponsibility: 0,
    authorizationNumber: '',
    diagnosisCodes: [] as string[],
    procedureCodes: [] as string[],
    placeOfService: '',
    claimFrequency: 'original',
    submissionMethod: 'electronic',
    notes: '',
  });

  const [lineItems, setLineItems] = useState<ClaimLineItem[]>([]);

  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      return clientService.getClients();
    },
  });

  const { data: payers } = useQuery({
    queryKey: ['payers'],
    queryFn: async () => {
      return billingService.getAllPayers();
    },
  });

  const { data: cptCodes } = useQuery({
    queryKey: ['cpt-codes'],
    queryFn: async () => {
      return billingService.getCptCodes();
    },
  });

  useEffect(() => {
    if (claim) {
      setSelectedClient(claim.clientId);
      setSelectedPayer(claim.payerId || 'none');
      setFormData({
        claimNumber: claim.claimNumber,
        serviceDate: claim.serviceDate ? new Date(claim.serviceDate).toISOString().split('T')[0] : '',
        status: claim.status || 'draft',
        totalAmount: claim.totalAmount || 0,
        paidAmount: claim.paidAmount || 0,
        patientResponsibility: claim.patientResponsibility || 0,
        authorizationNumber: claim.authorizationNumber || '',
        diagnosisCodes: claim.diagnosisCodes || [],
        procedureCodes: claim.procedureCodes || [],
        placeOfService: claim.placeOfService || '',
        claimFrequency: claim.claimFrequency || 'original',
        submissionMethod: claim.submissionMethod || 'electronic',
        notes: claim.notes || '',
      });
      // Note: Line items would need to be fetched separately in a real implementation
      setLineItems([]);
    } else {
      // Reset form for new claim
      setSelectedClient('');
      setSelectedPayer('none');
      setFormData({
        claimNumber: '',
        serviceDate: new Date().toISOString().split('T')[0],
        status: 'draft',
        totalAmount: 0,
        paidAmount: 0,
        patientResponsibility: 0,
        authorizationNumber: '',
        diagnosisCodes: [],
        procedureCodes: [],
        placeOfService: '',
        claimFrequency: 'original',
        submissionMethod: 'electronic',
        notes: '',
      });
      setLineItems([]);
    }
  }, [claim]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const claimData = {
        ...data,
        clientId: selectedClient,
        payerId: selectedPayer === 'none' ? null : selectedPayer,
        providerId: user?.id,
        serviceDate: new Date(data.serviceDate).toISOString(),
        totalAmount: parseFloat(data.totalAmount.toString()),
        paidAmount: data.paidAmount ? parseFloat(data.paidAmount.toString()) : null,
        patientResponsibility: data.patientResponsibility ? parseFloat(data.patientResponsibility.toString()) : null,
      };

      if (claim) {
        return billingService.updateClaim(claim.id, claimData);
      } else {
        return billingService.createClaim(claimData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      toast({
        title: claim ? 'Claim updated' : 'Claim created',
        description: 'Claim has been saved successfully.',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to save claim: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) {
      toast({
        title: 'Error',
        description: 'Please select a client.',
        variant: 'destructive',
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  const addLineItem = () => {
    const newLineItem: ClaimLineItem = {
      serviceDate: formData.serviceDate,
      cptCode: '',
      units: 1,
      chargeAmount: 0,
    };
    setLineItems([...lineItems, newLineItem]);
  };

  const updateLineItem = (index: number, field: keyof ClaimLineItem, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
    
    // Recalculate total amount
    const total = updated.reduce((sum, item) => sum + (item.chargeAmount * item.units), 0);
    setFormData({ ...formData, totalAmount: total });
  };

  const removeLineItem = (index: number) => {
    const updated = lineItems.filter((_, i) => i !== index);
    setLineItems(updated);
    
    // Recalculate total amount
    const total = updated.reduce((sum, item) => sum + (item.chargeAmount * item.units), 0);
    setFormData({ ...formData, totalAmount: total });
  };

  const commonDiagnosisCodes = [
    'F32.9', 'F33.9', 'F41.9', 'F43.10', 'F90.9', 'F91.9', 'F84.0', 'F84.5'
  ];

  const commonCptCodes = [
    '90834', '90837', '90847', '90846', '90832', '90853', '96116', '96125'
  ];

  const addDiagnosisCode = (code: string) => {
    if (!formData.diagnosisCodes.includes(code)) {
      setFormData({
        ...formData,
        diagnosisCodes: [...formData.diagnosisCodes, code]
      });
    }
  };

  const removeDiagnosisCode = (code: string) => {
    setFormData({
      ...formData,
      diagnosisCodes: formData.diagnosisCodes.filter(c => c !== code)
    });
  };

  const addProcedureCode = (code: string) => {
    if (!formData.procedureCodes.includes(code)) {
      setFormData({
        ...formData,
        procedureCodes: [...formData.procedureCodes, code]
      });
    }
  };

  const removeProcedureCode = (code: string) => {
    setFormData({
      ...formData,
      procedureCodes: formData.procedureCodes.filter(c => c !== code)
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'view' ? 'View Claim' : claim ? 'Edit Claim' : 'New Claim'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Claim Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="claimNumber">Claim Number *</Label>
              <Input
                id="claimNumber"
                value={formData.claimNumber}
                onChange={(e) => setFormData({ ...formData, claimNumber: e.target.value })}
                required
                disabled={mode === 'view'}
                placeholder="Auto-generated if empty"
              />
            </div>

            <div>
              <Label htmlFor="serviceDate">Service Date *</Label>
              <Input
                id="serviceDate"
                type="date"
                value={formData.serviceDate}
                onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                required
                disabled={mode === 'view'}
              />
            </div>
          </div>

          {/* Client and Payer Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client">Client *</Label>
              <Select 
                value={selectedClient} 
                onValueChange={setSelectedClient}
                disabled={mode === 'view'}
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
              <Label htmlFor="payer">Payer</Label>
              <Select 
                value={selectedPayer} 
                onValueChange={(value) => setSelectedPayer(value)}
                disabled={mode === 'view'}
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
          </div>

          {/* Status and Submission Info */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                disabled={mode === 'view'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="claimFrequency">Claim Frequency</Label>
              <Select
                value={formData.claimFrequency}
                onValueChange={(value) => setFormData({ ...formData, claimFrequency: value })}
                disabled={mode === 'view'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Original</SelectItem>
                  <SelectItem value="corrected">Corrected</SelectItem>
                  <SelectItem value="void">Void</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="submissionMethod">Submission Method</Label>
              <Select
                value={formData.submissionMethod}
                onValueChange={(value) => setFormData({ ...formData, submissionMethod: value })}
                disabled={mode === 'view'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="paper">Paper</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Diagnosis Codes */}
          <div>
            <Label>Diagnosis Codes</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.diagnosisCodes.map((code) => (
                <Badge
                  key={code}
                  variant="default"
                  className="cursor-pointer"
                  onClick={() => mode !== 'view' && removeDiagnosisCode(code)}
                >
                  {code} ×
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {commonDiagnosisCodes.map((code) => (
                <Badge
                  key={code}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => mode !== 'view' && addDiagnosisCode(code)}
                >
                  + {code}
                </Badge>
              ))}
            </div>
          </div>

          {/* Procedure Codes */}
          <div>
            <Label>Procedure Codes</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.procedureCodes.map((code) => (
                <Badge
                  key={code}
                  variant="default"
                  className="cursor-pointer"
                  onClick={() => mode !== 'view' && removeProcedureCode(code)}
                >
                  {code} ×
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {commonCptCodes.map((code) => (
                <Badge
                  key={code}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => mode !== 'view' && addProcedureCode(code)}
                >
                  + {code}
                </Badge>
              ))}
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label>Line Items</Label>
              {mode !== 'view' && (
                <Button type="button" onClick={addLineItem} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Line Item
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Line Item {index + 1}</h4>
                    {mode !== 'view' && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLineItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>CPT Code *</Label>
                      <Select
                        value={item.cptCode}
                        onValueChange={(value) => updateLineItem(index, 'cptCode', value)}
                        disabled={mode === 'view'}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select CPT" />
                        </SelectTrigger>
                        <SelectContent>
                          {cptCodes?.map((cpt) => (
                            <SelectItem key={cpt.code} value={cpt.code}>
                              {cpt.code} - {cpt.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Units *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.units}
                        onChange={(e) => updateLineItem(index, 'units', parseInt(e.target.value) || 1)}
                        disabled={mode === 'view'}
                      />
                    </div>

                    <div>
                      <Label>Charge Amount *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.chargeAmount}
                        onChange={(e) => updateLineItem(index, 'chargeAmount', parseFloat(e.target.value) || 0)}
                        disabled={mode === 'view'}
                      />
                    </div>

                    <div>
                      <Label>Line Total</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={`$${(item.chargeAmount * item.units).toFixed(2)}`}
                          disabled
                          className="bg-gray-100"
                        />
                        <Calculator className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label>Modifier 1</Label>
                      <Input
                        value={item.modifier1 || ''}
                        onChange={(e) => updateLineItem(index, 'modifier1', e.target.value)}
                        disabled={mode === 'view'}
                        placeholder="e.g., 25, 59"
                      />
                    </div>

                    <div>
                      <Label>Modifier 2</Label>
                      <Input
                        value={item.modifier2 || ''}
                        onChange={(e) => updateLineItem(index, 'modifier2', e.target.value)}
                        disabled={mode === 'view'}
                        placeholder="e.g., 25, 59"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>Line Note</Label>
                    <Textarea
                      value={item.lineNote || ''}
                      onChange={(e) => updateLineItem(index, 'lineNote', e.target.value)}
                      disabled={mode === 'view'}
                      rows={2}
                    />
                  </div>
                </div>
              ))}

              {lineItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No line items added yet.</p>
                  {mode !== 'view' && (
                    <p className="text-sm">Click "Add Line Item" to get started.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Financial Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Total Amount</Label>
                <Input
                  value={`$${formData.totalAmount.toFixed(2)}`}
                  disabled
                  className="bg-white"
                />
              </div>
              <div>
                <Label>Paid Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.paidAmount}
                  onChange={(e) => setFormData({ ...formData, paidAmount: parseFloat(e.target.value) || 0 })}
                  disabled={mode === 'view'}
                />
              </div>
              <div>
                <Label>Patient Responsibility</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.patientResponsibility}
                  onChange={(e) => setFormData({ ...formData, patientResponsibility: parseFloat(e.target.value) || 0 })}
                  disabled={mode === 'view'}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="authorizationNumber">Authorization Number</Label>
              <Input
                id="authorizationNumber"
                value={formData.authorizationNumber}
                onChange={(e) => setFormData({ ...formData, authorizationNumber: e.target.value })}
                disabled={mode === 'view'}
              />
            </div>

            <div>
              <Label htmlFor="placeOfService">Place of Service</Label>
              <Input
                id="placeOfService"
                value={formData.placeOfService}
                onChange={(e) => setFormData({ ...formData, placeOfService: e.target.value })}
                disabled={mode === 'view'}
                placeholder="e.g., 11, 12, 22"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={mode === 'view'}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {mode !== 'view' && (
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : (claim ? 'Update' : 'Create')}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimModal;
