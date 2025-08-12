
import React from 'react';
import { Card } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Input } from '@/components/basic/input';
import { Label } from '@/components/basic/label';
import { Plus, Trash2 } from 'lucide-react';
import { ConsultationNoteFormData } from '@/types/noteType';

interface ActionItemsSectionProps {
  actionItems: ConsultationNoteFormData['actionItemOwners'];
  onAddActionItem: () => void;
  onUpdateActionItem: (index: number, field: string, value: string) => void;
  onRemoveActionItem: (index: number) => void;
}

const ActionItemsSection: React.FC<ActionItemsSectionProps> = ({
  actionItems,
  onAddActionItem,
  onUpdateActionItem,
  onRemoveActionItem,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Action Items</h3>
        <Button type="button" onClick={onAddActionItem} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Action Item
        </Button>
      </div>
      
      {actionItems.map((action, index) => (
        <Card key={index} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Action</Label>
              <Input
                value={action.action}
                onChange={(e) => onUpdateActionItem(index, 'action', e.target.value)}
                placeholder="Action to be taken"
              />
            </div>
            <div>
              <Label>Owner</Label>
              <Input
                value={action.owner}
                onChange={(e) => onUpdateActionItem(index, 'owner', e.target.value)}
                placeholder="Responsible person"
              />
            </div>
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={action.dueDate}
                  onChange={(e) => onUpdateActionItem(index, 'dueDate', e.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRemoveActionItem(index)}
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

export default ActionItemsSection;
