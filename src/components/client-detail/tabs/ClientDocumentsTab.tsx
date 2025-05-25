
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClientFormData } from '@/types/client';

interface ClientDocumentsTabProps {
  client: ClientFormData;
}

export const ClientDocumentsTab: React.FC<ClientDocumentsTabProps> = ({ client }) => {
  const navigate = useNavigate();

  const { data: documents, isLoading } = useQuery({
    queryKey: ['client-documents', client.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinical_notes')
        .select(`
          *,
          provider:users!clinical_notes_provider_id_fkey(first_name, last_name)
        `)
        .eq('client_id', client.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

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

  if (!documents || documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Documents & Notes</CardTitle>
          <CardDescription>
            No clinical documentation found for this client.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate('/documentation')}
            className="mt-4"
          >
            Create New Document
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Documents & Clinical Notes</h3>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">{documents.length} document(s)</span>
          <Button 
            onClick={() => navigate('/documentation')}
            size="sm"
          >
            Create New
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-lg">{doc.title}</h4>
                    <Badge variant="outline">{formatNoteType(doc.note_type)}</Badge>
                    <Badge className={getStatusColor(doc.status)}>
                      {doc.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {format(new Date(doc.created_at), 'MMM d, yyyy')}</span>
                    </div>
                    {doc.updated_at !== doc.created_at && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Updated: {format(new Date(doc.updated_at), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                    {doc.provider && (
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Provider: {doc.provider.first_name} {doc.provider.last_name}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/documentation/note/${doc.id}`)}
                  >
                    View
                  </Button>
                  {doc.status === 'draft' && (
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/documentation/note/${doc.id}/edit`)}
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
