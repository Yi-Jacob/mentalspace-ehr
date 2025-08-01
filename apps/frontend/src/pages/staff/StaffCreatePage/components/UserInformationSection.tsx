
import React from 'react';
import { InputField } from '@/components/basic/input';
import { TextareaField } from '@/components/basic/textarea';
import { SelectField } from '@/components/basic/select';
import { DateInput } from '@/components/basic/date-input';
import CategorySection from '@/components/basic/CategorySection';
import CheckboxGroup from '@/components/basic/CheckboxGroup';
import { US_STATES_OPTIONS } from '@/types/enums/clientEnum';
import { 
  USER_STATUS_OPTIONS, 
  DEPARTMENT_OPTIONS, 
  JOB_TITLE_OPTIONS,
  COMMUNICATION_PREFERENCE_OPTIONS,
  BILLING_SETTINGS_OPTIONS
} from '@/types/enums/staffEnum';

interface UserInformationSectionProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const UserInformationSection: React.FC<UserInformationSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <CategorySection
      title="User Information"
      description="Complete the user's personal and professional details"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
            Basic Information
          </h3>
          
          <InputField
            id="first_name"
            label="First Name"
            value={formData.first_name}
            onChange={(e) => onInputChange('first_name', e.target.value)}
            required
            placeholder="Enter first name"
          />

          <InputField
            id="middle_name"
            label="Middle Name"
            value={formData.middle_name}
            onChange={(e) => onInputChange('middle_name', e.target.value)}
            placeholder="Enter middle name"
          />

          <InputField
            id="last_name"
            label="Last Name"
            value={formData.last_name}
            onChange={(e) => onInputChange('last_name', e.target.value)}
            required
            placeholder="Enter last name"
          />

          <InputField
            id="suffix"
            label="Suffix"
            value={formData.suffix}
            onChange={(e) => onInputChange('suffix', e.target.value)}
            placeholder="Jr., Sr., III, etc."
          />

          <InputField
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            required
            placeholder="Enter email address"
          />

          <InputField
            id="user_name"
            label="Username"
            value={formData.user_name}
            onChange={(e) => onInputChange('user_name', e.target.value)}
            placeholder="Enter username"
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
            Contact Information
          </h3>

          <InputField
            id="mobile_phone"
            label="Mobile Phone"
            value={formData.mobile_phone}
            onChange={(e) => onInputChange('mobile_phone', e.target.value)}
            placeholder="Enter mobile phone"
          />

          <InputField
            id="work_phone"
            label="Work Phone"
            value={formData.work_phone}
            onChange={(e) => onInputChange('work_phone', e.target.value)}
            placeholder="Enter work phone"
          />

          <InputField
            id="home_phone"
            label="Home Phone"
            value={formData.home_phone}
            onChange={(e) => onInputChange('home_phone', e.target.value)}
            placeholder="Enter home phone"
          />

          {/* Using CheckboxGroup for communication preferences */}
          <CheckboxGroup
            title="Communication Preferences"
            items={COMMUNICATION_PREFERENCE_OPTIONS}
            checkedItems={formData.can_receive_text ? ['can_receive_text'] : []}
            onToggle={(id) => onInputChange('can_receive_text', id === 'can_receive_text')}
            showDescriptions={true}
            className="mt-4"
          />
        </div>

        {/* Address Information */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
            Address Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="address_1"
              label="Address Line 1"
              value={formData.address_1}
              onChange={(e) => onInputChange('address_1', e.target.value)}
              placeholder="Enter address"
            />

            <InputField
              id="address_2"
              label="Address Line 2"
              value={formData.address_2}
              onChange={(e) => onInputChange('address_2', e.target.value)}
              placeholder="Apartment, suite, etc."
            />

            <InputField
              id="city"
              label="City"
              value={formData.city}
              onChange={(e) => onInputChange('city', e.target.value)}
              placeholder="Enter city"
            />

            <SelectField
              label="State"
              value={formData.state}
              onValueChange={(value) => onInputChange('state', value)}
              placeholder="Select state"
              options={US_STATES_OPTIONS}
            />

            <InputField
              id="zip_code"
              label="ZIP Code"
              value={formData.zip_code}
              onChange={(e) => onInputChange('zip_code', e.target.value)}
              placeholder="Enter ZIP code"
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
            Professional Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputField
              id="employee_id"
              label="Employee ID"
              value={formData.employee_id}
              onChange={(e) => onInputChange('employee_id', e.target.value)}
              placeholder="Enter employee ID"
            />

            <SelectField
              label="Job Title"
              value={formData.job_title}
              onValueChange={(value) => onInputChange('job_title', value)}
              placeholder="Select job title"
              options={JOB_TITLE_OPTIONS}
            />

            <InputField
              id="formal_name"
              label="Formal Name"
              value={formData.formal_name}
              onChange={(e) => onInputChange('formal_name', e.target.value)}
              placeholder="Dr. John Smith, LCSW"
            />

            <InputField
              id="npi_number"
              label="NPI Number"
              value={formData.npi_number}
              onChange={(e) => onInputChange('npi_number', e.target.value)}
              placeholder="Enter NPI number"
            />

            <SelectField
              label="Department"
              value={formData.department}
              onValueChange={(value) => onInputChange('department', value)}
              placeholder="Select department"
              options={DEPARTMENT_OPTIONS}
            />

            <InputField
              id="phone_number"
              label="Phone Number"
              value={formData.phone_number}
              onChange={(e) => onInputChange('phone_number', e.target.value)}
              placeholder="Enter phone number"
            />

            <DateInput
              id="hire_date"
              label="Hire Date"
              value={formData.hire_date}
              onChange={(value) => onInputChange('hire_date', value)}
            />

            <InputField
              id="billing_rate"
              label="Billing Rate"
              type="number"
              step="0.01"
              value={formData.billing_rate}
              onChange={(e) => onInputChange('billing_rate', e.target.value)}
              placeholder="Enter billing rate"
            />

            <SelectField
              label="Status"
              value={formData.status}
              onValueChange={(value) => onInputChange('status', value)}
              placeholder="Select status"
              options={USER_STATUS_OPTIONS}
            />
          </div>

          {/* Using CheckboxGroup for billing settings */}
          <CheckboxGroup
            title="Billing Settings"
            items={BILLING_SETTINGS_OPTIONS}
            checkedItems={formData.can_bill_insurance ? ['can_bill_insurance'] : []}
            onToggle={(id) => onInputChange('can_bill_insurance', id === 'can_bill_insurance')}
            showDescriptions={true}
            className="mt-4"
          />

          <TextareaField
            id="notes"
            label="Notes"
            value={formData.notes}
            onChange={(e) => onInputChange('notes', e.target.value)}
            placeholder="Enter any additional notes about this staff member"
            rows={3}
          />
        </div>
      </div>
    </CategorySection>
  );
};

export default UserInformationSection;
