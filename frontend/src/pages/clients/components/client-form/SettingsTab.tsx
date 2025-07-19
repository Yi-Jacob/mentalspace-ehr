
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Label } from '@/components/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shared/ui/select';
import { Checkbox } from '@/components/shared/ui/checkbox';
import { ClientFormData } from '@/types/client';

interface SettingsTabProps {
  formData: ClientFormData;
  setFormData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ formData, setFormData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings & Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Appointment Reminders</Label>
          <Select 
            value={formData.appointment_reminders} 
            onValueChange={(value: ClientFormData['appointment_reminders']) => setFormData({...formData, appointment_reminders: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Default Practice Setting">Default Practice Setting</SelectItem>
              <SelectItem value="No reminders">No reminders</SelectItem>
              <SelectItem value="Email only">Email only</SelectItem>
              <SelectItem value="Text (SMS) only">Text (SMS) only</SelectItem>
              <SelectItem value="Text (SMS) and Email">Text (SMS) and Email</SelectItem>
              <SelectItem value="Text or Call, and Email">Text or Call, and Email</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hipaa_signed"
            checked={formData.hipaa_signed}
            onCheckedChange={(checked) => setFormData({...formData, hipaa_signed: !!checked})}
          />
          <Label htmlFor="hipaa_signed">HIPAA Notice of Privacy Practices signed</Label>
        </div>

        <div>
          <Label>PCP Release</Label>
          <Select 
            value={formData.pcp_release} 
            onValueChange={(value: ClientFormData['pcp_release']) => setFormData({...formData, pcp_release: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not set">Not set</SelectItem>
              <SelectItem value="Patient consented to release information">Patient consented to release information</SelectItem>
              <SelectItem value="Patient declined to release information">Patient declined to release information</SelectItem>
              <SelectItem value="Not applicable">Not applicable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
