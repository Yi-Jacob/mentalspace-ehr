
import React from 'react';
import { Label } from '@/components/shared/ui/label';
import { Input } from '@/components/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { MiscellaneousNoteFormData } from '../types/MiscellaneousNoteFormData';

interface BasicInfoSectionProps {
  formData: Pick<MiscellaneousNoteFormData, 'eventDate' | 'noteDate' | 'noteCategory' | 'noteSubtype' | 'urgencyLevel' | 'noteTitle'>;
  updateFormData: (updates: Partial<MiscellaneousNoteFormData>) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Note Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="eventDate">Event/Activity Date *</Label>
          <Input
            id="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={(e) => updateFormData({ eventDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="noteDate">Note Date</Label>
          <Input
            id="noteDate"
            type="date"
            value={formData.noteDate}
            onChange={(e) => updateFormData({ noteDate: e.target.value })}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="noteCategory">Note Category *</Label>
          <Select value={formData.noteCategory} onValueChange={(value: any) => updateFormData({ noteCategory: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="administrative">Administrative</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="insurance">Insurance</SelectItem>
              <SelectItem value="coordination_of_care">Coordination of Care</SelectItem>
              <SelectItem value="incident_report">Incident Report</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="noteSubtype">Note Subtype</Label>
          <Input
            id="noteSubtype"
            value={formData.noteSubtype}
            onChange={(e) => updateFormData({ noteSubtype: e.target.value })}
            placeholder="Specific type or subtype"
          />
        </div>
        <div>
          <Label htmlFor="urgencyLevel">Urgency Level</Label>
          <Select value={formData.urgencyLevel} onValueChange={(value: any) => updateFormData({ urgencyLevel: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="noteTitle">Note Title *</Label>
        <Input
          id="noteTitle"
          value={formData.noteTitle}
          onChange={(e) => updateFormData({ noteTitle: e.target.value })}
          placeholder="Brief descriptive title for this note"
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
