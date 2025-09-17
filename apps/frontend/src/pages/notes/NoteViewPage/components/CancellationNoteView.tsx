import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { InfoDisplay, InfoSection } from '@/components/basic/InfoDisplay';
import { Calendar, AlertTriangle, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { 
  CANCELLATION_INITIATORS, 
  NOTIFICATION_METHODS, 
  BILLING_STATUS_OPTIONS 
} from '@/types/enums/notesEnum';

interface CancellationNoteViewProps {
  noteData: any;
}

const CancellationNoteView: React.FC<CancellationNoteViewProps> = ({ noteData }) => {
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

  return (
    <>
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
    </>
  );
};

export default CancellationNoteView;
