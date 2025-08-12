
import React from 'react';
import { Label } from '@/components/basic/label';
import { Input } from '@/components/basic/input';
import { Button } from '@/components/basic/button';
import { Card } from '@/components/basic/card';
import { Plus, Trash2 } from 'lucide-react';
import { MiscellaneousNoteFormData } from '@/types/noteType';

interface RelatedPersonsSectionProps {
  formData: Pick<MiscellaneousNoteFormData, 'relatedPersons'>;
  updateFormData: (updates: Partial<MiscellaneousNoteFormData>) => void;
}

const RelatedPersonsSection: React.FC<RelatedPersonsSectionProps> = ({
  formData,
  updateFormData,
}) => {
  const addRelatedPerson = () => {
    const newPerson = {
      name: '',
      relationship: '',
      role: ''
    };
    updateFormData({
      relatedPersons: [...formData.relatedPersons, newPerson]
    });
  };

  const updateRelatedPerson = (index: number, field: string, value: string) => {
    const updatedPersons = formData.relatedPersons.map((person, i) =>
      i === index ? { ...person, [field]: value } : person
    );
    updateFormData({ relatedPersons: updatedPersons });
  };

  const removeRelatedPerson = (index: number) => {
    updateFormData({
      relatedPersons: formData.relatedPersons.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Related Persons</h3>
        <Button type="button" onClick={addRelatedPerson} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Person
        </Button>
      </div>
      
      {formData.relatedPersons.map((person, index) => (
        <Card key={index} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                value={person.name}
                onChange={(e) => updateRelatedPerson(index, 'name', e.target.value)}
                placeholder="Person's name"
              />
            </div>
            <div>
              <Label>Relationship</Label>
              <Input
                value={person.relationship}
                onChange={(e) => updateRelatedPerson(index, 'relationship', e.target.value)}
                placeholder="Relationship to client"
              />
            </div>
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Label>Role</Label>
                <Input
                  value={person.role}
                  onChange={(e) => updateRelatedPerson(index, 'role', e.target.value)}
                  placeholder="Role in this matter"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeRelatedPerson(index)}
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

export default RelatedPersonsSection;
