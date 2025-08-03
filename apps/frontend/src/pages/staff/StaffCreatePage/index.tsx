import React, { useState } from 'react';
import { UserPlus, ArrowLeft, Save, MessageSquare, Shield, User, Users, FileText } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { useAddStaffForm } from '@/pages/staff/hook/useAddStaffForm';
import { useAddStaffSubmit } from '@/pages/staff/hook/useAddStaffSubmit';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import PageTabs from '@/components/basic/PageTabs';
import UserCommentsSection from '@/pages/staff/components/formSections/UserCommentsSection';
import RolesSection from '@/pages/staff/components/formSections/RolesSection';
import UserInformationSection from '@/pages/staff/components/formSections/UserInformationSection';
import SupervisionSection from '@/pages/staff/components/formSections/SupervisionSection';
import LicensesSection from '@/pages/staff/components/formSections/LicensesSection';

const CreateStaffPage: React.FC = () => {
  const { formData, handleInputChange, handleRoleToggle, resetForm } = useAddStaffForm();
  const { handleSubmit, handleCancel, isCreatingStaff } = useAddStaffSubmit();
  const [currentTab, setCurrentTab] = useState('comments');

  const tabs = [
    {
      id: 'information',
      label: 'Information',
      icon: User,
      content: (
        <UserInformationSection 
          formData={formData} 
          onInputChange={handleInputChange} 
        />
      )
    },
    {
      id: 'comments',
      label: 'Comments',
      icon: MessageSquare,
      content: (
        <UserCommentsSection 
          formData={formData} 
          onInputChange={handleInputChange} 
        />
      )
    },
    {
      id: 'roles',
      label: 'Roles',
      icon: Shield,
      content: (
        <RolesSection 
          formData={formData} 
          onRoleToggle={handleRoleToggle} 
        />
      )
    },
    {
      id: 'supervision',
      label: 'Supervision',
      icon: Users,
      content: (
        <SupervisionSection 
          formData={formData} 
          onInputChange={handleInputChange} 
        />
      )
    },
    {
      id: 'licenses',
      label: 'Licenses',
      icon: FileText,
      content: (
        <LicensesSection 
          formData={formData} 
          onInputChange={handleInputChange} 
        />
      )
    }
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === currentTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const handleNext = () => {
    if (!isLastTab) {
      const nextTab = tabs[currentTabIndex + 1];
      setCurrentTab(nextTab.id);
    }
  };

  const handlePrevious = () => {
    if (!isFirstTab) {
      const prevTab = tabs[currentTabIndex - 1];
      setCurrentTab(prevTab.id);
    }
  };

  const handleSave = (createAnother: boolean = false) => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent, formData);
    
    // If creating another, reset form after successful creation
    if (createAnother) {
      resetForm();
      setCurrentTab('comments'); // Reset to first tab
    }
  };

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={UserPlus}
        title="Add New Staff Member"
        description="Create a new staff member record"
        action={
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleCancel} 
              disabled={isCreatingStaff}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(true)}
              variant="outline"
              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
              disabled={isCreatingStaff}
            >
              Save and Create Another
            </Button>
            <Button 
              onClick={() => handleSave(false)} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isCreatingStaff}
            >
              {isCreatingStaff ? 'Saving...' : 'Save New Staff Member'}
            </Button>
          </div>
        }
      />

      <form className="space-y-8">
        <PageTabs
          items={tabs}
          value={currentTab}
          onValueChange={setCurrentTab}
          showNavigation={true}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={!isLastTab}
          canGoPrevious={!isFirstTab}
        />
      </form>
    </PageLayout>
  );
};

export default CreateStaffPage; 