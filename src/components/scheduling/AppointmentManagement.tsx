
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Calendar, Clock, User, MapPin, Plus, Edit, Eye, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import CreateAppointmentModal from './CreateAppointmentModal';
import AppointmentWaitlist from './AppointmentWaitlist';

type AppointmentStatus = 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
type AppointmentType = 'initial_consultation' | 'follow_up' | 'therapy_session' | 'group_therapy' | 'assessment' | 'medication_management' | 'crisis_intervention' | 'other';

const AppointmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<AppointmentType | 'all'>('all');
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
          clients!client_id(first_name, last_name),
          users!provider_id(first_name, last_name)
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
          const clientName = appointment.clients 
            ? `${appointment.clients.first_name} ${appointment.clients.last_name}`
            : '';
          const providerName = appointment.users
            ? `${appointment.users.first_name} ${appointment.users.last_name}`
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
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      case 'confirmed':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'checked_in':
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      case 'in_progress':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
      case 'completed':
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300';
      case 'no_show':
        return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-white to-blue-50/30 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
            <Sparkles className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Appointment Management
            </h2>
            <p className="text-gray-600 mt-1">Manage and track all your appointments</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-blue-50/50 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <Filter className="h-5 w-5" />
            <span>Filters & Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 bg-white/70 backdrop-blur-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: AppointmentStatus | 'all') => setStatusFilter(value)}>
              <SelectTrigger className="bg-white/70 backdrop-blur-sm border-gray-200 focus:border-blue-400 transition-all duration-200 hover:bg-white/90">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-0 shadow-2xl backdrop-blur-sm">
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
            <Select value={typeFilter} onValueChange={(value: AppointmentType | 'all') => setTypeFilter(value)}>
              <SelectTrigger className="bg-white/70 backdrop-blur-sm border-gray-200 focus:border-blue-400 transition-all duration-200 hover:bg-white/90">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-0 shadow-2xl backdrop-blur-sm">
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
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-gray-200 transition-all duration-200 hover:border-blue-300"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <Calendar className="h-5 w-5" />
                <span>Appointments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                    <div className="text-gray-600 font-medium">Loading appointments...</div>
                  </div>
                </div>
              ) : appointments?.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
                  <p className="text-sm">No appointments match your current criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments?.map((appointment) => {
                    const clientName = appointment.clients 
                      ? `${appointment.clients.first_name} ${appointment.clients.last_name}`
                      : 'Unknown Client';
                    const providerName = appointment.users
                      ? `${appointment.users.first_name} ${appointment.users.last_name}`
                      : 'Unknown Provider';

                    return (
                      <div 
                        key={appointment.id} 
                        className="border-0 rounded-xl p-6 bg-gradient-to-r from-white to-blue-50/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 transform backdrop-blur-sm group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="font-semibold text-lg text-gray-800">
                                {appointment.title || `${appointment.appointment_type.replace('_', ' ')}`}
                              </h3>
                              <Badge className={`${getStatusColor(appointment.status)} border font-medium px-3 py-1`}>
                                {appointment.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">{clientName}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-green-500" />
                                <span>{format(new Date(appointment.start_time), 'MMM d, yyyy')}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-purple-500" />
                                <span>
                                  {format(new Date(appointment.start_time), 'HH:mm')} - 
                                  {format(new Date(appointment.end_time), 'HH:mm')}
                                </span>
                              </div>
                              {appointment.location && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-pink-500" />
                                  <span>{appointment.location}</span>
                                </div>
                              )}
                            </div>
                            {appointment.notes && (
                              <p className="text-sm text-gray-600 mt-3 p-3 bg-blue-50/50 rounded-lg italic border-l-4 border-blue-300">
                                {appointment.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="hover:bg-purple-50 transition-all duration-200"
                            >
                              <Eye className="h-4 w-4" />
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
