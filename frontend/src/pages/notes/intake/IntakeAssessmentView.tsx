
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, User, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useNoteData } from './hooks/useNoteData';
import { IntakeFormData } from './types/IntakeFormData';

const IntakeAssessmentView = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { data: note, isLoading } = useNoteData(noteId);

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
        <p className="text-gray-600">Assessment not found</p>
        <Button onClick={() => navigate('/notes')} className="mt-4">
          Back to Notes
        </Button>
      </div>
    );
  }

  const formData = note.content as unknown as IntakeFormData;
  const clientName = note.client 
    ? `${note.client.firstName} ${note.client.lastName}`
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
              <h1 className="text-3xl font-bold text-gray-900">Intake Assessment</h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{clientName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                                  <span className="text-gray-700">
                  {format(new Date(note.createdAt), 'MMM d, yyyy')}
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
                Edit Assessment
              </Button>
            )}
          </div>
        </div>

        {/* Assessment Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Intake Date</label>
                <p className="text-gray-900">{formData.intakeDate || 'Not specified'}</p>
              </div>
              {note.clients && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900">
                      {note.clients.dateOfBirth 
                        ? format(new Date(note.clients.dateOfBirth), 'MMM d, yyyy')
                        : 'Not specified'
                      }
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Presenting Problem */}
          <Card>
            <CardHeader>
              <CardTitle>Presenting Problem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Primary Problem</label>
                <p className="text-gray-900">{formData.primaryProblem || 'Not specified'}</p>
              </div>
              {formData.additionalConcerns && formData.additionalConcerns.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Additional Concerns</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.additionalConcerns.map((concern, index) => (
                      <Badge key={index} variant="outline">{concern}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Symptom Onset</label>
                <p className="text-gray-900">{formData.symptomOnset || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Symptom Severity</label>
                <p className="text-gray-900">{formData.symptomSeverity || 'Not specified'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Description */}
          {formData.detailedDescription && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Detailed Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 whitespace-pre-wrap">{formData.detailedDescription}</p>
              </CardContent>
            </Card>
          )}

          {/* Impact on Functioning */}
          {formData.impactOnFunctioning && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Impact on Functioning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 whitespace-pre-wrap">{formData.impactOnFunctioning}</p>
              </CardContent>
            </Card>
          )}

          {/* Treatment History */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Previous Treatment</label>
                <p className="text-gray-900">{formData.hasPriorTreatment ? 'Yes' : 'No'}</p>
              </div>
              {formData.hasPriorTreatment && formData.treatmentTypes && formData.treatmentTypes.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Treatment Types</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.treatmentTypes.map((type, index) => (
                      <Badge key={index} variant="outline">{type}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {formData.treatmentDetails && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Treatment Details</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{formData.treatmentDetails}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Acute Risk</label>
                <p className="text-gray-900">{formData.noAcuteRisk ? 'No acute risk identified' : 'Risk factors present'}</p>
              </div>
              {formData.riskFactors && formData.riskFactors.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Risk Factors</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.riskFactors.map((factor, index) => (
                      <Badge key={index} variant="destructive">{factor}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {formData.safetyPlan && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Safety Plan</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{formData.safetyPlan}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Diagnosis */}
          {formData.primaryDiagnosis && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Clinical Diagnosis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Primary Diagnosis</label>
                  <p className="text-gray-900">{formData.primaryDiagnosis}</p>
                </div>
                {formData.secondaryDiagnoses && formData.secondaryDiagnoses.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Secondary Diagnoses</label>
                    <div className="space-y-1">
                      {formData.secondaryDiagnoses.map((diagnosis, index) => (
                        <p key={index} className="text-gray-900">{diagnosis}</p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Signature */}
          {formData.isFinalized && (
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

export default IntakeAssessmentView;
