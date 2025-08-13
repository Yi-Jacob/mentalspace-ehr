
import React from 'react';
import { InputField } from '@/components/basic/input';
import { ProgressNoteFormData } from '@/types/noteType';
import { useCptCodes } from '@/hooks/useCptCodes';
import { LOCATION_OPTIONS, PARTICIPANT_OPTIONS } from '@/types/enums/notesEnum';
import SearchableSelect from '../../../../components/basic/SearchableSelect';
import ClientInfoDisplay from '../../components/shared/ClientInfoDisplay';

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
  const { data: cptCodes = [] } = useCptCodes();

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
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Session Overview</h4>
        <p className="text-blue-700 text-sm">
          Session details and basic information for this progress note.
        </p>
      </div>

      <ClientInfoDisplay clientData={clientData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          id="sessionDate"
          label="Session Date *"
          type="date"
          value={formData.sessionDate}
          onChange={(e) => updateFormData({ sessionDate: e.target.value })}
          required
        />

        <SearchableSelect
          label="Service Code"
          value={formData.serviceCode}
          onChange={(value) => updateFormData({ serviceCode: value })}
          options={cptCodes}
          placeholder="Search service codes..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          id="startTime"
          label="Start Time *"
          type="time"
          value={formData.startTime}
          onChange={(e) => handleTimeChange('startTime', e.target.value)}
          required
        />

        <InputField
          id="endTime"
          label="End Time *"
          type="time"
          value={formData.endTime}
          onChange={(e) => handleTimeChange('endTime', e.target.value)}
          required
        />

        <InputField
          id="duration"
          label="Duration (minutes)"
          type="number"
          value={formData.duration}
          readOnly
          className="bg-gray-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SearchableSelect
          label="Location"
          value={formData.location}
          onChange={(value) => updateFormData({ location: value })}
          options={LOCATION_OPTIONS}
          placeholder="Select session location..."
        />

        <SearchableSelect
          label="Participants"
          value={formData.participants}
          onChange={(value) => updateFormData({ participants: value })}
          options={PARTICIPANT_OPTIONS}
          placeholder="Select session participants..."
        />
      </div>
    </div>
  );
};

export default ClientOverviewSection;
