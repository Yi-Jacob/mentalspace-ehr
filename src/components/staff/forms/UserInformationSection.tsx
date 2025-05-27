
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserInformationSectionProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const UserInformationSection: React.FC<UserInformationSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
        <CardTitle className="text-xl font-semibold text-gray-800">User Information</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Complete the user's personal and professional details
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
              Basic Information
            </h3>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                First Name: <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.first_name}
                onChange={(e) => onInputChange('first_name', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400"
                placeholder="Enter first name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Middle Name:</Label>
              <Input
                value={formData.middle_name}
                onChange={(e) => onInputChange('middle_name', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400"
                placeholder="Enter middle name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Last Name: <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.last_name}
                onChange={(e) => onInputChange('last_name', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400"
                placeholder="Enter last name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Suffix:</Label>
              <Input
                value={formData.suffix}
                onChange={(e) => onInputChange('suffix', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400"
                placeholder="Jr., Sr., III, etc."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Email: <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400"
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Username:</Label>
              <Input
                value={formData.user_name}
                onChange={(e) => onInputChange('user_name', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400"
                placeholder="Enter username"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
              Contact Information
            </h3>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Mobile Phone:</Label>
              <Input
                value={formData.mobile_phone}
                onChange={(e) => onInputChange('mobile_phone', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400"
                placeholder="Enter mobile phone"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Work Phone:</Label>
              <Input
                value={formData.work_phone}
                onChange={(e) => onInputChange('work_phone', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400"
                placeholder="Enter work phone"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Home Phone:</Label>
              <Input
                value={formData.home_phone}
                onChange={(e) => onInputChange('home_phone', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400"
                placeholder="Enter home phone"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="can_receive_text"
                checked={formData.can_receive_text}
                onCheckedChange={(checked) => onInputChange('can_receive_text', checked)}
              />
              <Label htmlFor="can_receive_text" className="text-sm font-medium text-gray-700">
                Can receive text messages
              </Label>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
              Address Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Address Line 1:</Label>
                <Input
                  value={formData.address_1}
                  onChange={(e) => onInputChange('address_1', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400"
                  placeholder="Enter address"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Address Line 2:</Label>
                <Input
                  value={formData.address_2}
                  onChange={(e) => onInputChange('address_2', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400"
                  placeholder="Apartment, suite, etc."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">City:</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => onInputChange('city', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400"
                  placeholder="Enter city"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">State:</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => onInputChange('state', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400"
                  placeholder="Enter state"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">ZIP Code:</Label>
                <Input
                  value={formData.zip_code}
                  onChange={(e) => onInputChange('zip_code', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400"
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
              Professional Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Employee ID:</Label>
                <Input
                  value={formData.employee_id}
                  onChange={(e) => onInputChange('employee_id', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400"
                  placeholder="Enter employee ID"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Job Title:</Label>
                <Input
                  value={formData.job_title}
                  onChange={(e) => onInputChange('job_title', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400"
                  placeholder="Enter job title"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Formal Name:</Label>
                <Input
                  value={formData.formal_name}
                  onChange={(e) => onInputChange('formal_name', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400"
                  placeholder="Dr. John Smith, LCSW"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">NPI Number:</Label>
                <Input
                  value={formData.npi_number}
                  onChange={(e) => onInputChange('npi_number', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400"
                  placeholder="Enter NPI number"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Department:</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => onInputChange('department', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400"
                  placeholder="Enter department"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Phone Number:</Label>
                <Input
                  value={formData.phone_number}
                  onChange={(e) => onInputChange('phone_number', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Hire Date:</Label>
                <Input
                  type="date"
                  value={formData.hire_date}
                  onChange={(e) => onInputChange('hire_date', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Billing Rate:</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.billing_rate}
                  onChange={(e) => onInputChange('billing_rate', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400"
                  placeholder="Enter billing rate"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Status:</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => onInputChange('status', value)}
                >
                  <SelectTrigger className="bg-white border-gray-200 focus:border-blue-400">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 shadow-lg">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="can_bill_insurance"
                checked={formData.can_bill_insurance}
                onCheckedChange={(checked) => onInputChange('can_bill_insurance', checked)}
              />
              <Label htmlFor="can_bill_insurance" className="text-sm font-medium text-gray-700">
                Can bill insurance
              </Label>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Notes:</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => onInputChange('notes', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors min-h-[100px]"
                placeholder="Enter any additional notes about this staff member"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInformationSection;
