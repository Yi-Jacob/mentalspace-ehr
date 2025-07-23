
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, User, Clock, AlertTriangle } from 'lucide-react';
import { format, isAfter, subDays } from 'date-fns';
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
      case 'draft': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'signed': return 'bg-green-100 text-green-800 border-green-200';
      case 'submitted_for_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'locked': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    return <FileText className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'progress_note': return 'from-green-500 to-green-600';
      case 'intake': return 'from-blue-500 to-blue-600';
      case 'treatment_plan': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatNoteType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const isOverdue = (status: string, updatedAt: string) => {
    if (status !== 'draft') return false;
    return isAfter(subDays(new Date(), 7), new Date(updatedAt));
  };

  const handleViewNote = () => {
    if (note.note_type === 'progress_note') {
      navigate(`/notes/progress-note/${note.id}`);
    } else {
      navigate(`/notes/note/${note.id}`);
    }
  };

  const handleEditNote = () => {
    if (note.note_type === 'progress_note') {
      navigate(`/notes/progress-note/${note.id}/edit`);
    } else {
      navigate(`/notes/note/${note.id}/edit`);
    }
  };

  const overdue = isOverdue(note.status, note.updated_at);
  const typeColor = getTypeColor(note.note_type);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/90 backdrop-blur-sm hover:scale-[1.02] overflow-hidden">
      <div className={`h-1 bg-gradient-to-r ${typeColor}`} />
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            {/* Header with icon and title */}
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${typeColor} text-white shadow-sm`}>
                {getTypeIcon(note.note_type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">
                    {note.title}
                  </h3>
                  {overdue && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="bg-white/80">
                    {formatNoteType(note.note_type)}
                  </Badge>
                  <Badge className={getStatusColor(note.status)}>
                    {note.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {overdue && (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Client and Provider Info */}
            <div className="bg-gray-50/80 rounded-lg p-3 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <User className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Client:</span>
                <span>{note.clients?.first_name} {note.clients?.last_name}</span>
              </div>
              
              {note.provider && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Provider:</span>
                  <span>{note.provider.first_name} {note.provider.last_name}</span>
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span>Created: {format(new Date(note.created_at), 'MMM d, yyyy')}</span>
              </div>
              {note.updated_at !== note.created_at && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <span>Updated: {format(new Date(note.updated_at), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 ml-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewNote}
              className="bg-white/80 hover:bg-white border-gray-200 hover:border-gray-300"
            >
              View
            </Button>
            {note.status === 'draft' && (
              <Button 
                size="sm"
                onClick={handleEditNote}
                className={`bg-gradient-to-r ${typeColor} border-0 hover:shadow-md transition-shadow`}
              >
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Accountability Progress Bar for Drafts */}
        {note.status === 'draft' && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
              <span>Completion Status</span>
              <span>{overdue ? 'Overdue' : 'In Progress'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  overdue ? 'bg-red-400' : 'bg-blue-400'
                }`}
                style={{ width: '60%' }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteCard;
