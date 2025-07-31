
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { SelectField } from '@/components/basic/select';
import { ClientFormData } from '@/types/clientType';
import {
  ADMINISTRATIVE_SEX_OPTIONS,
  GENDER_IDENTITY_OPTIONS,
  SEXUAL_ORIENTATION_OPTIONS,
  RACE_OPTIONS,
  ETHNICITY_OPTIONS,
  LANGUAGE_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  EMPLOYMENT_STATUS_OPTIONS,
  RELIGIOUS_AFFILIATION_OPTIONS,
  SMOKING_STATUS_OPTIONS
} from '@/types/enums/clientEnum';

interface DemographicsTabProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}

export const DemographicsTab: React.FC<DemographicsTabProps> = ({ formData, setFormData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Demographics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Administrative Sex"
          value={formData.administrativeSex}
          onValueChange={(value) => setFormData({...formData, administrativeSex: value})}
          placeholder="Select Administrative Sex"
          options={ADMINISTRATIVE_SEX_OPTIONS}
        />

        <SelectField
          label="Gender Identity"
          value={formData.genderIdentity}
          onValueChange={(value) => setFormData({...formData, genderIdentity: value})}
          placeholder="Select Gender Identity"
          options={GENDER_IDENTITY_OPTIONS}
        />

        <SelectField
          label="Sexual Orientation"
          value={formData.sexualOrientation}
          onValueChange={(value) => setFormData({...formData, sexualOrientation: value})}
          placeholder="Select Sexual Orientation"
          options={SEXUAL_ORIENTATION_OPTIONS}
        />

        <SelectField
          label="Race"
          value={formData.race}
          onValueChange={(value) => setFormData({...formData, race: value})}
          placeholder="Select Race"
          options={RACE_OPTIONS}
        />

        <SelectField
          label="Ethnicity"
          value={formData.ethnicity}
          onValueChange={(value) => setFormData({...formData, ethnicity: value})}
          placeholder="Select Ethnicity"
          options={ETHNICITY_OPTIONS}
        />

        <SelectField
          label="Primary Language"
          value={formData.languages}
          onValueChange={(value) => setFormData({...formData, languages: value})}
          placeholder="Select Primary Language"
          options={LANGUAGE_OPTIONS}
        />

        <SelectField
          label="Marital Status"
          value={formData.maritalStatus}
          onValueChange={(value) => setFormData({...formData, maritalStatus: value})}
          placeholder="Select Marital Status"
          options={MARITAL_STATUS_OPTIONS}
        />

        <SelectField
          label="Employment Status"
          value={formData.employmentStatus}
          onValueChange={(value) => setFormData({...formData, employmentStatus: value})}
          placeholder="Select Employment Status"
          options={EMPLOYMENT_STATUS_OPTIONS}
        />

        <SelectField
          label="Religious Affiliation"
          value={formData.religiousAffiliation}
          onValueChange={(value) => setFormData({...formData, religiousAffiliation: value})}
          placeholder="Select Religious Affiliation"
          options={RELIGIOUS_AFFILIATION_OPTIONS}
        />

        <SelectField
          label="Smoking Status"
          value={formData.smokingStatus}
          onValueChange={(value) => setFormData({...formData, smokingStatus: value})}
          placeholder="Select Smoking Status"
          options={SMOKING_STATUS_OPTIONS}
        />
      </CardContent>
    </Card>
  );
};
