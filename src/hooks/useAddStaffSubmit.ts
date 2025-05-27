
import { useNavigate } from 'react-router-dom';
import { useStaffManagement } from '@/hooks/useStaffManagement';
import { UserStatus } from '@/types/staff';

export const useAddStaffSubmit = () => {
  const navigate = useNavigate();
  const { createStaffMember, isCreatingStaff } = useStaffManagement();

  const handleSubmit = async (e: React.FormEvent, formData: any) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.email) {
      return;
    }

    // Validate supervision requirements
    if (formData.supervision_type !== 'Not Supervised' && !formData.supervisor_id) {
      console.error('Supervisor is required when supervision type is selected');
      return;
    }

    // Prepare data for the createStaffMember function
    const staffData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      roles: formData.roles,
      employee_id: formData.employee_id || undefined,
      job_title: formData.job_title || undefined,
      department: formData.department || undefined,
      phone_number: formData.phone_number || formData.mobile_phone || undefined,
      npi_number: formData.npi_number || undefined,
      license_number: formData.license_number || undefined,
      license_state: formData.license_state || undefined,
      license_expiry_date: formData.license_expiry_date || undefined,
      hire_date: formData.hire_date || undefined,
      billing_rate: formData.billing_rate ? parseFloat(formData.billing_rate) : undefined,
      can_bill_insurance: formData.can_bill_insurance,
      status: formData.status,
      notes: formData.notes || undefined,
    };

    createStaffMember(staffData, {
      onSuccess: () => {
        // TODO: Create supervision relationship if supervisor is selected
        if (formData.supervision_type !== 'Not Supervised' && formData.supervisor_id) {
          // This would need to be implemented to create the supervision relationship
          console.log('Supervision relationship would be created:', {
            supervisor_id: formData.supervisor_id,
            supervision_type: formData.supervision_type
          });
        }
        navigate('/staff');
      }
    });
  };

  const handleCancel = () => {
    navigate('/staff');
  };

  return {
    handleSubmit,
    handleCancel,
    isCreatingStaff
  };
};
