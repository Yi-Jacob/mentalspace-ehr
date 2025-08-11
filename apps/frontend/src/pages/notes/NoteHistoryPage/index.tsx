import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/basic/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { ArrowLeft, History, Eye, Calendar, User, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { noteService } from '@/services/noteService';
import { NoteHistoryEntry } from '@/types/noteHistoryType';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';

const NoteHistoryPage = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState<NoteHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (noteId) {
      loadNoteHistory();
    }
  }, [noteId]);

  const loadNoteHistory = async () => {
    try {
      setIsLoading(true);
      const historyData = await noteService.getNoteHistory(noteId!);
      setHistory(historyData);
    } catch (err) {
      setError('Failed to load note history');
      console.error('Error loading note history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()??'draft') {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'locked': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChangeIndicator = (entry: NoteHistoryEntry) => {
    const changes = [];
    if (entry.updatedTitle) changes.push('Title');
    if (entry.updatedContent) changes.push('Content');
    if (entry.updatedStatus) changes.push('Status');
    return changes.length > 0 ? changes.join(', ') : 'No changes';
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadNoteHistory}>Retry</Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={History}
        title="Note History"
        description="View all versions and changes made to this note"
        action={
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate(`/notes/${noteId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Note
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {history.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No history available for this note</p>
            </CardContent>
          </Card>
        ) : (
          history.map((entry, index) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                      {entry.version}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <p className="text-sm text-gray-500">
                        Version {entry.version} • {getChangeIndicator(entry)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(entry.status)}>
                      {entry.status?.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/notes/${noteId}/history/${entry.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {format(new Date(entry.createdAt), 'MMM d, yyyy \'at\' h:mm a')}
                    </span>
                  </div>
                  {entry.clientFirstName && (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        {entry.clientFirstName} {entry.clientLastName}
                      </span>
                    </div>
                  )}
                  {entry.noteType && (
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 capitalize">
                        {entry.noteType.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </PageLayout>
  );
};

export default NoteHistoryPage;
