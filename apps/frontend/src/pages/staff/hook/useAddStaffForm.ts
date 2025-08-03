
import { useState } from 'react';
import { UserRole, UserStatus } from '@/types/staffType';

export const useAddStaffForm = () => {
  const initialFormData = {
    // User Information
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    email: '',
    userName: '',
    mobilePhone: '',
    workPhone: '',
    homePhone: '',
    canReceiveText: false,
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Staff Profile
    employeeId: '',
    jobTitle: '',
    formalName: '',
    npiNumber: '',
    department: '',
    phoneNumber: '',
    licenseNumber: '',
    licenseState: '',
    licenseExpiryDate: '',
    hireDate: '',
    billingRate: '',
    canBillInsurance: false,
    status: 'active' as UserStatus,
    notes: '',
    
    // Additional fields
    clinicianType: '',
    supervisionType: 'Not Supervised',
    supervisorId: '',
    
    // Roles
    roles: [] as UserRole[],
    
    // User Comments
    userComments: ''
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
    resetForm,
    setFormData
  };
};
