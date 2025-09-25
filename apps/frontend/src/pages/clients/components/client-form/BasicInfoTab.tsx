import React from 'react';
import { ClientFormData } from '@/types/clientType';
import { InputField } from '@/components/basic/input';
import { DateInput } from '@/components/basic/date-input';
import { TextareaField } from '@/components/basic/textarea';
import { SelectField } from '@/components/basic/select';
import CategorySection from '@/components/basic/CategorySection';
import { SUFFIX_OPTIONS, PRONOUNS_OPTIONS } from '@/types/enums/clientEnum';

interface BasicInfoTabProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-6">
      <CategorySection
        title="Basic Information"
        description="Essential client information"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />
          <InputField
            id="middleName"
            label="Middle Name"
            value={formData.middleName}
            onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
          />
          <InputField
            id="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
          <SelectField
            label="Suffix"
            value={formData.suffix || 'none'}
            onValueChange={(value) => setFormData(prev => ({ ...prev, suffix: value === 'none' ? '' : value }))}
            options={SUFFIX_OPTIONS}
            placeholder="Select suffix"
          />
          <InputField
            id="preferredName"
            label="Preferred Name"
            value={formData.preferredName}
            onChange={(e) => setFormData(prev => ({ ...prev, preferredName: e.target.value }))}
          />
          <SelectField
            label="Pronouns"
            value={formData.pronouns || 'not-selected'}
            onValueChange={(value) => setFormData(prev => ({ ...prev, pronouns: value === 'not-selected' ? '' : value }))}
            options={PRONOUNS_OPTIONS}
            placeholder="Select pronouns"
          />
          <DateInput
            id="dateOfBirth"
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChange={(value) => setFormData(prev => ({ ...prev, dateOfBirth: value }))}
            showAge={true}
            showYearDropdown={true}
          />
        </div>
      </CategorySection>

      <CategorySection
        title="Patient Comments"
        description="Non-clinical information such as scheduling or billing comments"
      >
        <TextareaField
          id="patientComments"
          label="Comments"
          value={formData.patientComments}
          onChange={(e) => setFormData(prev => ({ ...prev, patientComments: e.target.value }))}
          placeholder="Non-clinical information such as scheduling or billing comments..."
          rows={3}
        />
      </CategorySection>
    </div>
  );
};