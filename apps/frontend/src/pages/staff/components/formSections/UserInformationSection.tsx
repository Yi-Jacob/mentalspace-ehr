
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
            id="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            required
            placeholder="Enter first name"
          />

          <InputField
            id="middleName"
            label="Middle Name"
            value={formData.middleName}
            onChange={(e) => onInputChange('middleName', e.target.value)}
            placeholder="Enter middle name"
          />

          <InputField
            id="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => onInputChange('lastName', e.target.value)}
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
            id="userName"
            label="Username"
            value={formData.userName}
            onChange={(e) => onInputChange('userName', e.target.value)}
            placeholder="Enter username"
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
            Contact Information
          </h3>

          <InputField
            id="mobilePhone"
            label="Mobile Phone"
            value={formData.mobilePhone}
            onChange={(e) => onInputChange('mobilePhone', e.target.value)}
            placeholder="Enter mobile phone number"
          />

          <InputField
            id="workPhone"
            label="Work Phone"
            value={formData.workPhone}
            onChange={(e) => onInputChange('workPhone', e.target.value)}
            placeholder="Enter work phone number"
          />

          <InputField
            id="homePhone"
            label="Home Phone"
            value={formData.homePhone}
            onChange={(e) => onInputChange('homePhone', e.target.value)}
            placeholder="Enter home phone number"
          />

          <CheckboxGroup
            title="Communication Preferences"
            items={COMMUNICATION_PREFERENCE_OPTIONS}
            checkedItems={formData.canReceiveText ? ['can_receive_text'] : []}
            onToggle={(id) => onInputChange('canReceiveText', id === 'can_receive_text')}
            showDescriptions={true}
            className="mt-4"
          />
        </div>
      </div>

      {/* Address Information */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Address Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            id="address1"
            label="Address Line 1"
            value={formData.address1}
            onChange={(e) => onInputChange('address1', e.target.value)}
            placeholder="Enter street address"
          />

          <InputField
            id="address2"
            label="Address Line 2"
            value={formData.address2}
            onChange={(e) => onInputChange('address2', e.target.value)}
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
            id="zipCode"
            label="ZIP Code"
            value={formData.zipCode}
            onChange={(e) => onInputChange('zipCode', e.target.value)}
            placeholder="Enter ZIP code"
          />
        </div>
      </div>

      {/* Professional Information */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 mb-4">
          Professional Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            id="employeeId"
            label="Employee ID"
            value={formData.employeeId}
            onChange={(e) => onInputChange('employeeId', e.target.value)}
            placeholder="Enter employee ID"
          />

          <InputField
            id="formalName"
            label="Formal Name"
            value={formData.formalName}
            onChange={(e) => onInputChange('formalName', e.target.value)}
            placeholder="Dr. John Smith"
          />

          <SelectField
            label="Department"
            value={formData.department}
            onValueChange={(value) => onInputChange('department', value)}
            options={DEPARTMENT_OPTIONS}
            placeholder="Select department"
          />

          <SelectField
            label="Job Title"
            value={formData.jobTitle}
            onValueChange={(value) => onInputChange('jobTitle', value)}
            options={JOB_TITLE_OPTIONS}
            placeholder="Select job title"
          />

          <InputField
            id="phoneNumber"
            label="Work Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            placeholder="Enter work phone number"
          />

          <InputField
            id="billingRate"
            label="Billing Rate"
            type="number"
            value={formData.billingRate}
            onChange={(e) => onInputChange('billingRate', e.target.value)}
            placeholder="Enter billing rate"
          />

          <SelectField
            label="Status"
            value={formData.status}
            onValueChange={(value) => onInputChange('status', value)}
            options={USER_STATUS_OPTIONS}
            placeholder="Select status"
          />

          <CheckboxGroup
            title="Billing Settings"
            items={BILLING_SETTINGS_OPTIONS}
            checkedItems={formData.canBillInsurance ? ['can_bill_insurance'] : []}
            onToggle={(id) => onInputChange('canBillInsurance', id === 'can_bill_insurance')}
            showDescriptions={true}
            className="mt-4"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="mt-8">
        <TextareaField
          id="notes"
          label="Notes"
          value={formData.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          placeholder="Enter any additional notes about this staff member"
          rows={4}
        />
      </div>
    </CategorySection>
  );
};

export default UserInformationSection;
