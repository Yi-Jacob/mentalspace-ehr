
import React, { useState, useEffect } from 'react';
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
import { Payer, PayerFormData } from '@/types/billing';

interface EditPayerModalProps {
  payer: Payer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditPayerModal: React.FC<EditPayerModalProps> = ({ payer, open, onOpenChange }) => {
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

  useEffect(() => {
    if (payer) {
      setFormData({
        name: payer.name || '',
        payer_type: payer.payer_type as any,
        electronic_payer_id: payer.electronic_payer_id || '',
        address_line_1: payer.address_line_1 || '',
        address_line_2: payer.address_line_2 || '',
        city: payer.city || '',
        state: payer.state || '',
        zip_code: payer.zip_code || '',
        phone_number: payer.phone_number || '',
        fax_number: payer.fax_number || '',
        website: payer.website || '',
        contact_person: payer.contact_person || '',
        contact_email: payer.contact_email || '',
        requires_authorization: payer.requires_authorization || false,
        notes: payer.notes || '',
      });
    }
  }, [payer]);

  const updatePayerMutation = useMutation({
    mutationFn: async (data: PayerFormData) => {
      const { error } = await supabase
        .from('payers')
        .update(data)
        .eq('id', payer.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payer updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['payers'] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update payer",
        variant: "destructive",
      });
      console.error('Update payer error:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePayerMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Payer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Same form structure as AddPayerModal */}
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

            {/* ... rest of form fields same as AddPayerModal */}
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
            <Button type="submit" disabled={updatePayerMutation.isPending}>
              {updatePayerMutation.isPending ? 'Updating...' : 'Update Payer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPayerModal;
