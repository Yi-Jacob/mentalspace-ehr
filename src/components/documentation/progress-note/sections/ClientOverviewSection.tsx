
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProgressNoteFormData } from '../types/ProgressNoteFormData';

interface ClientOverviewSectionProps {
  formData: ProgressNoteFormData;
  updateFormData: (updates: Partial<ProgressNoteFormData>) => void;
  clientData?: any;
}

const ClientOverviewSection: React.FC<ClientOverviewSectionProps> = ({
  formData,
  updateFormData,
  clientData,
}) => {
  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const diffMs = endTime.getTime() - startTime.getTime();
    return Math.max(0, Math.round(diffMs / (1000 * 60))); // Convert to minutes
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const updates: Partial<ProgressNoteFormData> = { [field]: value };
    
    if (field === 'startTime' && formData.endTime) {
      updates.duration = calculateDuration(value, formData.endTime);
    } else if (field === 'endTime' && formData.startTime) {
      updates.duration = calculateDuration(formData.startTime, value);
    }
    
    updateFormData(updates);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="sessionDate">Session Date *</Label>
          <Input
            id="sessionDate"
            type="date"
            value={formData.sessionDate}
            onChange={(e) => updateFormData({ sessionDate: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="serviceCode">Service Code *</Label>
          <Select value={formData.serviceCode} onValueChange={(value) => updateFormData({ serviceCode: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select service code" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90834">90834 - Psychotherapy, 45 minutes</SelectItem>
              <SelectItem value="90837">90837 - Psychotherapy, 60 minutes</SelectItem>
              <SelectItem value="90847">90847 - Family therapy with patient present</SelectItem>
              <SelectItem value="90853">90853 - Group psychotherapy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => handleTimeChange('startTime', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => handleTimeChange('endTime', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            readOnly
            className="bg-gray-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="location">Location</Label>
          <Select value={formData.location} onValueChange={(value) => updateFormData({ location: value })}>
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

        <div>
          <Label htmlFor="participants">Participants</Label>
          <Select value={formData.participants} onValueChange={(value) => updateFormData({ participants: value })}>
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
      </div>

      {clientData && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Client Information</h3>
          <p className="text-blue-800">
            <strong>Name:</strong> {clientData.first_name} {clientData.last_name}
          </p>
          {clientData.date_of_birth && (
            <p className="text-blue-800">
              <strong>DOB:</strong> {clientData.date_of_birth}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientOverviewSection;
