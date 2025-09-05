
import React, { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Checkbox } from '@/components/basic/checkbox';
import { billingService, Payer } from '@/services/billingService';
import { useToast } from '@/hooks/use-toast';

interface PayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  payer?: any;
  mode?: 'create' | 'edit' | 'view';
}

const PayerModal: React.FC<PayerModalProps> = ({ isOpen, onClose, payer, mode = 'create' }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    payerType: 'out_of_network',
    electronicPayerId: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    faxNumber: '',
    contactPerson: '',
    contactEmail: '',
    website: '',
    requiresAuthorization: false,
    notes: '',
  });

  useEffect(() => {
    if (payer) {
      setFormData({
        name: payer.name || '',
        payerType: payer.payerType || 'out_of_network',
        electronicPayerId: payer.electronicPayerId || '',
        addressLine1: payer.addressLine1 || '',
        addressLine2: payer.addressLine2 || '',
        city: payer.city || '',
        state: payer.state || '',
        zipCode: payer.zipCode || '',
        phoneNumber: payer.phoneNumber || '',
        faxNumber: payer.faxNumber || '',
        contactPerson: payer.contactPerson || '',
        contactEmail: payer.contactEmail || '',
        website: payer.website || '',
        requiresAuthorization: payer.requiresAuthorization || false,
        notes: payer.notes || '',
      });
    } else {
      setFormData({
        name: '',
        payerType: 'out_of_network',
        electronicPayerId: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
        faxNumber: '',
        contactPerson: '',
        contactEmail: '',
        website: '',
        requiresAuthorization: false,
        notes: '',
      });
    }
  }, [payer]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (payer) {
        return billingService.updatePayer(payer.id, data);
      } else {
        return billingService.createPayer(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payers'] });
      toast({
        title: payer ? 'Payer updated' : 'Payer created',
        description: `${formData.name} has been ${payer ? 'updated' : 'created'} successfully.`,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to ${payer ? 'update' : 'create'} payer: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (payer) {
        return billingService.deletePayer(payer.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payers'] });
      toast({
        title: 'Payer deleted',
        description: `${payer?.name} has been deleted successfully.`,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete payer: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'view' ? 'View Payer' : payer ? 'Edit Payer' : 'Add New Payer'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Payer Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={mode === 'view'}
              />
            </div>

            <div>
              <Label htmlFor="payerType">Payer Type</Label>
              <Select
                value={formData.payerType}
                onValueChange={(value) => setFormData({ ...formData, payerType: value })}
                disabled={mode === 'view'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_network">In-Network</SelectItem>
                  <SelectItem value="out_of_network">Out-of-Network</SelectItem>
                  <SelectItem value="self_pay">Self-Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="electronicPayerId">Electronic Payer ID</Label>
            <Input
              id="electronicPayerId"
              value={formData.electronicPayerId}
              onChange={(e) => setFormData({ ...formData, electronicPayerId: e.target.value })}
              disabled={mode === 'view'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Input
                id="addressLine1"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                disabled={mode === 'view'}
              />
            </div>

            <div>
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                disabled={mode === 'view'}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={mode === 'view'}
              />
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                disabled={mode === 'view'}
              />
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                disabled={mode === 'view'}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                disabled={mode === 'view'}
              />
            </div>

            <div>
              <Label htmlFor="faxNumber">Fax Number</Label>
              <Input
                id="faxNumber"
                value={formData.faxNumber}
                onChange={(e) => setFormData({ ...formData, faxNumber: e.target.value })}
                disabled={mode === 'view'}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                disabled={mode === 'view'}
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                disabled={mode === 'view'}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              disabled={mode === 'view'}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="requiresAuthorization"
              checked={formData.requiresAuthorization}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, requiresAuthorization: checked as boolean })
              }
              disabled={mode === 'view'}
            />
            <Label htmlFor="requiresAuthorization">Requires Authorization</Label>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              disabled={mode === 'view'}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {mode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {mode === 'view' && payer && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            )}
            {mode !== 'view' && (
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : (payer ? 'Update' : 'Create')}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PayerModal;
