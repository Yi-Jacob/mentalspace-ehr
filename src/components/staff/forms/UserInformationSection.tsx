
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface UserInformationSectionProps {
  formData: any;
  onInputChange: (field: string, value: any) => void;
}

const clinicianTypes = [
  'Behavioral Health',
  'Behavior Analyst',
  'Counselor',
  'Marriage and Family Therapist',
  'Other Service Provider',
  'Other Therapist',
  'Psychologist',
  'Rehabilitation Counselor',
  'Social Worker',
  'Substance Abuse Counselor',
  'Health and Wellness',
  'Dietitian',
  'Occupational Therapist',
  'Other Service Provider (Coach or Non-clinical provider)',
  'Speech/Hearing Professional',
  'Medication Management',
  'Advance Practice Registered Nurse',
  'Nurse Practitioner',
  'Other Nurse',
  'Other Physician',
  'Physician Assistant',
  'Psychiatrist'
];

const supervisionOptions = [
  'Not Supervised',
  'Access patient notes and co-sign notes for selected payers',
  'Must review and approve all notes',
  'Must review and co-sign all notes'
];

const stateOptions = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const UserInformationSection: React.FC<UserInformationSectionProps> = ({
  formData,
  onInputChange
}) => {
  const [languages, setLanguages] = React.useState([{ language: 'English', isPrimary: true }]);

  const addLanguage = () => {
    setLanguages([...languages, { language: '', isPrimary: false }]);
  };

  const removeLanguage = (index: number) => {
    if (languages.length > 1) {
      setLanguages(languages.filter((_, i) => i !== index));
    }
  };

  const updateLanguage = (index: number, field: string, value: any) => {
    const updated = languages.map((lang, i) => 
      i === index ? { ...lang, [field]: value } : lang
    );
    setLanguages(updated);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
        <CardTitle className="text-xl font-semibold text-gray-800">User Information</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Name Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Name: *</Label>
              <div className="grid grid-cols-4 gap-3">
                <Input
                  placeholder="first"
                  value={formData.first_name}
                  onChange={(e) => onInputChange('first_name', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors"
                  required
                />
                <Input
                  placeholder="middle"
                  value={formData.middle_name}
                  onChange={(e) => onInputChange('middle_name', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors"
                />
                <Input
                  placeholder="last"
                  value={formData.last_name}
                  onChange={(e) => onInputChange('last_name', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors"
                  required
                />
                <Input
                  placeholder="suffix"
                  value={formData.suffix}
                  onChange={(e) => onInputChange('suffix', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors"
                />
              </div>
            </div>

            {/* User Name */}
            <div className="space-y-2">
              <Label htmlFor="user_name" className="text-sm font-medium text-gray-700">User Name:</Label>
              <Input
                id="user_name"
                value={formData.user_name}
                onChange={(e) => onInputChange('user_name', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Type of Clinician */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Type of Clinician:</Label>
              <Select value={formData.clinician_type} onValueChange={(value) => onInputChange('clinician_type', value)}>
                <SelectTrigger className="bg-white/90 border-gray-200 focus:border-blue-400">
                  <SelectValue placeholder="-- Select Clinician Type --" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg max-h-60">
                  {clinicianTypes.map((type) => (
                    <SelectItem key={type} value={type} className="hover:bg-blue-50">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Formal Name */}
            <div className="space-y-2">
              <Label htmlFor="formal_name" className="text-sm font-medium text-gray-700">Formal Name:</Label>
              <Input
                id="formal_name"
                placeholder='Example: "John Smith, Ph.D."'
                value={formData.formal_name}
                onChange={(e) => onInputChange('formal_name', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="job_title" className="text-sm font-medium text-gray-700">Title:</Label>
              <Input
                id="job_title"
                placeholder="Example: Licensed Clinical Psychologist"
                value={formData.job_title}
                onChange={(e) => onInputChange('job_title', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors"
              />
            </div>

            {/* NPI */}
            <div className="space-y-2">
              <Label htmlFor="npi_number" className="text-sm font-medium text-gray-700">NPI:</Label>
              <Input
                id="npi_number"
                placeholder="Individual NPI - Type 1"
                value={formData.npi_number}
                onChange={(e) => onInputChange('npi_number', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Supervision */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Supervision:</Label>
              <Select value={formData.supervision_type} onValueChange={(value) => onInputChange('supervision_type', value)}>
                <SelectTrigger className="bg-white/90 border-gray-200 focus:border-blue-400">
                  <SelectValue placeholder="Not Supervised" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg">
                  {supervisionOptions.map((option) => (
                    <SelectItem key={option} value={option} className="hover:bg-blue-50">
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Languages */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Languages:</Label>
              {languages.map((lang, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={lang.language}
                    onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                    className="flex-1 bg-white/90 border-gray-200 focus:border-blue-400"
                    placeholder="Language"
                  />
                  {lang.isPrimary && (
                    <span className="text-xs text-blue-600 font-medium">(primary)</span>
                  )}
                  {!lang.isPrimary && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLanguage(index)}
                      className="p-1 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLanguage}
                className="flex items-center space-x-1 text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4" />
                <span>Add Language</span>
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email: *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors"
                required
              />
            </div>

            {/* Mobile Phone */}
            <div className="space-y-2">
              <Label htmlFor="mobile_phone" className="text-sm font-medium text-gray-700">Mobile Phone:</Label>
              <div className="flex items-center space-x-3">
                <Input
                  id="mobile_phone"
                  value={formData.mobile_phone}
                  onChange={(e) => onInputChange('mobile_phone', e.target.value)}
                  className="flex-1 bg-white/90 border-gray-200 focus:border-blue-400"
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="can_receive_text"
                    checked={formData.can_receive_text}
                    onCheckedChange={(checked) => onInputChange('can_receive_text', checked)}
                  />
                  <Label htmlFor="can_receive_text" className="text-sm text-gray-600">
                    Can receive text messages
                  </Label>
                </div>
              </div>
            </div>

            {/* Work Phone */}
            <div className="space-y-2">
              <Label htmlFor="work_phone" className="text-sm font-medium text-gray-700">Work Phone:</Label>
              <Input
                id="work_phone"
                value={formData.work_phone}
                onChange={(e) => onInputChange('work_phone', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Home Phone */}
            <div className="space-y-2">
              <Label htmlFor="home_phone" className="text-sm font-medium text-gray-700">Home Phone:</Label>
              <Input
                id="home_phone"
                value={formData.home_phone}
                onChange={(e) => onInputChange('home_phone', e.target.value)}
                className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors"
              />
            </div>

            {/* Address */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address_1" className="text-sm font-medium text-gray-700">Address 1:</Label>
                <Input
                  id="address_1"
                  value={formData.address_1}
                  onChange={(e) => onInputChange('address_1', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_2" className="text-sm font-medium text-gray-700">Address 2:</Label>
                <Input
                  id="address_2"
                  value={formData.address_2}
                  onChange={(e) => onInputChange('address_2', e.target.value)}
                  className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="zip_code" className="text-sm font-medium text-gray-700">Zip:</Label>
                  <Input
                    id="zip_code"
                    placeholder="zip code"
                    value={formData.zip_code}
                    onChange={(e) => onInputChange('zip_code', e.target.value)}
                    className="bg-white/90 border-gray-200 focus:border-blue-400 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">City/State:</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="city"
                      placeholder="city"
                      value={formData.city}
                      onChange={(e) => onInputChange('city', e.target.value)}
                      className="flex-1 bg-white/90 border-gray-200 focus:border-blue-400"
                    />
                    <Select value={formData.state} onValueChange={(value) => onInputChange('state', value)}>
                      <SelectTrigger className="w-20 bg-white/90 border-gray-200 focus:border-blue-400">
                        <SelectValue placeholder="---" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 shadow-lg max-h-60">
                        {stateOptions.map((state) => (
                          <SelectItem key={state} value={state} className="hover:bg-blue-50">
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInformationSection;
