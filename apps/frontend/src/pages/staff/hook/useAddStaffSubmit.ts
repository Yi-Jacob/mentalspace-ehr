
import { useNavigate } from 'react-router-dom';
import { useStaffManagement } from '@/pages/staff/hook/useStaffManagement';
import { UserStatus } from '@/types/staffType';

export const useAddStaffSubmit = () => {
  const navigate = useNavigate();
  const { createStaffMember, isCreating } = useStaffManagement();

  const handleSubmit = async (e: React.FormEvent, formData: any) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      console.error('Required fields missing: firstName, lastName, email');
      return;
    }

    // Validate supervision requirements
    if (formData.supervisionType !== 'Not Supervised' && !formData.supervisorId) {
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

    // Prepare data for the backend API - formData is already in camelCase
    const staffData = {
      // Basic user information
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      middleName: formData.middleName,
      suffix: formData.suffix,
      avatarUrl: formData.avatarUrl,

      // Contact information
      userName: formData.userName,
      mobilePhone: formData.mobilePhone,
      workPhone: formData.workPhone,
      homePhone: formData.homePhone,
      canReceiveText: formData.canReceiveText,

      // Address information
      address1: formData.address1,
      address2: formData.address2,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,

      // Staff profile information
      employeeId: formData.employeeId,
      jobTitle: formData.jobTitle,
      formalName: formData.formalName,
      npiNumber: formData.npiNumber,
      department: formData.department,
      phoneNumber: formData.phoneNumber,
      licenseNumber: formData.licenseNumber,
      licenseState: formData.licenseState,
      licenseExpiryDate: formatDateToISO(formData.licenseExpiryDate),
      hireDate: formatDateToISO(formData.hireDate),
      billingRate: formData.billingRate ? parseFloat(formData.billingRate) : undefined,
      canBillInsurance: formData.canBillInsurance,
      status: formData.status as UserStatus || 'active',
      notes: formData.notes,

      // Additional fields
      clinicianType: formData.clinicianType,
      supervisionType: formData.supervisionType,
      supervisorId: formData.supervisorId,

      // Roles
      roles: formData.roles || [],

      // User comments
      userComments: formData.userComments
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
