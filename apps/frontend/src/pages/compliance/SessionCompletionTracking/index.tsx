import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Clock, AlertTriangle, CheckCircle, Lock, Unlock, Plus, Edit, Trash2 } from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/basic/card';
import { Button } from '@/components/basic/button';
import { Badge } from '@/components/basic/badge';
import { useAuth } from '@/hooks/useAuth';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { apiClient } from '@/services/api-helper/client';
import CreateSessionModal from './components/CreateSessionModal';

interface SessionCompletion {
  id: string;
  appointmentId: string;
  providerId: string;
  clientId: string;
  sessionType: string;
  durationMinutes: number;
  sessionDate: string;
  noteId?: string;
  isNoteSigned: boolean;
  noteSignedAt?: string;
  isLocked: boolean;
  lockedAt?: string;
  calculatedAmount?: number;
  payPeriodWeek: string;
  isPaid: boolean;
  supervisorOverrideBy?: string;
  supervisorOverrideReason?: string;
  supervisorOverrideAt?: string;
  client: {
    firstName: string;
    lastName: string;
  };
}

interface CreateSessionCompletionDto {
  appointmentId: string;
  providerId: string;
  clientId: string;
  sessionType: string;
  durationMinutes: number;
  sessionDate: string;
}

const SessionCompletionTracking: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionCompletion | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<CreateSessionCompletionDto>({
    appointmentId: '',
    providerId: '',
    clientId: '',
    sessionType: '',
    durationMinutes: 60,
    sessionDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (user?.id) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get<SessionCompletion[]>(`/compliance/session-completion?providerId=${user?.id}`);
      setSessions(response.data);
    } catch (err) {
      setError('Failed to load sessions');
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (data: CreateSessionCompletionDto) => {
    try {
      setError(null);
      
      const response = await apiClient.post<SessionCompletion>('/compliance/session-completion', {
        ...data,
        providerId: user?.id,
      });
      
      setSessions(prev => [response.data, ...prev]);
      setShowCreateModal(false);
      setFormData({
        appointmentId: '',
        providerId: '',
        clientId: '',
        sessionType: '',
        durationMinutes: 60,
        sessionDate: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setError('Failed to create session');
      console.error('Error creating session:', err);
    }
  };

  const handleSignNote = async (sessionId: string) => {
    try {
      setError(null);
      
      await apiClient.post(`/compliance/session-completion/${sessionId}/sign-note`, {
        signedBy: user?.id,
      });
      
      // Reload sessions to get updated data
      await loadSessions();
    } catch (err) {
      setError('Failed to sign note');
      console.error('Error signing note:', err);
    }
  };

  const handleLockSession = async (sessionId: string) => {
    try {
      setError(null);
      
      await apiClient.post(`/compliance/session-completion/${sessionId}/lock-session`, {
        lockedBy: user?.id,
        reason: 'Session locked by provider',
      });
      
      await loadSessions();
    } catch (err) {
      setError('Failed to lock session');
      console.error('Error locking session:', err);
    }
  };

  const handleUnlockSession = async (sessionId: string) => {
    try {
      setError(null);
      
      await apiClient.post(`/compliance/session-completion/${sessionId}/supervisor-override`, {
        overrideBy: user?.id,
        reason: 'Session unlocked by supervisor',
      });
      
      await loadSessions();
    } catch (err) {
      setError('Failed to unlock session');
      console.error('Error unlocking session:', err);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    try {
      setError(null);
      
      await apiClient.delete(`/compliance/session-completion/${sessionId}`);
      
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (err) {
      setError('Failed to delete session');
      console.error('Error deleting session:', err);
    }
  };

  const getStatusBadge = (session: SessionCompletion) => {
    if (session.isLocked) {
      return <Badge variant="destructive">Locked</Badge>;
    }
    if (session.isNoteSigned) {
      return <Badge variant="default">Signed</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  const getDeadlineStatus = (session: SessionCompletion) => {
    const payPeriodStart = new Date(session.payPeriodWeek);
    const deadline = new Date(payPeriodStart);
    deadline.setDate(payPeriodStart.getDate() + 6); // Saturday
    deadline.setHours(23, 59, 59, 999);
    
    const now = new Date();
    const isDeadlinePassed = now > deadline;
    
    if (session.isNoteSigned) {
      return <span className="text-green-600">✓ Completed</span>;
    }
    
    if (isDeadlinePassed) {
      return <span className="text-red-600">⚠ Overdue</span>;
    }
    
    return <span className="text-yellow-600">⏰ Pending</span>;
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading sessions...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Session Management"
        description="Manage therapy session completions, notes, and compliance"
      />

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Session
        </Button>
      </div>

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No sessions found. Create your first session to get started.</p>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">
                        {session.client.firstName} {session.client.lastName}
                      </h3>
                      {getStatusBadge(session)}
                      {getDeadlineStatus(session)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Type:</span> {session.sessionType}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {session.durationMinutes} min
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {format(new Date(session.sessionDate), 'MMM dd, yyyy')}
                      </div>
                      <div>
                        <span className="font-medium">Amount:</span> ${session.calculatedAmount?.toFixed(2) || '0.00'}
                      </div>
                    </div>

                    {session.noteId && (
                      <div className="mt-3 text-sm text-gray-600">
                        <span className="font-medium">Note ID:</span> {session.noteId}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {!session.isNoteSigned && !session.isLocked && (
                      <Button
                        size="sm"
                        onClick={() => handleSignNote(session.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Sign Note
                      </Button>
                    )}
                    
                    {!session.isLocked && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLockSession(session.id)}
                      >
                        <Lock className="w-4 h-4 mr-1" />
                        Lock
                      </Button>
                    )}
                    
                    {session.isLocked && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUnlockSession(session.id)}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <Unlock className="w-4 h-4 mr-1" />
                        Unlock
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteSession(session.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Session Modal */}
      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSession}
        formData={formData}
        setFormData={setFormData}
        providerId={user?.id || ''}
      />
    </PageLayout>
  );
};

export default SessionCompletionTracking;
