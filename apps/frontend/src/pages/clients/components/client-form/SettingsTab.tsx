
import React from 'react';
import { SelectField } from '@/components/basic/select';
import { Checkbox } from '@/components/basic/checkbox';
import { Label } from '@/components/basic/label';
import { ClientFormData } from '@/types/clientType';
import { APPOINTMENT_REMINDERS_OPTIONS, PCP_RELEASE_OPTIONS } from '@/types/enums/clientEnum';
import CategorySection from '@/components/basic/CategorySection';

interface SettingsTabProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ formData, setFormData }) => {
  return (
    <CategorySection
      title="Settings & Preferences"
      description="Patient preferences and system settings"
    >
      <div className="space-y-4">
        <SelectField
          label="Appointment Reminders"
          value={formData.appointmentReminders}
          onValueChange={(value: ClientFormData['appointmentReminders']) => setFormData({...formData, appointmentReminders: value})}
          placeholder="Select Reminder Preference"
          options={APPOINTMENT_REMINDERS_OPTIONS}
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hipaa_signed"
            checked={formData.hipaaSigned}
            onCheckedChange={(checked) => setFormData({...formData, hipaaSigned: !!checked})}
          />
          <Label htmlFor="hipaa_signed">HIPAA Notice of Privacy Practices signed</Label>
        </div>

        <SelectField
          label="PCP Release"
          value={formData.pcpRelease}
          onValueChange={(value: ClientFormData['pcpRelease']) => setFormData({...formData, pcpRelease: value})}
          placeholder="Select PCP Release Status"
          options={PCP_RELEASE_OPTIONS}
        />
      </div>
    </CategorySection>
  );
};
