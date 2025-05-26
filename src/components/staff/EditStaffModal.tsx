
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useStaffManagement } from '@/hooks/useStaffManagement';
import { StaffMember, UserStatus } from '@/types/staff';

interface EditStaffModalProps {
  staff: StaffMember;
  isOpen: boolean;
  onClose: () => void;
}

const EditStaffModal: React.FC<EditStaffModalProps> = ({ staff, isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: staff.first_name,
    last_name: staff.last_name,
    email: staff.email,
    employee_id: staff.staff_profile?.employee_id || '',
    job_title: staff.staff_profile?.job_title || '',
    department: staff.staff_profile?.department || '',
    phone_number: staff.staff_profile?.phone_number || '',
    npi_number: staff.staff_profile?.npi_number || '',
    license_number: staff.staff_profile?.license_number || '',
    license_state: staff.staff_profile?.license_state || '',
    license_expiry_date: staff.staff_profile?.license_expiry_date || '',
    hire_date: staff.staff_profile?.hire_date || '',
    billing_rate: staff.staff_profile?.billing_rate?.toString() || '',
    can_bill_insurance: staff.staff_profile?.can_bill_insurance || false,
    status: staff.staff_profile?.status || 'active' as UserStatus,
    notes: staff.staff_profile?.notes || '',
  });

  const { updateStaffProfile, isUpdating } = useStaffManagement();

  useEffect(() => {
    if (staff) {
      setFormData({
        first_name: staff.first_name,
        last_name: staff.last_name,
        email: staff.email,
        employee_id: staff.staff_profile?.employee_id || '',
        job_title: staff.staff_profile?.job_title || '',
        department: staff.staff_profile?.department || '',
        phone_number: staff.staff_profile?.phone_number || '',
        npi_number: staff.staff_profile?.npi_number || '',
        license_number: staff.staff_profile?.license_number || '',
        license_state: staff.staff_profile?.license_state || '',
        license_expiry_date: staff.staff_profile?.license_expiry_date || '',
        hire_date: staff.staff_profile?.hire_date || '',
        billing_rate: staff.staff_profile?.billing_rate?.toString() || '',
        can_bill_insurance: staff.staff_profile?.can_bill_insurance || false,
        status: staff.staff_profile?.status || 'active' as UserStatus,
        notes: staff.staff_profile?.notes || '',
      });
    }
  }, [staff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (staff.staff_profile?.id) {
      updateStaffProfile({
        id: staff.staff_profile.id,
        employee_id: formData.employee_id || undefined,
        job_title: formData.job_title || undefined,
        department: formData.department || undefined,
        phone_number: formData.phone_number || undefined,
        npi_number: formData.npi_number || undefined,
        license_number: formData.license_number || undefined,
        license_state: formData.license_state || undefined,
        license_expiry_date: formData.license_expiry_date || undefined,
        hire_date: formData.hire_date || undefined,
        billing_rate: formData.billing_rate ? parseFloat(formData.billing_rate) : undefined,
        can_bill_insurance: formData.can_bill_insurance,
        status: formData.status,
        notes: formData.notes || undefined,
      });
    }

    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Staff Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                disabled
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                id="employee_id"
                value={formData.employee_id}
                onChange={(e) => handleChange('employee_id', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                value={formData.job_title}
                onChange={(e) => handleChange('job_title', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleChange('phone_number', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Staff Member'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffModal;
