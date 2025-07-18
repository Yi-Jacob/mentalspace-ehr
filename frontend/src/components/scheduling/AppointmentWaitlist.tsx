
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, User, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const AppointmentWaitlist = () => {
  const { data: waitlistEntries, isLoading } = useQuery({
    queryKey: ['appointment-waitlist'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointment_waitlist')
        .select(`
          id,
          preferred_date,
          preferred_time_start,
          preferred_time_end,
          appointment_type,
          notes,
          priority,
          created_at,
          is_fulfilled,
          client:clients(first_name, last_name),
          provider:users(first_name, last_name)
        `)
        .eq('is_fulfilled', false)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const getPriorityColor = (priority: number) => {
    if (priority >= 3) return 'bg-red-100 text-red-800';
    if (priority === 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 3) return 'High';
    if (priority === 2) return 'Medium';
    return 'Low';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Waitlist</span>
          </CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add to Waitlist
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading waitlist...</div>
        ) : waitlistEntries?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No one on the waitlist</p>
            <p className="text-sm">Patients looking for earlier appointments will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {waitlistEntries?.map((entry) => {
              const clientName = entry.client 
                ? `${entry.client.first_name} ${entry.client.last_name}`
                : 'Unknown Client';

              return (
                <div key={entry.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-sm">{clientName}</span>
                    </div>
                    <Badge className={getPriorityColor(entry.priority)}>
                      {getPriorityLabel(entry.priority)}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {entry.preferred_date 
                          ? format(new Date(entry.preferred_date), 'MMM d, yyyy')
                          : 'Any date'
                        }
                      </span>
                    </div>
                    
                    {entry.preferred_time_start && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>
                          {entry.preferred_time_start} - {entry.preferred_time_end || 'End time not specified'}
                        </span>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium">Type:</span> {entry.appointment_type.replace('_', ' ')}
                    </div>
                    
                    {entry.notes && (
                      <div>
                        <span className="font-medium">Notes:</span> {entry.notes}
                      </div>
                    )}
                    
                    <div className="text-gray-400">
                      Added {format(new Date(entry.created_at), 'MMM d, yyyy')}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" className="text-xs">
                      Schedule
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      Notify
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentWaitlist;
