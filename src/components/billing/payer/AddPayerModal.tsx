
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PayerFormData } from '@/types/billing';

interface AddPayerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddPayerModal: React.FC<AddPayerModalProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState<PayerFormData>({
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
    website: '',
    contact_person: '',
    contact_email: '',
    requires_authorization: false,
    notes: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createPayerMutation = useMutation({
    mutationFn: async (data: PayerFormData) => {
      const { error } = await supabase
        .from('payers')
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payer created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['payers'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create payer",
        variant: "destructive",
      });
      console.error('Create payer error:', error);
    },
  });

  const resetForm = () => {
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
      website: '',
      contact_person: '',
      contact_email: '',
      requires_authorization: false,
      notes: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPayerMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Payer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
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
              <Select value={formData.payer_type} onValueChange={(value: any) => setFormData({ ...formData, payer_type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_network">In Network</SelectItem>
                  <SelectItem value="out_of_network">Out of Network</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="self_pay">Self Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="electronic_payer_id">Electronic Payer ID</Label>
              <Input
                id="electronic_payer_id"
                value={formData.electronic_payer_id}
                onChange={(e) => setFormData({ ...formData, electronic_payer_id: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="address_line_1">Address Line 1</Label>
              <Input
                id="address_line_1"
                value={formData.address_line_1}
                onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="address_line_2">Address Line 2</Label>
              <Input
                id="address_line_2"
                value={formData.address_line_2}
                onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
              />
            </div>

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

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

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

            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requires_authorization"
                  checked={formData.requires_authorization}
                  onCheckedChange={(checked) => setFormData({ ...formData, requires_authorization: checked as boolean })}
                />
                <Label htmlFor="requires_authorization">Requires Authorization</Label>
              </div>
            </div>

            <div className="col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPayerMutation.isPending}>
              {createPayerMutation.isPending ? 'Creating...' : 'Create Payer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPayerModal;
