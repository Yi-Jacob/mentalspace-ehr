import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { InfoDisplay, InfoSection } from '@/components/basic/InfoDisplay';
import { LoadingState } from '@/components/basic/loading-state';
import { ArrowLeft, Edit, History, Calendar, AlertTriangle, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { noteService } from '@/services/noteService';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { 
  CANCELLATION_INITIATORS, 
  NOTIFICATION_METHODS, 
  BILLING_STATUS_OPTIONS 
} from '@/types/enums/notesEnum';

const CancellationNoteViewPage = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  
  const { data: noteData, isLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: async () => {
      if (!noteId) return null;
      return await noteService.getNote(noteId);
    },
    enabled: !!noteId,
  });

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState count={4} className="py-8" />
      </PageLayout>
    );
  }

  if (!noteData) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Cancellation Note not found</h3>
            <p className="mt-1 text-sm text-gray-500">The requested cancellation note could not be found.</p>
            <div className="mt-6">
              <Button onClick={() => navigate('/notes')}>
                Return to Notes
              </Button>
            </div>
          </div>
        </div>
      </PageLayout>
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

  const getCancellationInitiatorLabel = (value: string) => {
    const initiator = CANCELLATION_INITIATORS.find(i => i.value === value);
    return initiator ? initiator.label : value;
  };

  const getNotificationMethodLabel = (value: string) => {
    const method = NOTIFICATION_METHODS.find(m => m.value === value);
    return method ? method.label : value;
  };

  const getBillingStatusLabel = (value: string) => {
    const status = BILLING_STATUS_OPTIONS.find(s => s.value === value);
    return status ? status.label : value;
  };

  const clientName = noteData.client 
    ? `${noteData.client.firstName} ${noteData.client.lastName}`
    : `Client ID: ${noteData.clientId}`;

  const providerName = noteData.provider 
    ? `${noteData.provider.firstName} ${noteData.provider.lastName}`
    : `Provider ID: ${noteData.providerId}`;

  return (
    <PageLayout variant="gradient">
      <PageHeader
        icon={Calendar}
        title="Cancellation Note"
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
              <span>{format(new Date(noteData.createdAt), 'PPP')}</span>
            </div>
          </div>
        }
        badge={
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(noteData.status)}>
              {noteData.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge variant="outline">Cancellation Note</Badge>
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
            <Button 
              variant="outline"
              onClick={() => navigate(`/notes/cancellation-note/${noteId}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate(`/notes/${noteId}/history`)}
            >
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Session Information Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Session Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoSection title="Session Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoDisplay 
                  label="Scheduled Session Date" 
                  value={noteData.content.sessionDate ? format(new Date(noteData.content.sessionDate), 'PPP') : null} 
                />
                <InfoDisplay 
                  label="Scheduled Session Time" 
                  value={noteData.content.sessionTime} 
                />
                <InfoDisplay 
                  label="Note Date" 
                  value={noteData.content.noteDate ? format(new Date(noteData.content.noteDate), 'PPP') : null} 
                />
              </div>
            </InfoSection>
          </CardContent>
        </Card>

        {/* Cancellation Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Cancellation Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoSection title="Cancellation Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoDisplay 
                  label="Cancellation Initiated By" 
                  value={getCancellationInitiatorLabel(noteData.content.cancellationInitiator)} 
                />
                <InfoDisplay 
                  label="Notification Method" 
                  value={getNotificationMethodLabel(noteData.content.notificationMethod)} 
                />
                <InfoDisplay 
                  label="Advance Notice" 
                  value={noteData.content.advanceNoticeHours ? `${noteData.content.advanceNoticeHours} hours` : null} 
                />
                <InfoDisplay 
                  label="Reason for Cancellation" 
                  value={noteData.content.cancellationReason} 
                />
              </div>
            </InfoSection>
          </CardContent>
        </Card>

        {/* Billing & Policy Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Billing & Policy Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoSection title="Billing Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoDisplay 
                  label="Billing Status" 
                  value={getBillingStatusLabel(noteData.content.billingStatus)} 
                />
                <InfoDisplay 
                  label="Charge Amount" 
                  value={noteData.content.chargeAmount ? `$${noteData.content.chargeAmount}` : null} 
                />
                <InfoDisplay 
                  label="Policy Violation" 
                  value={noteData.content.policyViolation ? 'Yes' : 'No'} 
                />
                {noteData.content.policyViolation && (
                  <InfoDisplay 
                    label="Policy Violation Details" 
                    value={noteData.content.policyDetails} 
                  />
                )}
              </div>
            </InfoSection>
          </CardContent>
        </Card>

        {/* Rescheduling Section */}
        {noteData.content.willReschedule && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Rescheduling Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoSection title="Rescheduling Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoDisplay 
                    label="Will Reschedule" 
                    value="Yes" 
                  />
                  <InfoDisplay 
                    label="New Session Date" 
                    value={noteData.content.rescheduleDate ? format(new Date(noteData.content.rescheduleDate), 'PPP') : null} 
                  />
                  <InfoDisplay 
                    label="New Session Time" 
                    value={noteData.content.rescheduleTime} 
                  />
                  <InfoDisplay 
                    label="Rescheduling Notes" 
                    value={noteData.content.rescheduleNotes} 
                  />
                </div>
              </InfoSection>
            </CardContent>
          </Card>
        )}

        {/* Follow-up & Provider Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle>Follow-up & Provider Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoSection title="Follow-up Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoDisplay 
                  label="Follow-up Required" 
                  value={noteData.content.followUpRequired ? 'Yes' : 'No'} 
                />
                <InfoDisplay 
                  label="Provider Notes" 
                  value={noteData.content.providerNotes} 
                />
              </div>
            </InfoSection>
          </CardContent>
        </Card>

        {/* Note Status Section */}
        <Card>
          <CardHeader>
            <CardTitle>Note Status</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoSection title="Status Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoDisplay 
                  label="Status" 
                  value={noteData.status.replace('_', ' ').toUpperCase()} 
                />
                <InfoDisplay 
                  label="Created" 
                  value={format(new Date(noteData.createdAt), 'PPP p')} 
                />
                <InfoDisplay 
                  label="Last Updated" 
                  value={format(new Date(noteData.updatedAt), 'PPP p')} 
                />
                {noteData.signedAt && (
                  <InfoDisplay 
                    label="Signed At" 
                    value={format(new Date(noteData.signedAt), 'PPP p')} 
                  />
                )}
                {noteData.signedBy && (
                  <InfoDisplay 
                    label="Signed By" 
                    value={noteData.signedBy} 
                  />
                )}
              </div>
            </InfoSection>
          </CardContent>
        </Card>

        {/* Finalization Status */}
        {noteData.status === 'signed' && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Note Finalized</p>
                  <p className="text-sm text-green-800">
                    Signed by: {noteData.signedBy} on {noteData.signedAt && format(new Date(noteData.signedAt), 'PPP p')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default CancellationNoteViewPage;

