
import React from 'react';
import { Label } from '@/components/basic/label';
import { Input } from '@/components/basic/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { ContactNoteFormData } from '@/types/noteType';

interface ContactInfoSectionProps {
  formData: ContactNoteFormData;
  updateFormData: (updates: Partial<ContactNoteFormData>) => void;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="contactDate">Contact Date *</Label>
          <Input
            id="contactDate"
            type="date"
            value={formData.contactDate}
            onChange={(e) => updateFormData({ contactDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="contactTime">Contact Time</Label>
          <Input
            id="contactTime"
            type="time"
            value={formData.contactTime}
            onChange={(e) => updateFormData({ contactTime: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="contactDuration">Duration (minutes) *</Label>
          <Input
            id="contactDuration"
            type="number"
            min="1"
            value={formData.contactDuration}
            onChange={(e) => updateFormData({ contactDuration: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactType">Contact Type *</Label>
          <Select value={formData.contactType} onValueChange={(value: any) => updateFormData({ contactType: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phone">Phone Call</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="text">Text Message</SelectItem>
              <SelectItem value="video_call">Video Call</SelectItem>
              <SelectItem value="in_person">In Person</SelectItem>
              <SelectItem value="collateral">Collateral Contact</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="contactInitiator">Contact Initiated By *</Label>
          <Select value={formData.contactInitiator} onValueChange={(value: any) => updateFormData({ contactInitiator: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="provider">Provider</SelectItem>
              <SelectItem value="family">Family Member</SelectItem>
              <SelectItem value="other_provider">Other Provider</SelectItem>
              <SelectItem value="emergency">Emergency Contact</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
