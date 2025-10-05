
import { useNavigate } from 'react-router-dom';
import { useStaffManagement } from '@/pages/staff/hook/useStaffManagement';
import { UserStatus } from '@/types/staffType';
import { toast } from '@/hooks/use-toast';

export const useAddStaffSubmit = () => {
  const navigate = useNavigate();
  const { createStaffMember, isCreating } = useStaffManagement();

  const handleSubmit = async (e: React.FormEvent, formData: any) => {
    e.preventDefault();
    
    // Validate required fields
    const validationErrors: string[] = [];
    
    if (!formData.firstName?.trim()) {
      validationErrors.push('First name is required');
    }
    
    if (!formData.lastName?.trim()) {
      validationErrors.push('Last name is required');
    }
    
    if (!formData.email?.trim()) {
      validationErrors.push('Email address is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.push('Please enter a valid email address');
    }
    
    if (!formData.roles || formData.roles.length === 0) {
      validationErrors.push('At least one role must be selected');
    }
    
    if (validationErrors.length > 0) {
      toast({
        title: 'Validation Error',
        description: validationErrors.join('. ') + '.',
        variant: 'destructive',
      });
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
      hireDate: formatDateToISO(formData.hireDate),
      billingRate: formData.billingRate ? parseFloat(formData.billingRate) : undefined,
      canBillInsurance: formData.canBillInsurance,
      status: formData.status as UserStatus || 'active',
      notes: formData.notes,
      licenses: formData.licenses,

      // Additional fields
      clinicianType: formData.clinicianType,

      // Roles
      roles: formData.roles || [],

      // User comments
      userComments: formData.userComments
    };

    try {
      const result = await createStaffMember(staffData);
      return result;
    } catch (error) {
      console.error('Error creating staff member:', error);
      throw error;
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
