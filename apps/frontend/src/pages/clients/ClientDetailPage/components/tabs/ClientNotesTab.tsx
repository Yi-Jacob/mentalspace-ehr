
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { FileText, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';
import { ClientFormData } from '@/types/clientType';
import { LoadingState } from '@/components/basic/loading-state';
import { EmptyState } from '@/components/basic/empty-state';
import { getStatusColor, formatStatus } from '../StatusBadge';

interface ClientNotesTabProps {
  client: ClientFormData;
}

export const ClientNotesTab: React.FC<ClientNotesTabProps> = ({ client }) => {
  const navigate = useNavigate();

  const { data: notesResponse, isLoading } = useQuery({
    queryKey: ['client-notes', client.id],
    queryFn: async () => {
      return await noteService.getClientNotes(client.id);
    },
  });

  const notes = notesResponse?.notes || [];

  const formatNoteType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleViewNote = (note: any) => {
    // Use the consolidated view route for all note types
    navigate(`/notes/view/${note.id}`);
  };

  const handleEditNote = (note: any) => {
    // Use specific edit routes based on note type
    switch (note.noteType) {
      case 'progress_note':
        navigate(`/notes/progress-note/${note.id}/edit`);
        break;
      case 'intake':
        navigate(`/notes/intake/${note.id}/edit`);
        break;
      case 'treatment_plan':
        navigate(`/notes/treatment-plan/${note.id}/edit`);
        break;
      case 'cancellation_note':
        navigate(`/notes/cancellation-note/${note.id}/edit`);
        break;
      case 'contact_note':
        navigate(`/notes/contact-note/${note.id}/edit`);
        break;
      case 'consultation_note':
        navigate(`/notes/consultation-note/${note.id}/edit`);
        break;
      case 'miscellaneous_note':
        navigate(`/notes/miscellaneous-note/${note.id}/edit`);
        break;
      default:
        // Fallback to generic route
        navigate(`/notes/note/${note.id}/edit`);
    }
  };

  if (isLoading) {
    return <LoadingState count={2} />;
  }

  if (!notes || notes.length === 0) {
    return (
      <EmptyState
        title="Clinical Notes"
        description="No clinical notes found for this client."
        icon={<FileText className="w-12 h-12 text-gray-400" />}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Clinical Notes</h3>
        <span className="text-sm text-gray-500">{notes.length} note(s)</span>
      </div>
      
      <div className="space-y-4">
        {notes.map((note) => (
          <Card key={note.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-lg">{note.title}</h4>
                    <Badge variant="outline">{formatNoteType(note.noteType)}</Badge>
                    <Badge className={getStatusColor(note.status)}>
                      {formatStatus(note.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {format(new Date(note.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                    {note.updatedAt !== note.createdAt && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Updated: {format(new Date(note.updatedAt), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewNote(note)}
                  >
                    View
                  </Button>
                  {note.status === 'draft' && (
                    <Button 
                      size="sm"
                      onClick={() => handleEditNote(note)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
