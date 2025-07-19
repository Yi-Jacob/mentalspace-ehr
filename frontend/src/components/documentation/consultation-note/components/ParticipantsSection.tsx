
import React from 'react';
import { Card } from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { Input } from '@/components/shared/ui/input';
import { Label } from '@/components/shared/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { ConsultationNoteFormData } from '../types/ConsultationNoteFormData';

interface ParticipantsSectionProps {
  participants: ConsultationNoteFormData['participants'];
  onAddParticipant: () => void;
  onUpdateParticipant: (id: string, field: string, value: string) => void;
  onRemoveParticipant: (id: string) => void;
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({
  participants,
  onAddParticipant,
  onUpdateParticipant,
  onRemoveParticipant,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
        <Button type="button" onClick={onAddParticipant} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Participant
        </Button>
      </div>
      
      {participants.map((participant) => (
        <Card key={participant.id} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                value={participant.name}
                onChange={(e) => onUpdateParticipant(participant.id, 'name', e.target.value)}
                placeholder="Participant name"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Input
                value={participant.role}
                onChange={(e) => onUpdateParticipant(participant.id, 'role', e.target.value)}
                placeholder="Professional role"
              />
            </div>
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Label>Organization</Label>
                <Input
                  value={participant.organization}
                  onChange={(e) => onUpdateParticipant(participant.id, 'organization', e.target.value)}
                  placeholder="Organization/Agency"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRemoveParticipant(participant.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ParticipantsSection;
