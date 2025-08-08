
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { noteService } from '@/services/noteService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { FileText, Clock, User, Shield } from 'lucide-react';
import { format } from 'date-fns';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';

const PendingApprovals = () => {
  const navigate = useNavigate();
  
  const { data: pendingNotes, isLoading } = useQuery({
    queryKey: ['pending-approvals'],
    queryFn: async () => {
      return noteService.getPendingApprovals();
    },
  });

  const handleReview = (noteId: string) => {
    navigate(`/notes/note/${noteId}`);
  };

  const handleApprove = async (noteId: string) => {
    try {
      await noteService.updateNote(noteId, { status: 'signed' });
      // Refetch the data
      window.location.reload();
    } catch (error) {
      console.error('Error approving note:', error);
    }
  };

  const handleReject = async (noteId: string) => {
    try {
      await noteService.updateNote(noteId, { status: 'draft' });
      // Refetch the data
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting note:', error);
    }
  };

  if (isLoading) {
    return (
      <PageLayout variant="gradient">
        <PageHeader
          icon={Shield}
          title="Pending Approvals"
          description="Review and approve notes that require your attention"
        />
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Shield}
        title="Pending Approvals"
        description="Review and approve notes that require your attention"
      />
      
      {!pendingNotes || pendingNotes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
            <p className="text-gray-600">All submitted notes have been reviewed.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Pending Approvals ({pendingNotes.length})</h2>
          </div>

          {pendingNotes.map((note) => (
            <Card key={note.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-lg">{note.title}</h3>
                      <Badge variant="outline">
                        {note.noteType.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800">
                        Pending Review
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Client: {note.client?.firstName} {note.client?.lastName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Provider: {note.provider?.firstName} {note.provider?.lastName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Submitted: {format(new Date(note.updatedAt), 'MMM d, yyyy h:mm a')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReview(note.id)}
                    >
                      Review
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(note.id)}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleReject(note.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default PendingApprovals;
