import React from 'react';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddStaffForm } from '@/hooks/useAddStaffForm';
import { useAddStaffSubmit } from '@/hooks/useAddStaffSubmit';
import PageLayout from '@/components/ui/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import UserCommentsSection from './components/UserCommentsSection';
import RolesSection from './components/RolesSection';
import UserInformationSection from './components/UserInformationSection';
import SupervisionSection from './components/SupervisionSection';
import LicensesSection from './components/LicensesSection';
import AddStaffFormActions from './components/AddStaffFormActions';

const CreateStaffPage: React.FC = () => {
  const { formData, handleInputChange, handleRoleToggle } = useAddStaffForm();
  const { handleSubmit, handleCancel, isCreatingStaff } = useAddStaffSubmit();

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={UserPlus}
        title="Add New Staff Member"
        description="Create a new staff member record"

        action={
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Staff
          </Button>
        }
      />

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
    </PageLayout>
  );
};

export default CreateStaffPage; 