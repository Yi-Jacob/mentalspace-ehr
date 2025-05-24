
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Phone, Mail, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ClientFormData } from '@/types/client';
import AddClientModal from './AddClientModal';

const ClientDetailView = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<ClientFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchClientDetails = async () => {
    if (!clientId) return;
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) {
        console.error('Error fetching client:', error);
        toast({
          title: "Error",
          description: "Failed to load client details",
          variant: "destructive",
        });
        navigate('/');
      } else {
        setClient(data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [clientId]);

  const formatAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return '';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return `${age - 1} years`;
    }
    return `${age} years`;
  };

  const handleClientUpdated = () => {
    fetchClientDetails();
    setShowEditModal(false);
    toast({
      title: "Success",
      description: "Client updated successfully",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Client not found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clients
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {client.preferred_name && client.preferred_name !== client.first_name
                ? `${client.preferred_name} (${client.first_name}) ${client.last_name}`
                : `${client.first_name} ${client.last_name}`
              }
            </h1>
            <div className="flex items-center space-x-4 mt-1">
              {client.date_of_birth && (
                <span className="text-gray-500">{formatAge(client.date_of_birth)}</span>
              )}
              <Badge variant="outline">Active</Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button size="sm" variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button size="sm" variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button 
            size="sm" 
            onClick={() => setShowEditModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Quick Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Date of Birth</div>
                <div className="font-medium">
                  {client.date_of_birth ? new Date(client.date_of_birth).toLocaleDateString() : 'Not provided'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-medium">{client.email || 'Not provided'}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Location</div>
                <div className="font-medium">
                  {[client.city, client.state].filter(Boolean).join(', ') || 'Not provided'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-10">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="todo">To-Do</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="billing-settings">Billing Settings</TabsTrigger>
          <TabsTrigger value="clinicians">Clinicians</TabsTrigger>
          <TabsTrigger value="portal">Portal</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <div>{client.first_name} {client.middle_name} {client.last_name} {client.suffix}</div>
                    </div>
                    {client.preferred_name && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Preferred Name</label>
                        <div>{client.preferred_name}</div>
                      </div>
                    )}
                    {client.pronouns && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Pronouns</label>
                        <div>{client.pronouns}</div>
                      </div>
                    )}
                    {client.date_of_birth && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                        <div>{new Date(client.date_of_birth).toLocaleDateString()} ({formatAge(client.date_of_birth)})</div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {client.email && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <div>{client.email}</div>
                      </div>
                    )}
                    {(client.address_1 || client.city || client.state) && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <div>
                          {client.address_1}<br />
                          {client.address_2 && <>{client.address_2}<br /></>}
                          {[client.city, client.state, client.zip_code].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {client.patient_comments && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Comments</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {client.patient_comments}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="todo">
          <Card>
            <CardHeader>
              <CardTitle>To-Do Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                No to-do items found. This feature will be implemented in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                No appointments found. This feature will be implemented in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                No documents found. This feature will be implemented in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                No billing information found. This feature will be implemented in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing-settings">
          <Card>
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                No billing settings found. This feature will be implemented in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinicians">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Clinicians</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Assigned Clinician</label>
                  <div>{client.assigned_clinician_id === 'unassigned' ? 'Unassigned' : client.assigned_clinician_id}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portal">
          <Card>
            <CardHeader>
              <CardTitle>Client Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Portal management features will be implemented in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                No messages found. This feature will be implemented in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Client Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Insights and analytics will be implemented in a future update.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddClientModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onClientAdded={handleClientUpdated}
        editingClient={client}
      />
    </div>
  );
};

export default ClientDetailView;
