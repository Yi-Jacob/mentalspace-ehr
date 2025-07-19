
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shared/ui/dialog';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Textarea } from '@/components/shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';

interface AddReferralSourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
}

const AddReferralSourceModal = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isPending 
}: AddReferralSourceModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Referral Source</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(new FormData(e.currentTarget));
        }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Contact Name</Label>
              <Input name="name" required />
            </div>
            <div>
              <Label htmlFor="organization">Organization</Label>
              <Input name="organization" required />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select name="type">
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Healthcare Provider">Healthcare Provider</SelectItem>
                  <SelectItem value="Hospital">Hospital</SelectItem>
                  <SelectItem value="Community Health">Community Health</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="specialty">Specialty</Label>
              <Input name="specialty" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input name="email" type="email" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input name="phone" />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input name="address" />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea name="notes" rows={3} />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Adding...' : 'Add Referral Source'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReferralSourceModal;
