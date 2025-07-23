
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, User, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProgressNoteFormData } from './types/ProgressNoteFormData';

const ProgressNoteView = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const { data: note, isLoading } = useQuery({
    queryKey: ['progress-note', noteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinical_notes')
        .select(`
          *,
          clients (
            id,
            first_name,
            last_name,
            date_of_birth
          ),
          provider:users!clinical_notes_provider_id_fkey (
            id,
            first_name,
            last_name
          )
        `)
        .eq('id', noteId)
        .eq('note_type', 'progress_note')
        .single();
      
      if (error) throw error;
      return data;
    },
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
      <div className="text-center py-8">
        <p className="text-gray-600">Progress note not found</p>
        <Button onClick={() => navigate('/notes')} className="mt-4">
          Back to Notes
        </Button>
      </div>
    );
  }

  const formData = note.content as unknown as ProgressNoteFormData;
  const clientName = note.clients 
    ? `${note.clients.first_name} ${note.clients.last_name}`
    : 'Unknown Client';

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/notes')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Progress Note</h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{clientName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">
                    {format(new Date(note.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
                <Badge className={getStatusColor(note.status)}>
                  {note.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate(`/client/${note.client_id}`)}
            >
              <User className="w-4 h-4 mr-2" />
              View Client Chart
            </Button>
            {note.status === 'draft' && (
              <Button 
                onClick={() => navigate(`/notes/progress-note/${noteId}/edit`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Note
              </Button>
            )}
          </div>
        </div>

        {/* Progress Note Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Information */}
          <Card>
            <CardHeader>
              <CardTitle>Session Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Session Date</label>
                <p className="text-gray-900">{formData?.sessionDate || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Start Time</label>
                <p className="text-gray-900">{formData?.startTime || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">End Time</label>
                <p className="text-gray-900">{formData?.endTime || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Duration (minutes)</label>
                <p className="text-gray-900">{formData?.duration || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Service Code</label>
                <p className="text-gray-900">{formData?.serviceCode || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-gray-900">{formData?.location || 'Not specified'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Diagnosis Information */}
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Primary Diagnosis</label>
                <p className="text-gray-900">{formData?.primaryDiagnosis || 'Not specified'}</p>
              </div>
              {formData?.secondaryDiagnoses && formData.secondaryDiagnoses.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Secondary Diagnoses</label>
                  <ul className="text-gray-900 list-disc list-inside">
                    {formData.secondaryDiagnoses.map((diagnosis, index) => (
                      <li key={index}>{diagnosis}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mental Status */}
          {(formData?.mood || formData?.affect || formData?.generalAppearance) && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Current Mental Status</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formData?.generalAppearance && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">General Appearance</label>
                    <p className="text-gray-900">{formData.generalAppearance}</p>
                  </div>
                )}
                {formData?.mood && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mood</label>
                    <p className="text-gray-900">{formData.mood}</p>
                  </div>
                )}
                {formData?.affect && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Affect</label>
                    <p className="text-gray-900">{formData.affect}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Symptom Description */}
          {formData?.symptomDescription && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Subjective (Symptom Description)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 whitespace-pre-wrap">{formData.symptomDescription}</p>
              </CardContent>
            </Card>
          )}

          {/* Objective Content */}
          {formData?.objectiveContent && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Objective</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 whitespace-pre-wrap">{formData.objectiveContent}</p>
              </CardContent>
            </Card>
          )}

          {/* Interventions */}
          {(formData?.selectedInterventions?.length > 0 || formData?.otherInterventions) && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Interventions Used</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData?.selectedInterventions && formData.selectedInterventions.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Selected Interventions</label>
                    <ul className="text-gray-900 list-disc list-inside">
                      {formData.selectedInterventions.map((intervention, index) => (
                        <li key={index}>{intervention}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {formData?.otherInterventions && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Other Interventions</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{formData.otherInterventions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Treatment Plan Progress */}
          {formData?.objectives && formData.objectives.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Treatment Plan Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Objective {index + 1}</label>
                      <p className="text-gray-900">{objective.objectiveText}</p>
                    </div>
                    <div className="mt-2">
                      <label className="text-sm font-medium text-gray-500">Progress</label>
                      <p className="text-gray-900">{objective.progress}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Planning */}
          {formData?.planContent && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Assessment & Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 whitespace-pre-wrap">{formData.planContent}</p>
              </CardContent>
            </Card>
          )}

          {/* Signature */}
          {formData?.isFinalized && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Digital Signature
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Signed By</label>
                  <p className="text-gray-900">{formData.signedBy || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Signature Date</label>
                  <p className="text-gray-900">
                    {formData.signedAt 
                      ? format(new Date(formData.signedAt), 'MMM d, yyyy \'at\' h:mm a')
                      : 'Not specified'
                    }
                  </p>
                </div>
                {formData.signature && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Electronic Signature</label>
                    <p className="text-gray-900 font-mono bg-gray-50 p-2 rounded">{formData.signature}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressNoteView;
