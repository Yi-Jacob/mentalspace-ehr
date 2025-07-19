
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientFormData } from '@/types/client';

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
        <div>
          <Label>Administrative Sex</Label>
          <Select value={formData.administrative_sex} onValueChange={(value) => setFormData({...formData, administrative_sex: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select Administrative Sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Gender Identity</Label>
          <Select value={formData.gender_identity} onValueChange={(value) => setFormData({...formData, gender_identity: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select Gender Identity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Trans Woman">Trans Woman</SelectItem>
              <SelectItem value="Trans Man">Trans Man</SelectItem>
              <SelectItem value="Non-binary">Non-binary</SelectItem>
              <SelectItem value="Something else">Something else</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
              <SelectItem value="Choose not to disclose">Choose not to disclose</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Sexual Orientation</Label>
          <Select value={formData.sexual_orientation} onValueChange={(value) => setFormData({...formData, sexual_orientation: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select Sexual Orientation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asexual">Asexual</SelectItem>
              <SelectItem value="Bisexual">Bisexual</SelectItem>
              <SelectItem value="Lesbian or Gay">Lesbian or Gay</SelectItem>
              <SelectItem value="Straight">Straight</SelectItem>
              <SelectItem value="Something else">Something else</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
              <SelectItem value="Choose not to disclose">Choose not to disclose</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="race">Race</Label>
          <Input
            id="race"
            value={formData.race}
            onChange={(e) => setFormData({...formData, race: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="ethnicity">Ethnicity</Label>
          <Input
            id="ethnicity"
            value={formData.ethnicity}
            onChange={(e) => setFormData({...formData, ethnicity: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="languages">Languages</Label>
          <Input
            id="languages"
            value={formData.languages}
            onChange={(e) => setFormData({...formData, languages: e.target.value})}
          />
        </div>

        <div>
          <Label>Marital Status</Label>
          <Select value={formData.marital_status} onValueChange={(value) => setFormData({...formData, marital_status: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select Marital Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unmarried">Unmarried</SelectItem>
              <SelectItem value="Married">Married</SelectItem>
              <SelectItem value="Domestic Partner">Domestic Partner</SelectItem>
              <SelectItem value="Divorced">Divorced</SelectItem>
              <SelectItem value="Widowed">Widowed</SelectItem>
              <SelectItem value="Legally Separated">Legally Separated</SelectItem>
              <SelectItem value="Interlocutory Decree">Interlocutory Decree</SelectItem>
              <SelectItem value="Annulled">Annulled</SelectItem>
              <SelectItem value="Something else">Something else</SelectItem>
              <SelectItem value="Choose not to disclose">Choose not to disclose</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Employment Status</Label>
          <Select value={formData.employment_status} onValueChange={(value) => setFormData({...formData, employment_status: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select Employment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Full-time employed">Full-time employed</SelectItem>
              <SelectItem value="Part-time employed">Part-time employed</SelectItem>
              <SelectItem value="Self-employed">Self-employed</SelectItem>
              <SelectItem value="Contract, per diem">Contract, per diem</SelectItem>
              <SelectItem value="Full-time student">Full-time student</SelectItem>
              <SelectItem value="Part-time student">Part-time student</SelectItem>
              <SelectItem value="On active military duty">On active military duty</SelectItem>
              <SelectItem value="Retired">Retired</SelectItem>
              <SelectItem value="Leave of absence">Leave of absence</SelectItem>
              <SelectItem value="Temporarily unemployed">Temporarily unemployed</SelectItem>
              <SelectItem value="Unemployed">Unemployed</SelectItem>
              <SelectItem value="Something else">Something else</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="religious_affiliation">Religious Affiliation</Label>
          <Input
            id="religious_affiliation"
            value={formData.religious_affiliation}
            onChange={(e) => setFormData({...formData, religious_affiliation: e.target.value})}
          />
        </div>

        <div>
          <Label>Smoking Status</Label>
          <Select value={formData.smoking_status} onValueChange={(value) => setFormData({...formData, smoking_status: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select Smoking Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Current smoker: Every day">Current smoker: Every day</SelectItem>
              <SelectItem value="Current smoker: Some days">Current smoker: Some days</SelectItem>
              <SelectItem value="Former smoker">Former smoker</SelectItem>
              <SelectItem value="Never smoker">Never smoker</SelectItem>
              <SelectItem value="Chose not to disclose">Chose not to disclose</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
