
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
      console.error('Required fields missing: first_name, last_name, email');
      return;
    }

    // Validate supervision requirements
    if (formData.supervision_type !== 'Not Supervised' && !formData.supervisor_id) {
      console.error('Supervisor is required when supervision type is selected');
      return;
    }

    // Helper function to format date to ISO string
    const formatDateToISO = (dateString: string | undefined) => {
      if (!dateString) return undefined;
      try {
        const date = new Date(dateString);
        return date.toISOString();
      } catch (error) {
        console.error('Invalid date format:', dateString);
        return undefined;
      }
    };

    // Prepare comprehensive data for the backend API
    const staffData = {
      // Basic user information
      firstName: formData.first_name,
      lastName: formData.last_name,
      email: formData.email,
      middleName: formData.middle_name,
      suffix: formData.suffix,
      avatarUrl: formData.avatar_url,

      // Contact information
      userName: formData.user_name,
      mobilePhone: formData.mobile_phone,
      workPhone: formData.work_phone,
      homePhone: formData.home_phone,
      canReceiveText: formData.can_receive_text,

      // Address information
      address1: formData.address_1,
      address2: formData.address_2,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zip_code,

      // Staff profile information
      employeeId: formData.employee_id,
      jobTitle: formData.job_title,
      formalName: formData.formal_name,
      npiNumber: formData.npi_number,
      department: formData.department,
      phoneNumber: formData.phone_number,
      licenseNumber: formData.license_number,
      licenseState: formData.license_state,
      licenseExpiryDate: formatDateToISO(formData.license_expiry_date),
      hireDate: formatDateToISO(formData.hire_date),
      billingRate: formData.billing_rate ? parseFloat(formData.billing_rate) : undefined,
      canBillInsurance: formData.can_bill_insurance,
      status: formData.status as UserStatus || 'active',
      notes: formData.notes,

      // Additional fields
      clinicianType: formData.clinician_type,
      supervisionType: formData.supervision_type,
      supervisorId: formData.supervisor_id,

      // Roles
      roles: formData.roles || [],

      // User comments
      userComments: formData.user_comments
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
