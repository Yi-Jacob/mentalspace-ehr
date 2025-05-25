
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ClinicalNote {
  id: string;
  title: string;
  note_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  client_id: string;
  clients?: {
    first_name: string;
    last_name: string;
  };
  provider?: {
    first_name: string;
    last_name: string;
  };
}

interface NoteCardProps {
  note: ClinicalNote;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'submitted_for_review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'locked': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatNoteType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg">{note.title}</h3>
              <Badge variant="outline">{formatNoteType(note.note_type)}</Badge>
              <Badge className={getStatusColor(note.status)}>
                {note.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{note.clients?.first_name} {note.clients?.last_name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Created: {format(new Date(note.created_at), 'MMM d, yyyy')}</span>
              </div>
              {note.updated_at !== note.created_at && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Updated: {format(new Date(note.updated_at), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
            
            {note.provider && (
              <div className="text-sm text-gray-600">
                Provider: {note.provider.first_name} {note.provider.last_name}
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/documentation/note/${note.id}`)}
            >
              View
            </Button>
            {note.status === 'draft' && (
              <Button 
                size="sm"
                onClick={() => navigate(`/documentation/note/${note.id}/edit`)}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
