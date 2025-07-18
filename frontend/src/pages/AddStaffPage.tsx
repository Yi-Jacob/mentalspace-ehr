
import React from 'react';
import { useAddStaffForm } from '@/hooks/useAddStaffForm';
import { useAddStaffSubmit } from '@/hooks/useAddStaffSubmit';
import AddStaffPageHeader from '@/components/staff/forms/AddStaffPageHeader';
import UserCommentsSection from '@/components/staff/forms/UserCommentsSection';
import RolesSection from '@/components/staff/forms/RolesSection';
import UserInformationSection from '@/components/staff/forms/UserInformationSection';
import SupervisionSection from '@/components/staff/forms/SupervisionSection';
import LicensesSection from '@/components/staff/forms/LicensesSection';
import AddStaffFormActions from '@/components/staff/forms/AddStaffFormActions';

const AddStaffPage: React.FC = () => {
  const { formData, handleInputChange, handleRoleToggle } = useAddStaffForm();
  const { handleSubmit, handleCancel, isCreatingStaff } = useAddStaffSubmit();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <AddStaffPageHeader onCancel={handleCancel} />

        <form onSubmit={(e) => handleSubmit(e, formData)} className="space-y-8">
          <UserCommentsSection 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <RolesSection 
            formData={formData} 
            onRoleToggle={handleRoleToggle} 
          />

          <UserInformationSection 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <SupervisionSection 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <LicensesSection 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          <AddStaffFormActions 
            isCreatingStaff={isCreatingStaff}
            onCancel={handleCancel}
          />
        </form>
      </div>
    </div>
  );
};

export default AddStaffPage;
