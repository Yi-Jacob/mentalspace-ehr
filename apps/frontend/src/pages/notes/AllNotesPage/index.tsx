
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Edit, Trash2, Eye, Lock, Unlock, UserCheck } from 'lucide-react';
import EmptyNotesState from '../components/notes/EmptyNotesState';
import LoadingSpinner from '@/components/LoadingSpinner';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import LoadingWithError from '@/components/LoadingWithError';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Button } from '@/components/basic/button';
import { Table, TableColumn } from '@/components/basic/table';
import { Badge } from '@/components/basic/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/basic/select';
import { noteService } from '@/services/noteService';
import { Note } from '@/types/noteType';
import { getNoteRoute } from '@/utils/routingUtils';

type FilterNoteStatus = 'all' | Note['status'];
type FilterNoteType = 'all' | Note['noteType'];

// Helper function to format note type for display
const formatNoteType = (noteType: string): string => {
  return noteType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'signed':
    case 'accepted':
      return 'default';
    case 'draft':
      return 'secondary';
    case 'rejected':
      return 'destructive';
    case 'pending_review':
      return 'outline';
    case 'locked':
      return 'secondary';
    default:
      return 'outline';
  }
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const NotesList = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<FilterNoteStatus>('all');
  const [typeFilter, setTypeFilter] = useState<FilterNoteType>('all');
  const notesPerPage = 8;

  const { data: notesResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['notes', statusFilter, typeFilter, notesPerPage],
    queryFn: async () => {
      const params: any = {
        limit: notesPerPage,
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      if (typeFilter !== 'all') {
        params.noteType = typeFilter;
      }
      
      return noteService.getNotes(params);
    },
  });

  // Get filtered notes from API response
  const filteredNotes = notesResponse?.notes || [];

  const handleEdit = (id: string) => {
    // Find the note by ID to get the note type
    const note = filteredNotes.find(n => n.id === id);
    if (note) {
      const editRoute = getNoteRoute(note, true);
      navigate(editRoute);
    } else {
      // Fallback to generic route if note not found
      navigate(`/notes/note/${id}/edit`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await noteService.deleteNote(id);
        refetch();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleView = (id: string) => {
    // Find the note by ID to get the note type
    const note = filteredNotes.find(n => n.id === id);
    if (note) {
      const viewRoute = getNoteRoute(note, false);
      navigate(viewRoute);
    } else {
      // Fallback to generic route if note not found
      navigate(`/notes/note/${id}`);
    }
  };

  const handleCoSign = async (id: string) => {
    try {
      await noteService.coSign(id);
      refetch(); // Refresh the notes list
    } catch (error) {
      console.error('Error co-signing note:', error);
    }
  };

  const handleLock = async (id: string) => {
    try {
      await noteService.lockNote(id);
      refetch(); // Refresh the notes list
    } catch (error) {
      console.error('Error locking note:', error);
    }
  };

  const handleUnlock = async (id: string) => {
    try {
      await noteService.unlockNote(id);
      refetch(); // Refresh the notes list
    } catch (error) {
      console.error('Error unlocking note:', error);
    }
  };

  const handleCreateNote = () => {
    navigate('/notes/create-note');
  };

  // Define table columns
  const tableColumns: TableColumn<Note>[] = [
    {
      key: 'title',
      header: 'Title',
      accessor: (note) => (
        <div className="font-medium text-gray-900">
          {note.title}
        </div>
      ),
      sortable: true,
      searchable: true,
      searchValue: (note) => note.title,
    },
    {
      key: 'client',
      header: 'Client',
      accessor: (note) => (
        <div className="text-sm">
          {note.client ? `${note.client.firstName} ${note.client.lastName}` : 'Unknown Client'}
        </div>
      ),
      sortable: true,
      searchable: true,
      searchValue: (note) => note.client ? `${note.client.firstName} ${note.client.lastName}` : '',
    },
    {
      key: 'noteType',
      header: 'Type',
      accessor: (note) => (
        <Badge variant="outline" className="text-xs">
          {formatNoteType(note.noteType)}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (note) => (
        <Badge variant={getStatusBadgeVariant(note.status)} className="text-xs">
          {note.status.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
      sortable: true,
    },
    {
      key: 'provider',
      header: 'Provider',
      accessor: (note) => (
        <div className="text-sm text-gray-600">
          {note.provider ? `${note.provider.firstName} ${note.provider.lastName}` : 'Unknown Provider'}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'createdAt',
      header: 'Created',
      accessor: (note) => (
        <div className="text-sm text-gray-600">
          {formatDate(note.createdAt)}
        </div>
      ),
      sortable: true,
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      accessor: (note) => (
        <div className="text-sm text-gray-600">
          {formatDate(note.updatedAt)}
        </div>
      ),
      sortable: true,
    },
  ];

  // Define table actions
  const tableActions = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (note: Note) => handleView(note.id),
      variant: 'ghost' as const,
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (note: Note) => handleEdit(note.id),
      variant: 'ghost' as const,
      disabled: (note: Note) => note.status === 'locked',
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (note: Note) => handleDelete(note.id),
      variant: 'ghost' as const,
      disabled: (note: Note) => note.status === 'locked',
    },
    {
      label: (note: Note) => note.status === 'locked' ? 'Unlock' : 'Lock',
      icon: (note: Note) => note.status === 'locked' ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />,
      onClick: (note: Note) => note.status === 'locked' ? handleUnlock(note.id) : handleLock(note.id),
      variant: 'ghost' as const,
    },
    {
      label: 'Co-sign',
      icon: <UserCheck className="h-4 w-4" />,
      onClick: (note: Note) => handleCoSign(note.id),
      variant: 'ghost' as const,
      disabled: (note: Note) => note.status === 'locked' || note.status === 'signed',
    },
  ];

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={FileText}
        title="All Notes"
        description="View and manage all your clinical notes, assessments, and documentation"
        action={
          <Button
            onClick={handleCreateNote}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Note
          </Button>
        }
      />
      
      <EnhancedErrorBoundary 
        componentName="NotesList"
        showErrorDetails={process.env.NODE_ENV === 'development'}
        enableRetry={true}
      >
        <div className="space-y-6">
          <LoadingWithError
            isLoading={isLoading}
            error={error}
            onRetry={() => refetch()}
            errorTitle="Failed to load clinical notes"
            errorDescription="There was an issue loading your clinical notes. Please try again."
            loadingComponent={<LoadingSpinner />}
          >
            {filteredNotes.length === 0 && !isLoading ? (
              <EmptyNotesState />
            ) : (
              <Table
                data={filteredNotes}
                columns={tableColumns}
                actions={tableActions}
                sortable={true}
                searchable={true}
                pagination={true}
                pageSize={notesPerPage}
                pageSizeOptions={[8, 16, 24, 32]}
                emptyMessage="No clinical notes found"
                loading={isLoading}
                onRowClick={(note) => handleView(note.id)}
              />
            )}
          </LoadingWithError>
        </div>
      </EnhancedErrorBoundary>
    </PageLayout>
  );
};

export default NotesList;
