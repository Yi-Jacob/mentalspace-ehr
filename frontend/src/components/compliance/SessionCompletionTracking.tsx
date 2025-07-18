import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, Clock, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SessionCompletionTracking: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'signed' | 'unsigned' | 'locked'>('all');
  const [providerFilter, setProviderFilter] = useState('all');

  const { data: providers } = useQuery({
    queryKey: ['providers-for-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_roles!inner(role)
        `)
        .eq('user_roles.role', 'Clinician')
        .eq('user_roles.is_active', true);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: sessionCompletions, isLoading } = useQuery({
    queryKey: ['session-completions', searchTerm, statusFilter, providerFilter],
    queryFn: async () => {
      let query = supabase
        .from('session_completions')
        .select(`
          *,
          provider:users!session_completions_provider_id_fkey(first_name, last_name),
          client:clients(first_name, last_name),
          note:clinical_notes(id, status)
        `)
        .order('session_date', { ascending: false });

      if (statusFilter === 'signed') {
        query = query.eq('is_note_signed', true);
      } else if (statusFilter === 'unsigned') {
        query = query.eq('is_note_signed', false).eq('is_locked', false);
      } else if (statusFilter === 'locked') {
        query = query.eq('is_locked', true);
      }

      if (providerFilter) {
        query = query.eq('provider_id', providerFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const getStatusIcon = (completion: any) => {
    if (completion.is_locked) {
      return <Lock className="h-4 w-4 text-red-600" />;
    } else if (completion.is_note_signed) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (completion: any) => {
    if (completion.is_locked) {
      return 'bg-red-100 text-red-800';
    } else if (completion.is_note_signed) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (completion: any) => {
    if (completion.is_locked) {
      return 'Locked';
    } else if (completion.is_note_signed) {
      return 'Note Signed';
    } else {
      return 'Pending Note';
    }
  };

  const formatSessionType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading session completions...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value: 'all' | 'signed' | 'unsigned' | 'locked') => setStatusFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sessions</SelectItem>
              <SelectItem value="signed">Note Signed</SelectItem>
              <SelectItem value="unsigned">Pending Note</SelectItem>
              <SelectItem value="locked">Locked</SelectItem>
            </SelectContent>
          </Select>

          <Select value={providerFilter} onValueChange={setProviderFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by provider..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providers?.map((provider) => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.first_name} {provider.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sessionCompletions?.map((completion) => (
          <Card key={completion.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-lg">
                      {completion.client?.first_name} {completion.client?.last_name}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(completion)}
                      <Badge className={getStatusColor(completion)}>
                        {getStatusText(completion)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Provider:</strong> {completion.provider?.first_name} {completion.provider?.last_name}
                    </div>
                    <div>
                      <strong>Session Date:</strong> {new Date(completion.session_date).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Session Type:</strong> {formatSessionType(completion.session_type)}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span><strong>Duration:</strong> {completion.duration_minutes} min</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {completion.calculated_amount && (
                      <div>
                        <strong>Calculated Amount:</strong> ${parseFloat(completion.calculated_amount.toString()).toFixed(2)}
                      </div>
                    )}
                    {completion.pay_period_week && (
                      <div>
                        <strong>Pay Period:</strong> {new Date(completion.pay_period_week).toLocaleDateString()}
                      </div>
                    )}
                    <div>
                      <strong>Paid:</strong> {completion.is_paid ? 'Yes' : 'No'}
                    </div>
                    {completion.note_signed_at && (
                      <div>
                        <strong>Note Signed:</strong> {new Date(completion.note_signed_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {completion.is_locked && completion.locked_at && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 text-red-800">
                        <Lock className="h-4 w-4" />
                        <span className="font-medium">Session Locked</span>
                      </div>
                      <p className="text-red-700 text-sm mt-1">
                        Locked on {new Date(completion.locked_at).toLocaleString()} due to missed deadline
                      </p>
                    </div>
                  )}

                  {completion.supervisor_override_by && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 text-blue-800">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Supervisor Override</span>
                      </div>
                      <p className="text-blue-700 text-sm mt-1">
                        {completion.supervisor_override_reason}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {!completion.is_note_signed && !completion.is_locked && (
                    <Button size="sm" className="flex items-center space-x-1">
                      <FileText className="h-3 w-3" />
                      <span>Sign Note</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sessionCompletions?.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No session completions found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' || providerFilter !== 'all'
              ? 'No sessions match your search criteria.'
              : 'Session completions will appear here as appointments are completed.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionCompletionTracking;
