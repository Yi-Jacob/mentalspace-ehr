
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { noteTypes } from './config/noteTypes';

interface CreateNoteGridProps {
  onCreateNote: (noteType: string) => void;
  isCreatingIntake: boolean;
}

const CreateNoteGrid: React.FC<CreateNoteGridProps> = ({
  onCreateNote,
  isCreatingIntake,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {noteTypes.map((noteType) => {
        const IconComponent = noteType.icon;
        return (
          <Card key={noteType.type} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${noteType.color} text-white`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{noteType.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{noteType.description}</CardDescription>
              <Button 
                onClick={() => onCreateNote(noteType.type)}
                className="w-full"
                disabled={noteType.type === 'intake' && isCreatingIntake}
              >
                <Plus className="h-4 w-4 mr-2" />
                {noteType.type === 'intake' && isCreatingIntake 
                  ? 'Creating...' 
                  : `Create ${noteType.title}`
                }
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CreateNoteGrid;
