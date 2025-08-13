
import React from 'react';
import { Card } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { InputField } from '@/components/basic/input';
import { DateInput } from '@/components/basic/date-input';
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
            <InputField
              label="Action"
              value={action.action}
              onChange={(e) => onUpdateActionItem(index, 'action', e.target.value)}
              placeholder="Action to be taken"
            />
            <InputField
              label="Owner"
              value={action.owner}
              onChange={(e) => onUpdateActionItem(index, 'owner', e.target.value)}
              placeholder="Responsible person"
            />
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <DateInput
                  label="Due Date"
                  value={action.dueDate}
                  onChange={(value) => onUpdateActionItem(index, 'dueDate', value)}
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
