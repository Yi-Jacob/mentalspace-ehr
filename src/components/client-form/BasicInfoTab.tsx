
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ClientFormData } from '../AddClientModal';

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
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="middle_name">Middle Name</Label>
            <Input
              id="middle_name"
              value={formData.middle_name}
              onChange={(e) => setFormData({...formData, middle_name: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="suffix">Suffix</Label>
            <Input
              id="suffix"
              value={formData.suffix}
              onChange={(e) => setFormData({...formData, suffix: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="preferred_name">Preferred Name</Label>
            <Input
              id="preferred_name"
              value={formData.preferred_name}
              onChange={(e) => setFormData({...formData, preferred_name: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="pronouns">Pronouns</Label>
            <Input
              id="pronouns"
              value={formData.pronouns}
              onChange={(e) => setFormData({...formData, pronouns: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      <div>
        <Label htmlFor="patient_comments">Patient Comments</Label>
        <Textarea
          id="patient_comments"
          value={formData.patient_comments}
          onChange={(e) => setFormData({...formData, patient_comments: e.target.value})}
          placeholder="Non-clinical information such as scheduling or billing comments..."
          rows={3}
        />
      </div>
    </>
  );
};
