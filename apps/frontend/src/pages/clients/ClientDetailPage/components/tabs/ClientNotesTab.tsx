
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { FileText, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';
import { ClientFormData } from '@/types/client';

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

  const handleViewNote = (note: any) => {
    if (note.noteType === 'progress_note') {
      navigate(`/notes/progress-note/${note.id}`);
    } else {
      navigate(`/notes/note/${note.id}`);
    }
  };

  const handleEditNote = (note: any) => {
    if (note.noteType === 'progress_note') {
      navigate(`/notes/progress-note/${note.id}/edit`);
    } else {
      navigate(`/notes/note/${note.id}/edit`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clinical Notes</CardTitle>
          <CardDescription>
            No clinical notes found for this client.
          </CardDescription>
        </CardHeader>
      </Card>
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
                      {note.status.replace('_', ' ').toUpperCase()}
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
