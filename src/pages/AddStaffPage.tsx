
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, X } from 'lucide-react';
import { UserRole, UserStatus } from '@/types/staff';
import { useStaffManagement } from '@/hooks/useStaffManagement';
import UserInformationSection from '@/components/staff/forms/UserInformationSection';
import RolesSection from '@/components/staff/forms/RolesSection';
import LicensesSection from '@/components/staff/forms/LicensesSection';

const AddStaffPage: React.FC = () => {
  const navigate = useNavigate();
  const { createStaffMember, isCreatingStaff } = useStaffManagement();
  
  const [formData, setFormData] = useState({
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
    
    // Roles
    roles: [] as UserRole[],
    
    // User Comments
    user_comments: ''
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.email) {
      return;
    }

    // Prepare data for the createStaffMember function
    const staffData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      roles: formData.roles,
      employee_id: formData.employee_id || undefined,
      job_title: formData.job_title || undefined,
      department: formData.department || undefined,
      phone_number: formData.phone_number || formData.mobile_phone || undefined,
      npi_number: formData.npi_number || undefined,
      license_number: formData.license_number || undefined,
      license_state: formData.license_state || undefined,
      license_expiry_date: formData.license_expiry_date || undefined,
      hire_date: formData.hire_date || undefined,
      billing_rate: formData.billing_rate ? parseFloat(formData.billing_rate) : undefined,
      can_bill_insurance: formData.can_bill_insurance,
      status: formData.status,
      notes: formData.notes || undefined,
    };

    createStaffMember(staffData, {
      onSuccess: () => {
        navigate('/staff');
      }
    });
  };

  const handleCancel = () => {
    navigate('/staff');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Modern Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="p-3 hover:bg-white/80 rounded-xl transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
                Add New Team Member
              </h1>
              <p className="text-gray-600 mt-1">Create a new user account and configure their access</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* User Comments */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg">
              <CardTitle className="text-xl font-semibold text-gray-800">User Comments</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                For info such as scheduling/billing comments. All users can see this. Conveniently visible in tooltips.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <Textarea
                value={formData.user_comments}
                onChange={(e) => handleInputChange('user_comments', e.target.value)}
                placeholder="For info such as scheduling/billing comments. All users can see this. Conveniently visible in tooltips."
                className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* Roles Section */}
          <RolesSection 
            formData={formData} 
            onRoleToggle={handleRoleToggle} 
          />

          {/* User Information Section */}
          <UserInformationSection 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          {/* Licenses Section */}
          <LicensesSection 
            formData={formData} 
            onInputChange={handleInputChange} 
          />

          {/* Action Buttons */}
          <div className="flex justify-start space-x-4 pt-6">
            <Button 
              type="submit" 
              disabled={isCreatingStaff}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3"
              size="lg"
            >
              {isCreatingStaff ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save New User
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50 transition-all duration-300 px-8 py-3"
              size="lg"
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffPage;
