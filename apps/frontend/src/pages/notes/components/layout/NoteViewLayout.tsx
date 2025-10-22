import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { ArrowLeft, Edit, History, Bot, LucideIcon } from 'lucide-react';
import { format } from 'date-fns';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Note } from '@/types/noteType';

interface NoteViewLayoutProps {
  note: Note;
  noteType: string;
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  className?: string;
  onChatWithNote?: () => void;
}

const NoteViewLayout: React.FC<NoteViewLayoutProps> = ({
  note,
  noteType,
  icon: Icon,
  title,
  children,
  className = '',
  onChatWithNote
}) => {
  const navigate = useNavigate();

  // Handle case where note is not provided
  if (!note) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Icon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">{title} not found</h3>
          <p className="mt-1 text-sm text-gray-500">The requested {title.toLowerCase()} could not be found.</p>
          <div className="mt-6">
            <button 
              onClick={() => navigate('/notes')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Notes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'locked': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const clientName = note.client 
    ? `${note.client.firstName} ${note.client.lastName}`
    : `Client ID: ${note.clientId}`;

  const providerName = note.provider 
    ? `${note.provider.firstName} ${note.provider.lastName}`
    : `Provider ID: ${note.providerId}`;

  const getEditPath = () => {
    // Use the unified edit route for all note types
    return `/notes/edit/${note.id}`;
  };

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Icon}
        title={title}
        description={
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="font-medium">Client:</span>
              <span>{clientName}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Provider:</span>
              <span>{providerName}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Created:</span>
              <span>{format(new Date(note.createdAt), 'PPP')}</span>
            </div>
          </div>
        }
        badge={
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(note.status)}>
              {note.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge variant="outline">{title}</Badge>
          </div>
        }
        action={
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate('/notes')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Button>
            {onChatWithNote && (
              <Button 
                variant="outline"
                onClick={onChatWithNote}
                className="hover:bg-purple-50 transition-colors border-purple-300 hover:border-purple-400 text-purple-700"
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Chat
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={() => navigate(getEditPath())}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(`/notes/${note.id}/history`)}
            >
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </div>
        }
      />

      <div className={`space-y-6 ${className}`}>
        {children}
      </div>
    </PageLayout>
  );
};

export default NoteViewLayout;
