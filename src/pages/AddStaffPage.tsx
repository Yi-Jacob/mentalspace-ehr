
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus } from 'lucide-react';
import { UserRole, UserStatus } from '@/types/staff';
import { useStaffManagement } from '@/hooks/useStaffManagement';

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Staff: Add a New User</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Comments */}
          <Card>
            <CardHeader>
              <CardTitle>User Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="user_comments" className="text-sm text-gray-600">
                  For info such as scheduling/billing comments. All users can see this. Conveniently visible in tooltips.
                </Label>
                <Textarea
                  id="user_comments"
                  value={formData.user_comments}
                  onChange={(e) => handleInputChange('user_comments', e.target.value)}
                  placeholder="For info such as scheduling/billing comments. All users can see this. Conveniently visible in tooltips."
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Roles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Roles
                <Button type="button" variant="outline" size="sm">
                  Show Instructions
                </Button>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Each user can have multiple roles. A user's roles determine what they can access within TherapyNotes.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Practice Administration */}
                <div>
                  <h3 className="font-semibold mb-3">Practice Administration</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="practice_administrator"
                        checked={formData.roles.includes('Practice Administrator')}
                        onCheckedChange={() => handleRoleToggle('Practice Administrator')}
                      />
                      <Label htmlFor="practice_administrator">Practice Administrator</Label>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">
                      A TherapyNotes Practice Administrator can add and edit TherapyNotes users, change user roles, reset passwords, and set account access settings.
                    </p>
                  </div>
                </div>

                {/* Scheduling Access */}
                <div>
                  <h3 className="font-semibold mb-3">Scheduling Access</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="practice_scheduler"
                        checked={formData.roles.includes('Practice Scheduler')}
                        onCheckedChange={() => handleRoleToggle('Practice Scheduler')}
                      />
                      <Label htmlFor="practice_scheduler">Practice Scheduler</Label>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">
                      A Scheduler can schedule, reschedule, and cancel appointments for any clinician. They can add, edit, or remove new patients.
                    </p>
                  </div>
                </div>

                {/* Clinical Access */}
                <div>
                  <h3 className="font-semibold mb-3">Clinical Access</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="clinician"
                          checked={formData.roles.includes('Clinician')}
                          onCheckedChange={() => handleRoleToggle('Clinician')}
                        />
                        <Label htmlFor="clinician">Clinician</Label>
                      </div>
                      <p className="text-xs text-gray-600 ml-6">
                        Clinicians provide services to a client. They can view and edit their own schedule, complete notes and manage records of patients assigned to them.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="intern"
                          checked={formData.roles.includes('Intern')}
                          onCheckedChange={() => handleRoleToggle('Intern')}
                        />
                        <Label htmlFor="intern">Intern / Assistant / Associate</Label>
                      </div>
                      <p className="text-xs text-gray-600 ml-6">
                        The Intern role is similar to a Clinician but with limitations. Interns do not have an NPI and can only bill to insurance under a Supervisor's credentials.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="supervisor"
                          checked={formData.roles.includes('Supervisor')}
                          onCheckedChange={() => handleRoleToggle('Supervisor')}
                        />
                        <Label htmlFor="supervisor">Supervisor</Label>
                      </div>
                      <p className="text-xs text-gray-600 ml-6">
                        A Supervisor can be assigned to individual clinicians and interns, granting full access to their supervisees' patient's notes.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="clinical_administrator"
                          checked={formData.roles.includes('Clinical Administrator')}
                          onCheckedChange={() => handleRoleToggle('Clinical Administrator')}
                        />
                        <Label htmlFor="clinical_administrator">Clinical Administrator</Label>
                      </div>
                      <p className="text-xs text-gray-600 ml-6">
                        A Clinical Administrator must also have the Clinician role. They can access any patient's records and can give other clinicians access to any patient records.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Billing Access */}
                <div>
                  <h3 className="font-semibold mb-3">Billing Access</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="biller_assigned"
                          checked={formData.roles.includes('Biller for Assigned Patients Only')}
                          onCheckedChange={() => handleRoleToggle('Biller for Assigned Patients Only')}
                        />
                        <Label htmlFor="biller_assigned">Biller for Assigned Patients Only</Label>
                      </div>
                      <p className="text-xs text-gray-600 ml-6">
                        Clinicians with this role can collect and enter copay information, including by processing patient credit cards.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="practice_biller"
                          checked={formData.roles.includes('Practice Biller')}
                          onCheckedChange={() => handleRoleToggle('Practice Biller')}
                        />
                        <Label htmlFor="practice_biller">Practice Biller</Label>
                      </div>
                      <p className="text-xs text-gray-600 ml-6">
                        A Practice Biller has full billing access to all patients in the practice. They can verify patient insurance, generate and track claims, enter patient and insurance payments, and run billing reports.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Name: *</Label>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                      <Input
                        placeholder="first"
                        value={formData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        required
                      />
                      <Input
                        placeholder="middle"
                        value={formData.middle_name}
                        onChange={(e) => handleInputChange('middle_name', e.target.value)}
                      />
                      <Input
                        placeholder="last"
                        value={formData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        required
                      />
                      <Input
                        placeholder="suffix"
                        value={formData.suffix}
                        onChange={(e) => handleInputChange('suffix', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="user_name">User Name:</Label>
                    <Input
                      id="user_name"
                      value={formData.user_name}
                      onChange={(e) => handleInputChange('user_name', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="formal_name">Formal Name:</Label>
                    <Input
                      id="formal_name"
                      placeholder='Example: "John Smith, Ph.D."'
                      value={formData.formal_name}
                      onChange={(e) => handleInputChange('formal_name', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="job_title">Title:</Label>
                    <Input
                      id="job_title"
                      placeholder="Example: Licensed Clinical Psychologist"
                      value={formData.job_title}
                      onChange={(e) => handleInputChange('job_title', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="npi_number">NPI:</Label>
                    <Input
                      id="npi_number"
                      placeholder="Individual NPI - Type 1"
                      value={formData.npi_number}
                      onChange={(e) => handleInputChange('npi_number', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email: *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobile_phone">Mobile Phone:</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="mobile_phone"
                        value={formData.mobile_phone}
                        onChange={(e) => handleInputChange('mobile_phone', e.target.value)}
                      />
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="can_receive_text"
                          checked={formData.can_receive_text}
                          onCheckedChange={(checked) => handleInputChange('can_receive_text', checked)}
                        />
                        <Label htmlFor="can_receive_text" className="text-sm">Can receive text messages</Label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="work_phone">Work Phone:</Label>
                    <Input
                      id="work_phone"
                      value={formData.work_phone}
                      onChange={(e) => handleInputChange('work_phone', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="home_phone">Home Phone:</Label>
                    <Input
                      id="home_phone"
                      value={formData.home_phone}
                      onChange={(e) => handleInputChange('home_phone', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="employee_id">Employee ID:</Label>
                    <Input
                      id="employee_id"
                      value={formData.employee_id}
                      onChange={(e) => handleInputChange('employee_id', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="department">Department:</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Licenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Licenses
                <Button type="button" variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New License
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>State / Number:</Label>
                  <div className="flex gap-2 mt-1">
                    <Select value={formData.license_state} onValueChange={(value) => handleInputChange('license_state', value)}>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="--" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AL">AL</SelectItem>
                        <SelectItem value="CA">CA</SelectItem>
                        <SelectItem value="FL">FL</SelectItem>
                        <SelectItem value="NY">NY</SelectItem>
                        <SelectItem value="TX">TX</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={formData.license_number}
                      onChange={(e) => handleInputChange('license_number', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Taxonomy:</Label>
                  <Input
                    placeholder="search for code or description"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="license_expiry">Expiration:</Label>
                  <Input
                    id="license_expiry"
                    type="date"
                    value={formData.license_expiry_date}
                    onChange={(e) => handleInputChange('license_expiry_date', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-start space-x-4 pt-4">
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={isCreatingStaff}
            >
              {isCreatingStaff ? 'Creating...' : 'Save New User'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffPage;
