
import { useNavigate } from 'react-router-dom';
import { useStaffManagement } from '@/hooks/useStaffManagement';
import { UserStatus } from '@/types/staff';

export const useAddStaffSubmit = () => {
  const navigate = useNavigate();
  const { createStaffMember, isCreating } = useStaffManagement();

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
      avatar_url: formData.avatar_url || undefined,
    };

    try {
      await createStaffMember(staffData);
      console.log('Staff member created successfully');
      navigate('/staff');
    } catch (error) {
      console.error('Error creating staff member:', error);
    }
  };

  const handleCancel = () => {
    navigate('/staff');
  };

  return {
    handleSubmit,
    handleCancel,
    isCreatingStaff: isCreating
  };
};
