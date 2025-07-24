import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, User, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';

const GenericNoteView = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: async () => {
      if (!noteId) return null;
      return await noteService.getNote(noteId);
    },
    enabled: !!noteId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Note not found</h3>
          <p className="mt-1 text-sm text-gray-500">The requested note could not be found.</p>
          <div className="mt-6">
            <Button onClick={() => navigate('/notes')}>
              Return to Notes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'signed': return 'bg-green-100 text-green-800 border-green-200';
      case 'submitted_for_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'locked': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatNoteType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/notes')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Button>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(note.status)}>
              {note.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge variant="outline">
              {formatNoteType(note.noteType)}
            </Badge>
          </div>
        </div>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{note.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Client ID: {note.clientId}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(note.createdAt), 'PPP')}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>Provider ID: {note.providerId}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate(`/client/${note.clientId}`)}
            >
              <User className="w-4 h-4 mr-2" />
              View Client Chart
            </Button>
            {note.status === 'draft' && (
              <Button 
                onClick={() => navigate(`/notes/note/${noteId}/edit`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Note
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Note Content */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Note Content</CardTitle>
          </CardHeader>
          <CardContent>
            {note.content && typeof note.content === 'object' ? (
              <div className="space-y-4">
                {Object.entries(note.content).map(([key, value]) => {
                  if (!value || (typeof value === 'string' && !value.trim())) return null;
                  
                  return (
                    <div key={key} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <h4 className="font-medium text-gray-900 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h4>
                      <div className="text-gray-700">
                        {typeof value === 'object' ? (
                          <pre className="whitespace-pre-wrap bg-gray-50 p-3 rounded text-sm">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        ) : (
                          <p className="whitespace-pre-wrap">{String(value)}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No content available</p>
            )}
          </CardContent>
        </Card>

        {/* Note Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Note Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">Created:</span>
                <p className="text-gray-600">{format(new Date(note.createdAt), 'PPP p')}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900">Last Updated:</span>
                <p className="text-gray-600">{format(new Date(note.updatedAt), 'PPP p')}</p>
              </div>
              {note.signedAt && (
                <div>
                  <span className="font-medium text-gray-900">Signed:</span>
                  <p className="text-gray-600">{format(new Date(note.signedAt), 'PPP p')}</p>
                </div>
              )}
              {note.signedBy && (
                <div>
                  <span className="font-medium text-gray-900">Signed By:</span>
                  <p className="text-gray-600">{note.signedBy}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenericNoteView;