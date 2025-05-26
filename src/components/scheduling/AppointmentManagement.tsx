
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar, Clock, User, MapPin, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import CreateAppointmentModal from './CreateAppointmentModal';
import AppointmentWaitlist from './AppointmentWaitlist';

const AppointmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments-management', searchTerm, statusFilter, typeFilter],
    queryFn: async () => {
      let query = supabase
        .from('appointments')
        .select(`
          id,
          title,
          client_id,
          provider_id,
          appointment_type,
          start_time,
          end_time,
          status,
          location,
          room_number,
          notes,
          client:clients(first_name, last_name),
          provider:users(first_name, last_name)
        `)
        .order('start_time', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (typeFilter !== 'all') {
        query = query.eq('appointment_type', typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      let filteredData = data || [];
      
      if (searchTerm) {
        filteredData = filteredData.filter(appointment => {
          const clientName = appointment.client 
            ? `${appointment.client.first_name} ${appointment.client.last_name}`
            : '';
          const providerName = appointment.provider
            ? `${appointment.provider.first_name} ${appointment.provider.last_name}`
            : '';
          
          return (
            clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (appointment.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.appointment_type.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
      }

      return filteredData;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'checked_in':
        return 'bg-purple-100 text-purple-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Appointment Management</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="initial_consultation">Initial Consultation</SelectItem>
                <SelectItem value="follow_up">Follow-up</SelectItem>
                <SelectItem value="therapy_session">Therapy Session</SelectItem>
                <SelectItem value="group_therapy">Group Therapy</SelectItem>
                <SelectItem value="assessment">Assessment</SelectItem>
                <SelectItem value="medication_management">Medication Management</SelectItem>
                <SelectItem value="crisis_intervention">Crisis Intervention</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setTypeFilter('all');
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading appointments...</div>
              ) : appointments?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No appointments found matching your criteria.
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments?.map((appointment) => {
                    const clientName = appointment.client 
                      ? `${appointment.client.first_name} ${appointment.client.last_name}`
                      : 'Unknown Client';
                    const providerName = appointment.provider
                      ? `${appointment.provider.first_name} ${appointment.provider.last_name}`
                      : 'Unknown Provider';

                    return (
                      <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium">
                                {appointment.title || `${appointment.appointment_type.replace('_', ' ')}`}
                              </h3>
                              <Badge className={getStatusColor(appointment.status)}>
                                {appointment.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>{clientName}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4" />
                                <span>{format(new Date(appointment.start_time), 'MMM d, yyyy')}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {format(new Date(appointment.start_time), 'HH:mm')} - 
                                  {format(new Date(appointment.end_time), 'HH:mm')}
                                </span>
                              </div>
                              {appointment.location && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{appointment.location}</span>
                                </div>
                              )}
                            </div>
                            {appointment.notes && (
                              <p className="text-sm text-gray-600 mt-2 italic">
                                {appointment.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <AppointmentWaitlist />
        </div>
      </div>

      <CreateAppointmentModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
};

export default AppointmentManagement;
