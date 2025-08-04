import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/basic/dialog';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Textarea } from '@/components/basic/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { useToast } from '@/hooks/use-toast';
import { staffService } from '@/services/staffService';
import { StaffMember } from '@/types/staffType';

interface CreateSupervisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateSupervisionModal: React.FC<CreateSupervisionModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const [supervisors, setSupervisors] = useState<StaffMember[]>([]);
  const [supervisees, setSupervisees] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    supervisorId: '',
    superviseeId: '',
    startDate: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadCandidates();
    }
  }, [isOpen]);

  const loadCandidates = async () => {
    try {
      const [supervisorData, superviseeData] = await Promise.all([
        staffService.getSupervisorCandidates(),
        staffService.getSuperviseeCandidates()
      ]);
      setSupervisors(supervisorData);
      setSupervisees(superviseeData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load candidates',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await staffService.createSupervisionRelationship({
        ...formData,
        status: 'active'
      });

      toast({
        title: 'Success',
        description: 'Supervision relationship created successfully'
      });

      onSuccess();
      onClose();
      setFormData({
        supervisorId: '',
        superviseeId: '',
        startDate: '',
        notes: ''
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create supervision relationship',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getFullName = (user: StaffMember) => {
    return `${user.firstName} ${user.lastName}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Supervision Relationship</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supervisor">Supervisor *</Label>
            <Select
              value={formData.supervisorId}
              onValueChange={(value) => setFormData({ ...formData, supervisorId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select supervisor" />
              </SelectTrigger>
              <SelectContent>
                {supervisors.map((supervisor) => (
                  <SelectItem key={supervisor.id} value={supervisor.id}>
                    {getFullName(supervisor)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supervisee">Supervisee *</Label>
            <Select
              value={formData.superviseeId}
              onValueChange={(value) => setFormData({ ...formData, superviseeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select supervisee" />
              </SelectTrigger>
              <SelectContent>
                {supervisees.map((supervisee) => (
                  <SelectItem key={supervisee.id} value={supervisee.id}>
                    {getFullName(supervisee)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Enter any additional notes..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.supervisorId || !formData.superviseeId || !formData.startDate}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 