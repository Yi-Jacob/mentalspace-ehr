
import { useState } from 'react';
import { UserRole, UserStatus } from '@/types/staffType';

export const useAddStaffForm = () => {
  const initialFormData = {
    // User Information
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    email: '',
    user_name: '',
    mobile_phone: '',
    work_phone: '',
    home_phone: '',
    can_receive_text: false,
    address_1: '',
    address_2: '',
    city: '',
    state: '',
    zip_code: '',
    
    // Staff Profile
    employee_id: '',
    job_title: '',
    formal_name: '',
    npi_number: '',
    department: '',
    phone_number: '',
    license_number: '',
    license_state: '',
    license_expiry_date: '',
    hire_date: '',
    billing_rate: '',
    can_bill_insurance: false,
    status: 'active' as UserStatus,
    notes: '',
    
    // Additional fields
    clinician_type: '',
    supervision_type: 'Not Supervised',
    supervisor_id: '',
    
    // Roles
    roles: [] as UserRole[],
    
    // User Comments
    user_comments: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleToggle = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    handleInputChange,
    handleRoleToggle,
    resetForm
  };
};
