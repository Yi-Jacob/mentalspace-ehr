
import React, { useState, useEffect } from 'react';
import { ClientFormData } from '@/types/clientType';
import { InputField } from '@/components/basic/input';
import { DateInput } from '@/components/basic/date-input';
import { TextareaField } from '@/components/basic/textarea';
import { SelectField } from '@/components/basic/select';
import CategorySection from '@/components/basic/CategorySection';
import { staffService } from '@/services/staffService';

interface BasicInfoTabProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}

interface StaffProfileOption {
  id: string;
  formalName?: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, setFormData }) => {
  const [staffProfiles, setStaffProfiles] = useState<StaffProfileOption[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(true);

  useEffect(() => {
    const fetchStaffProfiles = async () => {
      try {
        setIsLoadingStaff(true);
        const profiles = await staffService.getStaffProfilesForAssignment();
        setStaffProfiles(profiles);
      } catch (error) {
        console.error('Error fetching staff profiles:', error);
        setStaffProfiles([]);
      } finally {
        setIsLoadingStaff(false);
      }
    };

    fetchStaffProfiles();
  }, []);

  const getStaffDisplayName = (profile: StaffProfileOption) => {
    return profile.formalName || 
      `${profile.user?.firstName || ''} ${profile.user?.lastName || ''}`.trim() ||
      'Unknown Clinician';
  };

  const staffOptions = [
    { value: "unassigned", label: "-- Unassigned --" },
    ...staffProfiles.map(profile => ({
      value: profile.id,
      label: getStaffDisplayName(profile)
    }))
  ];
  return (
    <>
      <CategorySection
        title="Patient Information"
        description="Basic patient information and demographics"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              required
            />
            <InputField
              id="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              required
            />
            <InputField
              id="middleName"
              label="Middle Name"
              value={formData.middleName}
              onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
            />
            <InputField
              id="suffix"
              label="Suffix"
              value={formData.suffix}
              onChange={(e) => setFormData(prev => ({ ...prev, suffix: e.target.value }))}
              placeholder="Jr., Sr., III, etc."
            />
            <InputField
              id="preferredName"
              label="Preferred Name"
              value={formData.preferredName}
              onChange={(e) => setFormData(prev => ({ ...prev, preferredName: e.target.value }))}
            />
            <InputField
              id="pronouns"
              label="Pronouns"
              value={formData.pronouns}
              onChange={(e) => setFormData(prev => ({ ...prev, pronouns: e.target.value }))}
              placeholder="he/him, she/her, they/them, etc."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateInput
              id="dateOfBirth"
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChange={(value) => setFormData(prev => ({ ...prev, dateOfBirth: value }))}
            />
            <SelectField
              label="Assigned Clinician"
              value={formData.assignedClinicianId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, assignedClinicianId: value }))}
              placeholder="-- Unassigned --"
              options={staffOptions}
              disabled={isLoadingStaff}
            />
          </div>
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
    </>
  );
};
