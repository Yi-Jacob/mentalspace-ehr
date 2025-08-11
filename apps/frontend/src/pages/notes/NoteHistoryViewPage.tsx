import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/basic/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { ArrowLeft, History, User, Calendar, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { noteService } from '@/services/noteService';
import { NoteHistoryVersion } from '@/types/noteHistoryType';
import { IntakeFormData } from '../intake/types/IntakeFormData';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';

const NoteHistoryViewPage = () => {
  const { noteId, versionId } = useParams();
  const navigate = useNavigate();
  const [historyEntry, setHistoryEntry] = useState<NoteHistoryVersion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (noteId && versionId) {
      loadHistoryVersion();
    }
  }, [noteId, versionId]);

  const loadHistoryVersion = async () => {
    try {
      setIsLoading(true);
      const versionData = await noteService.getNoteHistoryVersion(noteId!, versionId!);
      setHistoryEntry(versionData);
    } catch (err) {
      setError('Failed to load note version');
      console.error('Error loading note version:', err);
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

  const getChangeIndicator = (entry: NoteHistoryVersion) => {
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

  if (error || !historyEntry) {
    return (
      <PageLayout>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error || 'Note version not found'}</p>
          <Button onClick={loadHistoryVersion}>Retry</Button>
        </div>
      </PageLayout>
    );
  }

  const formData = historyEntry.content as unknown as IntakeFormData;
  const clientName = historyEntry.clientFirstName 
    ? `${historyEntry.clientFirstName} ${historyEntry.clientLastName}`
    : 'Unknown Client';

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={History}
        title={`Note History - Version ${historyEntry.version}`}
        description={
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{clientName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">
                {format(new Date(historyEntry.createdAt), 'MMM d, yyyy \'at\' h:mm a')}
              </span>
            </div>
          </div>
        }
        badge={
          <Badge className={getStatusColor(historyEntry.status)}>
            {historyEntry.status?.replace('_', ' ').toUpperCase()}
          </Badge>
        }
        action={
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate(`/notes/${noteId}/history`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to History
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(`/notes/${noteId}`)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Current Version
            </Button>
          </div>
        }
      />

      {/* Version Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-5 h-5 mr-2" />
            Version Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Version Number</label>
              <p className="text-gray-900 font-semibold">{historyEntry.version}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Changes Made</label>
              <p className="text-gray-900">{getChangeIndicator(historyEntry)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p className="text-gray-900">
                {format(new Date(historyEntry.createdAt), 'MMM d, yyyy \'at\' h:mm a')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
            {historyEntry.clientDateOfBirth && (
              <div>
                <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-gray-900">
                  {format(new Date(historyEntry.clientDateOfBirth), 'MMM d, yyyy')}
                </p>
              </div>
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
    </PageLayout>
  );
};

export default NoteHistoryViewPage;
