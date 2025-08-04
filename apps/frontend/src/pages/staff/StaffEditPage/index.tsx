import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, MessageSquare, Shield, User, Users, FileText, Edit } from 'lucide-react';
import { Button } from '@/components/basic/button';
import { useParams, useNavigate } from 'react-router-dom';
import { useStaffManagement } from '@/pages/staff/hook/useStaffManagement';
import { useAddStaffForm } from '@/pages/staff/hook/useAddStaffForm';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import PageTabs from '@/components/basic/PageTabs';
import UserCommentsSection from '@/pages/staff/components/formSections/UserCommentsSection';
import RolesSection from '@/pages/staff/components/formSections/RolesSection';
import UserInformationSection from '@/pages/staff/components/formSections/UserInformationSection';

import LicensesSection from '@/pages/staff/components/formSections/LicensesSection';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { USER_ROLE_OPTIONS, UserRole } from '@/types/enums/staffEnum'; 

const StaffEditPage: React.FC = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getStaff, updateStaffMember, isUpdating } = useStaffManagement();
  const { formData, handleInputChange, handleRoleToggle, handleLicensesChange, resetForm, setFormData } = useAddStaffForm();
  const [currentTab, setCurrentTab] = useState('information');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffData = async () => {
      if (!staffId) return;
      
      try {
        const staff = await getStaff(staffId);
        
        // Transform the staff data to match form structure
        const transformedData = {
          // User Information
          firstName: staff.firstName || '',
          middleName: staff.middleName || '',
          lastName: staff.lastName || '',
          suffix: staff.suffix || '',
          email: staff.email || '',
          userName: staff.userName || '',
          mobilePhone: staff.mobilePhone || '',
          workPhone: staff.workPhone || '',
          homePhone: staff.homePhone || '',
          canReceiveText: staff.canReceiveText || false,
          address1: staff.address1 || '',
          address2: staff.address2 || '',
          city: staff.city || '',
          state: staff.state || '',
          zipCode: staff.zipCode || '',
          
          // Staff Profile
          employeeId: staff.employeeId || '',
          jobTitle: staff.jobTitle || '',
          formalName: staff.formalName || '',
          npiNumber: staff.npiNumber || '',
          department: staff.department || '',
          phoneNumber: staff.phoneNumber || '',
          hireDate: staff.hireDate || '',
          billingRate: staff.billingRate?.toString() || '',
          canBillInsurance: staff.canBillInsurance || false,
          status: staff.status || 'active',
          notes: staff.notes || '',
          
          // Additional fields
          clinicianType: staff.clinicianType || '',
          
          // Roles
          roles: staff.roles || [],
          
          // User Comments
          userComments: staff.userComments || '',
          
          // Licenses
          licenses: staff.licenses || []
        };
        
        setFormData(transformedData);
      } catch (error) {
        console.error('Error fetching staff data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load staff data',
          variant: 'destructive',
        });
        navigate('/staff');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, [staffId, setFormData, navigate, toast]);

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
      id: 'licenses',
      label: 'Licenses',
      icon: FileText,
      content: (
        <LicensesSection 
          formData={formData} 
          onInputChange={handleInputChange}
          onLicensesChange={handleLicensesChange}
        />
      )
    }
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === currentTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const handleNext = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!isLastTab) {
      const nextTab = tabs[currentTabIndex + 1];
      setCurrentTab(nextTab.id);
    }
  };

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (!isFirstTab) {
      const prevTab = tabs[currentTabIndex - 1];
      setCurrentTab(prevTab.id);
    }
  };

  const handleSave = async () => {
    if (!staffId) return;

    try {
      // Transform form data to match API expectations
      const updateData = {
        // Basic user information
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        middleName: formData.middleName,
        suffix: formData.suffix,
        // avatarUrl: formData.avatarUrl,

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
        hireDate: formData.hireDate,
        billingRate: formData.billingRate ? parseFloat(formData.billingRate) : undefined,
        canBillInsurance: formData.canBillInsurance,
        status: formData.status,
        notes: formData.notes,

        // Additional fields
        clinicianType: formData.clinicianType,

        // Roles
        roles: formData.roles,

        // User comments
        userComments: formData.userComments,
        
        // Licenses
        licenses: formData.licenses
      };

      // Update staff member with proper roles
      await updateStaffMember(staffId, updateData);

      toast({
        title: 'Success',
        description: 'Staff member updated successfully',
      });
      
      // navigate(`/staff/${staffId}`);
    } catch (error) {
      console.error('Error updating staff member:', error);
      toast({
        title: 'Error',
        description: 'Failed to update staff member',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    navigate(`/staff/${staffId}`);
  };

  if (loading) {
    return <LoadingSpinner message="Loading staff data..." />;
  }

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Edit}
        title="Edit Staff Member"
        description="Update staff member information"
        action={
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handleCancel} 
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        }
      />

      <div className="space-y-8">
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
      </div>
    </PageLayout>
  );
};

export default StaffEditPage; 