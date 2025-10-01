import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Switch } from '@/components/basic/switch';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { schedulingService, CreateWaitlistData } from '@/services/schedulingService';
import { clinicianAssignmentService } from '@/services/clinicianAssignmentService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface AskMeetingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


const AskMeetingModal: React.FC<AskMeetingModalProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateWaitlistData>({
    clientId: user?.clientId,
    providerId: '',
    preferredDate: '',
    preferredTimeStart: '',
    notes: '',
    isTelehealth: false,
  });

  // Auto-set client ID for patients
  React.useEffect(() => {
    if (user?.roles?.includes('PATIENT') && user.clientId) {
      setFormData(prev => ({ ...prev, clientId: user.clientId! }));
    }
  }, [user]);

  // Get available staff/providers for the current client
  const { data: staff = [] } = useQuery({
    queryKey: ['staff-for-waitlist', user?.clientId],
    queryFn: async () => {
      if (user?.clientId) {
        const clinicians = await clinicianAssignmentService.getClientClinicians(user.clientId);
        return clinicians.map(assignment => ({
          id: assignment.clinician.user.id,
          firstName: assignment.clinician.user.firstName,
          lastName: assignment.clinician.user.lastName,
        }));
      }
      return [];
    },
    enabled: open && !!user?.clientId,
  });

  const createWaitlistMutation = useMutation({
    mutationFn: (data: CreateWaitlistData) => schedulingService.createWaitlistEntry(data),
    onSuccess: () => {
      toast.success('Meeting request submitted successfully');
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit meeting request');
    },
  });

  const resetForm = () => {
    setFormData({
      clientId: user.clientId,
      providerId: '',
      preferredDate: '',
      preferredTimeStart: '',
      notes: '',
      isTelehealth: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.providerId || !formData.preferredDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    createWaitlistMutation.mutate(formData);
  };


  const handleProviderChange = (providerId: string) => {
    setFormData(prev => ({ ...prev, providerId }));
  };

  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, preferredDate: date }));
  };

  const handleTimeChange = (time: string) => {
    setFormData(prev => ({ ...prev, preferredTimeStart: time }));
  };

  const handleNotesChange = (notes: string) => {
    setFormData(prev => ({ ...prev, notes }));
  };

  const handleTelehealthChange = (isTelehealth: boolean) => {
    setFormData(prev => ({ ...prev, isTelehealth }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request a Meeting</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">Provider *</Label>
            <Select value={formData.providerId} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((provider: any) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.firstName} {provider.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredDate">Preferred Date *</Label>
            <Input
              id="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredTime">Preferred Time</Label>
            <Input
              id="preferredTime"
              type="time"
              value={formData.preferredTimeStart}
              onChange={(e) => handleTimeChange(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isTelehealth"
              checked={formData.isTelehealth}
              onCheckedChange={handleTelehealthChange}
            />
            <Label htmlFor="isTelehealth">Telehealth appointment</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information about your meeting request..."
              value={formData.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createWaitlistMutation.isPending}
            >
              {createWaitlistMutation.isPending ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AskMeetingModal;
