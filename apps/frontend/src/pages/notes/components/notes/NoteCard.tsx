
import React from 'react';
import { Card, CardContent } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { FileText, Calendar, User, Clock, AlertTriangle } from 'lucide-react';
import { format, isAfter, subDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Note } from '@/types/noteType';
import { useAuth } from '@/hooks/useAuth';

interface NoteCardProps {
  note: Note;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onCoSign?: (id: string) => void;
  onLock?: (id: string) => void;
  onUnlock?: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onView,
  onCoSign,
  onLock,
  onUnlock,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const getStatusText = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const isOverdue = note.status === 'draft' && 
    isAfter(subDays(new Date(), 7), new Date(note.updatedAt));

  const handleView = () => {
    if (onView) {
      onView(note.id);
    } else {
      navigate(`/notes/${note.noteType}/${note.id}`);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(note.id);
    } else {
      navigate(`/notes/${note.noteType}/${note.id}/edit`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(note.id);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg text-gray-900">{note.title}</h3>
              <Badge className={getStatusColor(note.status)}>
                {getStatusText(note.status)}
              </Badge>
              {isOverdue && (
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Overdue
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="capitalize">{note.noteType.replace('_', ' ')}</span>
              <span>•</span>
              <span>ID: {note.id.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Client and Provider Info */}
          <div className="bg-gray-50/80 rounded-lg p-3 space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <User className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Client:</span>
              <span>{note.client?.firstName} {note.client?.lastName}</span>
            </div>
            
            {note.provider && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4 text-green-500" />
                <span className="font-medium">Provider:</span>
                <span>{note.provider.firstName} {note.provider.lastName}</span>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span>Created: {format(new Date(note.createdAt), 'MMM d, yyyy')}</span>
            </div>
            {note.updatedAt !== note.createdAt && (
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-400" />
                <span>Updated: {format(new Date(note.updatedAt), 'MMM d, yyyy')}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-2 mt-6 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={handleView}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            View
          </Button>
          
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              Edit
            </Button>
          )}
          
          {note.status === 'signed' && onCoSign && note.signedBy && user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCoSign(note.id)}
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              Co-sign
            </Button>
          )}

          {note.status !== 'locked' && onLock && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLock(note.id)}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              Lock
            </Button>
          )}

          {note.status === 'locked' && onUnlock && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUnlock(note.id)}
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            >
              Unlock
            </Button>
          )}
          
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
