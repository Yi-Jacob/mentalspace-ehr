
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shared/ui/card';
import { Button } from '@/components/shared/ui/button';
import { Badge } from '@/components/shared/ui/badge';
import { Plus, Clock, Zap } from 'lucide-react';
import { noteTypes } from './config/noteTypes';

interface CreateNoteGridProps {
  onCreateNote: (noteType: string) => void;
  isCreatingIntake: boolean;
}

const CreateNoteGrid: React.FC<CreateNoteGridProps> = ({
  onCreateNote,
  isCreatingIntake,
}) => {
  const getCardGradient = (index: number) => {
    const gradients = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600', 
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-teal-500 to-teal-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600'
    ];
    return gradients[index % gradients.length];
  };

  const getEstimatedTime = (noteType: string) => {
    const times = {
      'intake': '45-60 min',
      'progress_note': '15-20 min',
      'treatment_plan': '30-45 min',
      'cancellation_note': '5 min',
      'contact_note': '10 min',
      'consultation_note': '20 min',
      'miscellaneous_note': '10-15 min'
    };
    return times[noteType as keyof typeof times] || '10-15 min';
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Create New Documentation
        </h2>
        <p className="text-gray-600">Choose the type of clinical note you'd like to create</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {noteTypes.map((noteType, index) => {
          const IconComponent = noteType.icon;
          const gradient = getCardGradient(index);
          const estimatedTime = getEstimatedTime(noteType.type);
          
          return (
            <Card 
              key={noteType.type} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:scale-105 overflow-hidden"
            >
              <CardHeader className="pb-3 relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-gray-900 transition-colors">
                        {noteType.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs bg-white/80">
                          <Clock className="w-3 h-3 mr-1" />
                          {estimatedTime}
                        </Badge>
                        {noteType.type === 'progress_note' && (
                          <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                            <Zap className="w-3 h-3 mr-1" />
                            Quick
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <CardDescription className="mb-4 text-gray-600 leading-relaxed">
                  {noteType.description}
                </CardDescription>
                
                <Button 
                  onClick={() => onCreateNote(noteType.type)}
                  className={`w-full bg-gradient-to-r ${gradient} hover:shadow-lg transition-all duration-300 group-hover:shadow-xl border-0`}
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

      {/* Quick Actions Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Quick Start Tip</h3>
            <p className="text-sm text-gray-600 mt-1">
              Progress Notes are the most commonly used. Start there if you're documenting a recent session.
            </p>
          </div>
          <Button 
            onClick={() => onCreateNote('progress_note')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            disabled={isCreatingIntake}
          >
            <Zap className="w-4 h-4 mr-2" />
            Quick Progress Note
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateNoteGrid;
