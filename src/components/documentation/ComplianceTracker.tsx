
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';
import { format, differenceInHours, differenceInDays } from 'date-fns';

const ComplianceTracker = () => {
  const { data: complianceData, isLoading } = useQuery({
    queryKey: ['compliance-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinical_notes')
        .select(`
          *,
          clients!inner(first_name, last_name),
          provider:users!clinical_notes_provider_id_fkey(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

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

  // Calculate compliance metrics
  const now = new Date();
  const totalNotes = complianceData?.length || 0;
  
  const signedWithin24h = complianceData?.filter(note => {
    if (!note.signed_at) return false;
    const hoursDiff = differenceInHours(new Date(note.signed_at), new Date(note.created_at));
    return hoursDiff <= 24;
  }).length || 0;

  const signedWithin48h = complianceData?.filter(note => {
    if (!note.signed_at) return false;
    const hoursDiff = differenceInHours(new Date(note.signed_at), new Date(note.created_at));
    return hoursDiff <= 48;
  }).length || 0;

  const unsignedNotes = complianceData?.filter(note => !note.signed_at).length || 0;
  
  const overdueNotes = complianceData?.filter(note => {
    if (note.signed_at) return false;
    const hoursDiff = differenceInHours(now, new Date(note.created_at));
    return hoursDiff > 72;
  }).length || 0;

  const compliance24h = totalNotes > 0 ? (signedWithin24h / totalNotes) * 100 : 0;
  const compliance48h = totalNotes > 0 ? (signedWithin48h / totalNotes) * 100 : 0;

  const getComplianceStatus = (note: any) => {
    if (note.signed_at) {
      const hoursDiff = differenceInHours(new Date(note.signed_at), new Date(note.created_at));
      if (hoursDiff <= 24) return { status: 'excellent', label: 'Signed within 24h', color: 'bg-green-100 text-green-800' };
      if (hoursDiff <= 48) return { status: 'good', label: 'Signed within 48h', color: 'bg-blue-100 text-blue-800' };
      if (hoursDiff <= 72) return { status: 'acceptable', label: 'Signed within 72h', color: 'bg-yellow-100 text-yellow-800' };
      return { status: 'late', label: 'Signed late', color: 'bg-orange-100 text-orange-800' };
    } else {
      const hoursDiff = differenceInHours(now, new Date(note.created_at));
      if (hoursDiff > 72) return { status: 'overdue', label: 'Overdue (>72h)', color: 'bg-red-100 text-red-800' };
      return { status: 'pending', label: 'Pending signature', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">24h Compliance</p>
                <p className="text-2xl font-bold text-green-600">{compliance24h.toFixed(1)}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={compliance24h} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">48h Compliance</p>
                <p className="text-2xl font-bold text-blue-600">{compliance48h.toFixed(1)}%</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={compliance48h} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unsigned Notes</p>
                <p className="text-2xl font-bold text-gray-600">{unsignedNotes}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Notes</p>
                <p className="text-2xl font-bold text-red-600">{overdueNotes}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Compliance List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documentation Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complianceData?.slice(0, 20).map((note) => {
              const compliance = getComplianceStatus(note);
              return (
                <div key={note.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium">{note.title}</h4>
                      <Badge className={compliance.color}>
                        {compliance.label}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {note.clients?.first_name} {note.clients?.last_name} • 
                      Created: {format(new Date(note.created_at), 'MMM d, yyyy h:mm a')}
                      {note.signed_at && (
                        <> • Signed: {format(new Date(note.signed_at), 'MMM d, yyyy h:mm a')}</>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {note.provider?.first_name} {note.provider?.last_name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceTracker;
