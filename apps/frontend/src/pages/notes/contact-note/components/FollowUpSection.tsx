
import React from 'react';
import { Label } from '@/components/basic/label';
import { Input } from '@/components/basic/input';
import { Textarea } from '@/components/basic/textarea';
import { Checkbox } from '@/components/basic/checkbox';
import { Clock } from 'lucide-react';
import { ContactNoteFormData } from '../types/ContactNoteFormData';

interface FollowUpSectionProps {
  formData: ContactNoteFormData;
  updateFormData: (updates: Partial<ContactNoteFormData>) => void;
}

const FollowUpSection: React.FC<FollowUpSectionProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
        <Clock className="h-5 w-5 text-blue-600" />
        <span>Follow-up Planning</span>
      </h3>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="followUpRequired"
          checked={formData.followUpRequired}
          onCheckedChange={(checked) => updateFormData({ followUpRequired: !!checked })}
        />
        <Label htmlFor="followUpRequired" className="text-sm">
          Follow-up action required
        </Label>
      </div>

      {formData.followUpRequired && (
        <div>
          <Label htmlFor="followUpPlan">Follow-up Plan</Label>
          <Textarea
            id="followUpPlan"
            value={formData.followUpPlan}
            onChange={(e) => updateFormData({ followUpPlan: e.target.value })}
            placeholder="Describe the follow-up actions needed..."
            rows={2}
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="nextAppointmentScheduled"
          checked={formData.nextAppointmentScheduled}
          onCheckedChange={(checked) => updateFormData({ nextAppointmentScheduled: !!checked })}
        />
        <Label htmlFor="nextAppointmentScheduled" className="text-sm">
          Next appointment scheduled
        </Label>
      </div>

      {formData.nextAppointmentScheduled && (
        <div>
          <Label htmlFor="nextAppointmentDate">Next Appointment Date</Label>
          <Input
            id="nextAppointmentDate"
            type="date"
            value={formData.nextAppointmentDate}
            onChange={(e) => updateFormData({ nextAppointmentDate: e.target.value })}
          />
        </div>
      )}
    </div>
  );
};

export default FollowUpSection;
