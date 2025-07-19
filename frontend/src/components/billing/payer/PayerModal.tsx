
import React, { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shared/ui/dialog';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Textarea } from '@/components/shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { Checkbox } from '@/components/shared/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  payer?: any;
}

const PayerModal: React.FC<PayerModalProps> = ({ isOpen, onClose, payer }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    payer_type: 'out_of_network',
    electronic_payer_id: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zip_code: '',
    phone_number: '',
    fax_number: '',
    contact_person: '',
    contact_email: '',
    website: '',
    requires_authorization: false,
    notes: '',
  });

  useEffect(() => {
    if (payer) {
      setFormData({
        name: payer.name || '',
        payer_type: payer.payer_type || 'out_of_network',
        electronic_payer_id: payer.electronic_payer_id || '',
        address_line_1: payer.address_line_1 || '',
        address_line_2: payer.address_line_2 || '',
        city: payer.city || '',
        state: payer.state || '',
        zip_code: payer.zip_code || '',
        phone_number: payer.phone_number || '',
        fax_number: payer.fax_number || '',
        contact_person: payer.contact_person || '',
        contact_email: payer.contact_email || '',
        website: payer.website || '',
        requires_authorization: payer.requires_authorization || false,
        notes: payer.notes || '',
      });
    } else {
      setFormData({
        name: '',
        payer_type: 'out_of_network',
        electronic_payer_id: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip_code: '',
        phone_number: '',
        fax_number: '',
        contact_person: '',
        contact_email: '',
        website: '',
        requires_authorization: false,
        notes: '',
      });
    }
  }, [payer]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (payer) {
        const { error } = await supabase
          .from('payers')
          .update(data)
          .eq('id', payer.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('payers')
          .insert([data]);
        if (error) throw error;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{payer ? 'Edit Payer' : 'Add New Payer'}</DialogTitle>
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
              />
            </div>

            <div>
              <Label htmlFor="payer_type">Payer Type</Label>
              <Select
                value={formData.payer_type}
                onValueChange={(value) => setFormData({ ...formData, payer_type: value })}
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
            <Label htmlFor="electronic_payer_id">Electronic Payer ID</Label>
            <Input
              id="electronic_payer_id"
              value={formData.electronic_payer_id}
              onChange={(e) => setFormData({ ...formData, electronic_payer_id: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address_line_1">Address Line 1</Label>
              <Input
                id="address_line_1"
                value={formData.address_line_1}
                onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="address_line_2">Address Line 2</Label>
              <Input
                id="address_line_2"
                value={formData.address_line_2}
                onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
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
              />
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="fax_number">Fax Number</Label>
              <Input
                id="fax_number"
                value={formData.fax_number}
                onChange={(e) => setFormData({ ...formData, fax_number: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_person">Contact Person</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="requires_authorization"
              checked={formData.requires_authorization}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, requires_authorization: checked as boolean })
              }
            />
            <Label htmlFor="requires_authorization">Requires Authorization</Label>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : (payer ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PayerModal;
