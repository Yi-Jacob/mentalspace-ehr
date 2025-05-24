import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Phone, Mail, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ClientFormData, PhoneNumber, EmergencyContact, InsuranceInfo, PrimaryCareProvider } from '@/types/client';
import AddClientModal from './AddClientModal';

const ClientDetailView = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<ClientFormData | null>(null);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [insuranceInfo, setInsuranceInfo] = useState<InsuranceInfo[]>([]);
  const [primaryCareProvider, setPrimaryCareProvider] = useState<PrimaryCareProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchClientDetails = async () => {
    if (!clientId) return;
    
    try {
      // Fetch client data
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError) {
        console.error('Error fetching client:', clientError);
        toast({
          title: "Error",
          description: "Failed to load client details",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setClient(clientData);

      // Fetch phone numbers
      const { data: phoneData } = await supabase
        .from('client_phone_numbers')
        .select('*')
        .eq('client_id', clientId);

      if (phoneData) {
        setPhoneNumbers(phoneData.map(phone => ({
          type: phone.phone_type as any,
          number: phone.phone_number,
          message_preference: phone.message_preference as any
        })));
      }

      // Fetch emergency contacts
      const { data: contactData } = await supabase
        .from('client_emergency_contacts')
        .select('*')
        .eq('client_id', clientId);

      if (contactData) {
        setEmergencyContacts(contactData.map(contact => ({
          name: contact.name,
          relationship: contact.relationship || '',
          phone_number: contact.phone_number || '',
          email: contact.email || '',
          is_primary: contact.is_primary || false
        })));
      }

      // Fetch insurance information
      const { data: insuranceData } = await supabase
        .from('client_insurance')
        .select('*')
        .eq('client_id', clientId);

      if (insuranceData) {
        setInsuranceInfo(insuranceData.map(insurance => ({
          insurance_type: insurance.insurance_type as any,
          insurance_company: insurance.insurance_company || '',
          policy_number: insurance.policy_number || '',
          group_number: insurance.group_number || '',
          subscriber_name: insurance.subscriber_name || '',
          subscriber_relationship: insurance.subscriber_relationship || '',
          subscriber_dob: insurance.subscriber_dob || '',
          effective_date: insurance.effective_date || '',
          termination_date: insurance.termination_date || '',
          copay_amount: insurance.copay_amount || 0,
          deductible_amount: insurance.deductible_amount || 0
        })));
      }

      // Fetch primary care provider
      const { data: pcpData } = await supabase
        .from('client_primary_care_providers')
        .select('*')
        .eq('client_id', clientId)
        .single();

      if (pcpData) {
        setPrimaryCareProvider({
          provider_name: pcpData.provider_name || '',
          practice_name: pcpData.practice_name || '',
          phone_number: pcpData.phone_number || '',
          address: pcpData.address || ''
        });
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
                    
                    {phoneNumbers.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone Numbers</label>
                        <div className="space-y-1">
                          {phoneNumbers.map((phone, index) => (
                            <div key={index} className="text-sm">
                              <span className="font-medium">{phone.type}:</span> {phone.number}
                              {phone.message_preference !== 'No messages' && (
                                <span className="text-gray-500 ml-2">({phone.message_preference})</span>
                              )}
                            </div>
                          ))}
                        </div>
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

              {emergencyContacts.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">Emergency Contacts</h3>
                  <div className="space-y-3">
                    {emergencyContacts.map((contact, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Name</label>
                            <div className="font-medium">{contact.name}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Relationship</label>
                            <div>{contact.relationship}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Phone</label>
                            <div>{contact.phone_number}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <div>{contact.email}</div>
                          </div>
                        </div>
                        {contact.is_primary && (
                          <Badge variant="outline" className="mt-2">Primary Contact</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {primaryCareProvider && primaryCareProvider.provider_name && (
                <div>
                  <h3 className="font-semibold text-lg mb-4">Primary Care Provider</h3>
                  <div className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Provider Name</label>
                        <div className="font-medium">{primaryCareProvider.provider_name}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Practice Name</label>
                        <div>{primaryCareProvider.practice_name}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <div>{primaryCareProvider.phone_number}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <div>{primaryCareProvider.address}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
              {insuranceInfo.length > 0 ? (
                <div className="space-y-6">
                  {insuranceInfo.map((insurance, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-lg">{insurance.insurance_type} Insurance</h4>
                        <Badge variant="outline">{insurance.insurance_company}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insurance.policy_number && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Policy Number</label>
                            <div>{insurance.policy_number}</div>
                          </div>
                        )}
                        {insurance.group_number && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Group Number</label>
                            <div>{insurance.group_number}</div>
                          </div>
                        )}
                        {insurance.subscriber_name && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Subscriber</label>
                            <div>{insurance.subscriber_name} ({insurance.subscriber_relationship})</div>
                          </div>
                        )}
                        {insurance.effective_date && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Effective Date</label>
                            <div>{new Date(insurance.effective_date).toLocaleDateString()}</div>
                          </div>
                        )}
                        {insurance.copay_amount > 0 && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Copay</label>
                            <div>${insurance.copay_amount}</div>
                          </div>
                        )}
                        {insurance.deductible_amount > 0 && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Deductible</label>
                            <div>${insurance.deductible_amount}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No insurance information found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing-settings">
          <Card>
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
            </CardHeader>
            <CardContent>
              {insuranceInfo.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Insurance Information</h4>
                    <div className="space-y-2">
                      {insuranceInfo.map((insurance, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <span className="font-medium">{insurance.insurance_type}: </span>
                            <span>{insurance.insurance_company}</span>
                          </div>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No billing settings configured.
                </div>
              )}
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
