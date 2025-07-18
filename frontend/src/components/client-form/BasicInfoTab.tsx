
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientFormData } from '@/types/client';
import { PatientInfoFields } from './fields/PatientInfoFields';
import { DateOfBirthField } from './fields/DateOfBirthField';
import { AssignedClinicianField } from './fields/AssignedClinicianField';
import { PatientCommentsField } from './fields/PatientCommentsField';

interface BasicInfoTabProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, setFormData }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PatientInfoFields formData={formData} setFormData={setFormData} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateOfBirthField formData={formData} setFormData={setFormData} />
            <AssignedClinicianField formData={formData} setFormData={setFormData} />
          </div>
        </CardContent>
      </Card>

      <PatientCommentsField formData={formData} setFormData={setFormData} />
    </>
  );
};
