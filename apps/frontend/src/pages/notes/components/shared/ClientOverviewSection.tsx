import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { Textarea } from '@/components/basic/textarea';
import { Calendar } from 'lucide-react';

interface ClientOverviewSectionProps {
  formData: any;
  updateFormData: (updates: any) => void;
  noteType: string;
}

const ClientOverviewSection: React.FC<ClientOverviewSectionProps> = ({
  formData,
  updateFormData,
  noteType
}) => {
  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Client Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date field - different for different note types */}
          {noteType === 'progress_note' && (
            <>
              <div>
                <Label htmlFor="sessionDate">Session Date</Label>
                <Input
                  id="sessionDate"
                  type="date"
                  value={formData.sessionDate || ''}
                  onChange={(e) => handleInputChange('sessionDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime || ''}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime || ''}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration || ''}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                />
              </div>
            </>
          )}

          {noteType === 'intake' && (
            <div>
              <Label htmlFor="intakeDate">Intake Date</Label>
              <Input
                id="intakeDate"
                type="date"
                value={formData.intakeDate || ''}
                onChange={(e) => handleInputChange('intakeDate', e.target.value)}
              />
            </div>
          )}

          {/* Service Code */}
          <div>
            <Label htmlFor="serviceCode">Service Code</Label>
            <Select
              value={formData.serviceCode || ''}
              onValueChange={(value) => handleInputChange('serviceCode', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90791">90791 - Psychiatric Diagnostic Evaluation</SelectItem>
                <SelectItem value="90834">90834 - Psychotherapy, 45 min</SelectItem>
                <SelectItem value="90832">90832 - Psychotherapy, 30 minutes</SelectItem>
                <SelectItem value="90837">90837 - Psychotherapy, 60 minutes</SelectItem>
                <SelectItem value="90846">90846 - Family psychotherapy (without patient present)</SelectItem>
                <SelectItem value="90847">90847 - Family psychotherapy (with patient present)</SelectItem>
                <SelectItem value="90853">90853 - Group psychotherapy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          {noteType === 'progress_note' && (
            <div>
              <Label htmlFor="location">Location</Label>
              <Select
                value={formData.location || ''}
                onValueChange={(value) => handleInputChange('location', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="telehealth">HIPAA Compliant Telehealth Platform</SelectItem>
                  <SelectItem value="home">Home Visit</SelectItem>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Participants */}
          {noteType === 'progress_note' && (
            <div>
              <Label htmlFor="participants">Participants</Label>
              <Select
                value={formData.participants || ''}
                onValueChange={(value) => handleInputChange('participants', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select participants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client-only">Client only</SelectItem>
                  <SelectItem value="client-family">Client and family</SelectItem>
                  <SelectItem value="family-only">Family only</SelectItem>
                  <SelectItem value="group">Group session</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Additional fields based on note type */}
        {noteType === 'intake' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="primaryPhone">Primary Phone</Label>
              <Input
                id="primaryPhone"
                type="tel"
                value={formData.primaryPhone || ''}
                onChange={(e) => handleInputChange('primaryPhone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="primaryEmail">Primary Email</Label>
              <Input
                id="primaryEmail"
                type="email"
                value={formData.primaryEmail || ''}
                onChange={(e) => handleInputChange('primaryEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="primaryInsurance">Primary Insurance</Label>
              <Input
                id="primaryInsurance"
                value={formData.primaryInsurance || ''}
                onChange={(e) => handleInputChange('primaryInsurance', e.target.value)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientOverviewSection;
