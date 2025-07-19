import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApiMiddleware, useRateLimitStatus } from '@/hooks/useApiMiddleware';
import { CheckCircle, XCircle, Clock, Shield, Database } from 'lucide-react';

export const APITestComponent: React.FC = () => {
  const [clientData, setClientData] = useState({
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    date_of_birth: '1990-01-01'
  });

  const [noteData, setNoteData] = useState({
    title: 'Test Progress Note',
    content: { subjective: 'Patient reports feeling better' },
    client_id: '',
    note_type: 'progress_note'
  });

  const { 
    isLoading, 
    error, 
    createClient, 
    createClinicalNote, 
    fetchWithRateLimit,
    clearError 
  } = useApiMiddleware();

  const { rateLimitInfo, checkRateLimit } = useRateLimitStatus();

  const handleCreateClient = async () => {
    clearError();
    const result = await createClient(clientData);
    if (result) {
      console.log('Client created:', result);
      setNoteData(prev => ({ ...prev, client_id: result.id }));
    }
  };

  const handleCreateNote = async () => {
    clearError();
    if (!noteData.client_id) {
      alert('Please create a client first');
      return;
    }
    const result = await createClinicalNote(noteData);
    if (result) {
      console.log('Note created:', result);
    }
  };

  const handleRateLimitTest = async () => {
    await checkRateLimit('/rest/v1/clients');
  };

  const handleFetchTest = async () => {
    clearError();
    const result = await fetchWithRateLimit(
      async () => {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data, error } = await supabase.from('clients').select('*').limit(5);
        if (error) throw error;
        return data;
      },
      '/rest/v1/clients'
    );
    
    if (result) {
      console.log('Fetched clients:', result);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">API Middleware Test Dashboard</h1>
        <p className="text-muted-foreground">
          Test the Backend/API Layer enhancements including rate limiting, validation, and logging
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limiting</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">Edge function deployed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Input Validation</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">Zod schemas implemented</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Logging</CardTitle>
            <Database className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">Edge function deployed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OpenAPI Docs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Ready</div>
            <p className="text-xs text-muted-foreground">Specification generated</p>
          </CardContent>
        </Card>
      </div>

      {/* Rate Limit Status */}
      {rateLimitInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Rate Limit Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Badge variant="outline">
                Limit: {rateLimitInfo.limit}
              </Badge>
              <Badge variant={rateLimitInfo.remaining > 10 ? "default" : "destructive"}>
                Remaining: {rateLimitInfo.remaining}
              </Badge>
              <Badge variant="outline">
                Reset: {new Date(rateLimitInfo.reset).toLocaleTimeString()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Creation Test */}
        <Card>
          <CardHeader>
            <CardTitle>Test Client Creation (with Validation)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={clientData.first_name}
                  onChange={(e) => setClientData(prev => ({ ...prev, first_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={clientData.last_name}
                  onChange={(e) => setClientData(prev => ({ ...prev, last_name: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={clientData.email}
                onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={clientData.date_of_birth}
                onChange={(e) => setClientData(prev => ({ ...prev, date_of_birth: e.target.value }))}
              />
            </div>
            <Button 
              onClick={handleCreateClient} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating...' : 'Create Client (Test Validation)'}
            </Button>
          </CardContent>
        </Card>

        {/* Clinical Note Test */}
        <Card>
          <CardHeader>
            <CardTitle>Test Clinical Note Creation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="noteTitle">Note Title</Label>
              <Input
                id="noteTitle"
                value={noteData.title}
                onChange={(e) => setNoteData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                value={noteData.client_id}
                onChange={(e) => setNoteData(prev => ({ ...prev, client_id: e.target.value }))}
                placeholder="Create a client first or enter UUID"
              />
            </div>
            <Button 
              onClick={handleCreateNote} 
              disabled={isLoading || !noteData.client_id}
              className="w-full"
            >
              {isLoading ? 'Creating...' : 'Create Note (Test Validation)'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* API Test Actions */}
      <Card>
        <CardHeader>
          <CardTitle>API Middleware Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={handleRateLimitTest}
              variant="outline"
              className="w-full"
            >
              Test Rate Limiting
            </Button>
            <Button 
              onClick={handleFetchTest}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Fetching...' : 'Test Fetch with Logging'}
            </Button>
            <Button 
              onClick={() => {
                // Try to trigger validation error
                createClient({ first_name: '', email: 'invalid-email' });
              }}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              Test Validation Error
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Status */}
      <Card>
        <CardHeader>
          <CardTitle>Backend/API Layer Enhancement Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>✅ Rate Limiting Edge Function</span>
              <Badge variant="default">Implemented</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>✅ Request/Response Logging</span>
              <Badge variant="default">Implemented</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>✅ Input Validation Middleware</span>
              <Badge variant="default">Implemented</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>✅ OpenAPI Documentation</span>
              <Badge variant="default">Generated</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>✅ Database Tables & Functions</span>
              <Badge variant="default">Created</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>✅ Security Headers</span>
              <Badge variant="default">Configured</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};