
import React from 'react';
import { Label } from '@/components/shared/ui/label';
import { Input } from '@/components/shared/ui/input';
import { Textarea } from '@/components/shared/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { ConsultationNoteFormData } from '../types/ConsultationNoteFormData';

interface ConsultationInfoSectionProps {
  formData: ConsultationNoteFormData;
  updateFormData: (updates: Partial<ConsultationNoteFormData>) => void;
}

const ConsultationInfoSection: React.FC<ConsultationInfoSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Consultation Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="consultationDate">Consultation Date *</Label>
          <Input
            id="consultationDate"
            type="date"
            value={formData.consultationDate}
            onChange={(e) => updateFormData({ consultationDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="consultationTime">Consultation Time</Label>
          <Input
            id="consultationTime"
            type="time"
            value={formData.consultationTime}
            onChange={(e) => updateFormData({ consultationTime: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="consultationDuration">Duration (minutes) *</Label>
          <Input
            id="consultationDuration"
            type="number"
            min="1"
            value={formData.consultationDuration}
            onChange={(e) => updateFormData({ consultationDuration: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="consultationType">Consultation Type *</Label>
          <Select value={formData.consultationType} onValueChange={(value: any) => updateFormData({ consultationType: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="case_review">Case Review</SelectItem>
              <SelectItem value="treatment_planning">Treatment Planning</SelectItem>
              <SelectItem value="supervision">Clinical Supervision</SelectItem>
              <SelectItem value="peer_consultation">Peer Consultation</SelectItem>
              <SelectItem value="multidisciplinary_team">Multidisciplinary Team</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="consultationPurpose">Consultation Purpose *</Label>
        <Textarea
          id="consultationPurpose"
          value={formData.consultationPurpose}
          onChange={(e) => updateFormData({ consultationPurpose: e.target.value })}
          placeholder="Describe the purpose and goals of this consultation..."
          rows={3}
        />
      </div>
    </div>
  );
};

export default ConsultationInfoSection;
